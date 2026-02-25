#!/usr/bin/env python3
"""
Mewgenics Save File Extractor
Extracts cat data from steamcampaign01.sav (SQLite database with LZ4-compressed blobs).

Room-first approach: only extracts cats that have a room assignment, then fetches
parent/grandparent data as needed for lineage info.

Outputs: mewgenics_cats.json with name, sex, stats, libido, aggression, room, parents, grandparents.

Usage:
    python get-the-data/mewgenics_extract.py                          # looks for steamcampaign01.sav in current dir
    python get-the-data/mewgenics_extract.py /path/to/steamcampaign01.sav
"""

import sqlite3
import struct
import json
import sys
import os


# =============================================================================
# LZ4 Block Decompression
# =============================================================================

def lz4_decompress_block(src: bytes, uncompressed_size: int) -> bytes:
    """Decompress an LZ4 block. Each cat blob starts with a uint32 uncompressed
    size, followed by the LZ4-compressed payload."""
    dst = bytearray()
    pos = 0
    while pos < len(src) and len(dst) < uncompressed_size:
        token = src[pos]; pos += 1
        lit_len = (token >> 4) & 0xF
        match_len = token & 0xF

        if lit_len == 15:
            while pos < len(src):
                extra = src[pos]; pos += 1
                lit_len += extra
                if extra != 255:
                    break

        if pos + lit_len > len(src):
            dst.extend(src[pos:])
            break
        dst.extend(src[pos:pos + lit_len])
        pos += lit_len

        if len(dst) >= uncompressed_size:
            break
        if pos + 2 > len(src):
            break

        offset = src[pos] | (src[pos + 1] << 8); pos += 2
        if offset == 0:
            break

        match_len += 4
        if (token & 0xF) == 15:
            while pos < len(src):
                extra = src[pos]; pos += 1
                match_len += extra
                if extra != 255:
                    break

        match_pos = len(dst) - offset
        if match_pos < 0:
            break
        for i in range(match_len):
            if match_pos + (i % offset) < len(dst):
                dst.append(dst[match_pos + (i % offset)])

    return bytes(dst[:uncompressed_size])


# =============================================================================
# Cat Blob Parser
# =============================================================================

def parse_cat_blob(key: int, blob: bytes) -> dict | None:
    """Parse a single cat record from its LZ4-compressed blob.

    Blob layout (after decompression):
        [0..3]   unknown int32
        [4..7]   unknown int32
        [8..11]  unknown int32
        [12..15] name_length (utf-16 chars)
        [16..19] padding (0)
        [20..]   name (utf-16-le, name_length * 2 bytes)

    After name:
        [+0..+3] tag_length (int32)
        [+4..+7] padding (0)
        [+8..]   tag string (ascii, e.g. "str", "lck", "star2")
        [+8+tag_length] sex byte: 0=male, 1=female, 2=herm

    Then variable-length fields until the sprite string ("male..." or "female..." + digits).

    Relative to sprite string offset (g):
        [g-8]   sprite string length (int32)
        [g-4]   padding (0)
        [g..]   sprite string (ascii: "male" or "female" + digits, length from header)

    After sprite string:
        [+0..+7]  unknown float64
        [+8..+34] 7× int32 stats: STR, DEX, CON, INT, SPD, CHA, LCK

    Libido & aggression are float64 (0.0-1.0) in the slot region after "None":
        slot 0 (None+8):  libido
        slot 4 (None+40): aggression
        Thresholds: <0.333=low, 0.333-0.667=average, >0.667=high
    """
    # Decompress
    if len(blob) < 8:
        return None
    claimed = struct.unpack_from('<I', blob, 0)[0]
    try:
        dec = lz4_decompress_block(blob[4:], claimed)
    except Exception:
        return None
    if len(dec) < 200:
        return None

    # Name
    name_len = struct.unpack_from('<I', dec, 12)[0]
    if name_len > 30 or struct.unpack_from('<I', dec, 16)[0] != 0:
        return None
    try:
        name = dec[20:20 + name_len * 2].decode('utf-16-le')
    except Exception:
        return None
    name_end = 20 + name_len * 2

    # Find gender/sprite string (e.g. "male15", "female52")
    # The string is preceded by a header: int32(str_len) + int32(0).
    # IMPORTANT: Use the header-declared length, NOT greedy digit scanning,
    # because some sprite IDs have digits that bleed into the next field
    # (e.g. header says 6 for "male15" but greedy scan would read "male159").
    gender_off = -1
    gender_str = ""
    for i in range(name_end, min(len(dec) - 6, name_end + 500)):
        if dec[i:i + 6] == b'female' or \
           (dec[i:i + 4] == b'male' and (i < 2 or dec[i - 2:i] != b'fe')):
            # Read the actual string length from the header at i-8
            if i >= 8:
                header_len = struct.unpack_from('<I', dec, i - 8)[0]
                header_pad = struct.unpack_from('<I', dec, i - 4)[0]
                if 4 <= header_len <= 20 and header_pad == 0:
                    gender_str = dec[i:i + header_len].decode('ascii', errors='replace')
                    gender_off = i
                    break
            # Fallback: greedy scan if header is invalid
            prefix_len = 6 if dec[i:i + 6] == b'female' else 4
            end = i + prefix_len
            while end < len(dec) and chr(dec[end]).isdigit():
                end += 1
            gender_str = dec[i:end].decode('ascii')
            gender_off = i
            break

    if not gender_str or gender_off < 16:
        return None

    # Stats (7× int32 starting 8 bytes after gender string)
    gs_end = gender_off + len(gender_str)
    if gs_end + 36 > len(dec):
        return None
    stats = [struct.unpack_from('<i', dec, gs_end + 8 + j * 4)[0] for j in range(7)]
    if any(s < -10 or s > 30 for s in stats):
        return None

    # Libido & aggression are stored as float64 values (0.0-1.0) in the slot
    # region after the "None" marker. Slot layout (8 bytes each):
    #   slot 0: libido (float64, 0-1)
    #   slot 1: unknown float64
    #   slot 2: loves_key (int32 + 4 pad)
    #   slot 3: unknown float64
    #   slot 4: aggression (float64, 0-1)
    #   slot 5: hates_key (int32 + 4 pad)
    # Thresholds: 0-0.333 = low, 0.333-0.667 = average, 0.667-1.0 = high
    libido_raw = 0.5
    aggression_raw = 0.5
    none_off = dec.find(b'None', name_end)
    if none_off < 0:
        none_off = dec.find(b'none', name_end)
    if none_off >= 0:
        slot_base = none_off + 8
        if slot_base + 40 <= len(dec):
            libido_raw = struct.unpack_from('<d', dec, slot_base)[0]
            aggression_raw = struct.unpack_from('<d', dec, slot_base + 32)[0]

    # Actual sex is stored as a byte right after the tag string that follows the name.
    # Layout after name: [int32 tag_len] [int32 pad=0] [tag_bytes] [sex_byte]
    # sex_byte: 0=male, 1=female, 2=herm
    tag_len = struct.unpack_from('<I', dec, name_end)[0]
    sex_byte_off = name_end + 8 + tag_len
    sex_byte = dec[sex_byte_off] if sex_byte_off < len(dec) else 0
    sex = {0: "male", 1: "female", 2: "herm"}.get(sex_byte, f"unknown({sex_byte})")

    # Parse loves/hates from float64 slot region
    # After the name, find the first "None" marker. Then skip 8 bytes (None + int32).
    # The following 8-byte slots contain: slot 2 = loves key, slot 5 = hates key.
    loves_key = -1
    hates_key = -1
    none_off = dec.find(b'None', name_end)
    if none_off < 0:
        none_off = dec.find(b'none', name_end)
    if none_off >= 0:
        slot_base = none_off + 8  # After None(4) + int32(4)
        loves_off = slot_base + 2 * 8
        hates_off = slot_base + 5 * 8
        if loves_off + 4 <= len(dec):
            v = struct.unpack_from('<I', dec, loves_off)[0]
            loves_key = -1 if v == 0xFFFFFFFF else v
        if hates_off + 4 <= len(dec):
            v = struct.unpack_from('<I', dec, hates_off)[0]
            hates_key = -1 if v == 0xFFFFFFFF else v

    def classify_trait(val):
        if val < 0.333:
            return "low"
        elif val < 0.667:
            return "average"
        return "high"

    return {
        "key": key,
        "name": name,
        "sex": sex,
        "STR": stats[0],
        "DEX": stats[1],
        "CON": stats[2],
        "INT": stats[3],
        "SPD": stats[4],
        "CHA": stats[5],
        "LCK": stats[6],
        "libido": classify_trait(libido_raw),
        "libido_raw": round(libido_raw, 4),
        "aggression": classify_trait(aggression_raw),
        "aggression_raw": round(aggression_raw, 4),
        "loves_key": loves_key,
        "hates_key": hates_key,
    }


# =============================================================================
# Room Assignment Parser (house_state)
# =============================================================================

def parse_room_assignments(house_state: bytes) -> dict[int, str]:
    """Parse the house_state blob to get cat_key -> room_name mapping.

    Correct layout (key comes FIRST, then room string, then coordinates):
        Header (8 bytes):
            [0..3]  int32 = 0
            [4..7]  int32 = entry count

        Per entry (starting at byte 8):
            int32(cat_key) + int32(0)                — 8 bytes: which cat
            int32(str_len) + int32(0) + room(ascii)  — 8+N bytes: room name
            float64(x) + float64(y) + float64(z)     — 24 bytes: position

        Total per entry: 16 + str_len + 24 bytes

    The last entry may be truncated (missing room string or coordinates).
    If we can still read the cat_key, we include it with room="?" so the
    caller can attempt to resolve it.
    """
    count = struct.unpack_from('<I', house_state, 4)[0]
    room_map = {}
    pos = 8  # entries start immediately after the 8-byte header

    for _ in range(count):
        # Need at least 16 bytes for cat_key + room string header
        if pos + 16 > len(house_state):
            break

        cat_key = struct.unpack_from('<I', house_state, pos)[0]
        # pad at pos+4 is always 0
        slen = struct.unpack_from('<I', house_state, pos + 8)[0]
        # pad at pos+12 is always 0

        # Skip entries with invalid/empty room strings (truncated tail entries)
        if slen < 1 or slen > 30:
            break

        # Need room string + 24 bytes of xyz coordinates
        if pos + 16 + slen + 24 > len(house_state):
            break

        room_name = house_state[pos + 16:pos + 16 + slen].decode('ascii')
        room_map[cat_key] = room_name
        pos = pos + 16 + slen + 24

    return room_map


# =============================================================================
# Pedigree Parser (parent/grandparent extraction)
# =============================================================================

def parse_pedigree(pedigree: bytes, max_cat_key: int) -> dict[int, tuple[int, int]]:
    """Parse the pedigree blob to extract parent pairs.

    The pedigree contains int64 values starting at offset 552. Parent relationships
    are stored as consecutive triplets: (child_key, parent2_key, parent1_key).

    Key insight: a child's database key is always HIGHER than both parents' keys,
    because children are created after parents. Filtering for child > both parents
    gives unique parent pairs for ~96% of bred cats.

    Returns: dict of child_key -> (parent1_key, parent2_key)
             where -1 means "stray / no parent on this side"
    """
    data_start = 552
    if len(pedigree) < data_start + 24:
        return {}

    # Read all int64 values
    all_vals = []
    for off in range(data_start, len(pedigree) - 8, 8):
        v = struct.unpack_from('<q', pedigree, off)[0]
        all_vals.append((off, v))

    def is_cat_or_sentinel(v):
        return (1 <= v <= max_cat_key) or v == -1

    parent_map = {}

    for i in range(len(all_vals) - 2):
        o1, v1 = all_vals[i]
        o2, v2 = all_vals[i + 1]
        o3, v3 = all_vals[i + 2]

        # Must be consecutive int64 positions
        if o2 - o1 != 8 or o3 - o2 != 8:
            continue
        # First value is child (valid cat key)
        if not (1 <= v1 <= max_cat_key):
            continue
        # Second and third are parents (cat keys or -1 sentinel)
        if not is_cat_or_sentinel(v2):
            continue
        if not is_cat_or_sentinel(v3):
            continue
        # Child key must be greater than both parent keys
        if v2 != -1 and v1 <= v2:
            continue
        if v3 != -1 and v1 <= v3:
            continue

        # Triplet order in file is (child, parent2, parent1) — swap to (parent1, parent2)
        parent1_key = v3  # second in file = parent1 in game
        parent2_key = v2  # first in file = parent2 in game

        pair = (parent1_key, parent2_key)
        if v1 not in parent_map:
            parent_map[v1] = pair
        elif parent_map[v1] != pair and pair != (-1, -1):
            if parent_map[v1] == (-1, -1):
                parent_map[v1] = pair
            # else: ambiguous (rare, ~9 cats) — keep first found

    return parent_map


# =============================================================================
# Main Extraction
# =============================================================================

def fetch_cat_blobs(cur, keys: set[int]) -> dict[int, dict]:
    """Fetch and parse cat blobs for a specific set of keys."""
    if not keys:
        return {}
    placeholders = ",".join("?" for _ in keys)
    cur.execute(f"SELECT key, data FROM cats WHERE key IN ({placeholders}) ORDER BY key",
                list(keys))
    cats = {}
    for key, blob in cur.fetchall():
        cat = parse_cat_blob(key, blob)
        if cat:
            cats[key] = cat
    return cats


def extract(save_path: str) -> list[dict]:
    """Extract cat data from a Mewgenics save file.

    Room-first approach:
        1. Parse room assignments to find housed cat keys
        2. Fetch cat blobs only for housed cats
        3. Parse pedigree to find parents & grandparents
        4. Fetch additional cat blobs for ancestor names

    Args:
        save_path: Path to steamcampaign01.sav

    Returns:
        List of cat dicts for housed cats with all extracted fields
    """
    conn = sqlite3.connect(save_path)
    cur = conn.cursor()

    # --- 1. Parse room assignments first ---
    cur.execute("SELECT data FROM files WHERE key='house_state'")
    row = cur.fetchone()
    room_map = parse_room_assignments(row[0]) if row else {}

    housed_keys = set(room_map.keys())
    if not housed_keys:
        conn.close()
        return []

    print(f"Found {len(housed_keys)} cats with room assignments")

    # --- 2. Fetch cat blobs only for housed cats ---
    housed_cats = fetch_cat_blobs(cur, housed_keys)
    # Remove keys that failed to parse
    housed_keys = set(housed_cats.keys())

    print(f"Parsed {len(housed_cats)} housed cat blobs")

    # --- 3. Parse pedigree to find parent/grandparent keys ---
    cur.execute("SELECT key FROM cats ORDER BY key DESC LIMIT 1")
    max_key = cur.fetchone()[0]

    cur.execute("SELECT data FROM files WHERE key='pedigree'")
    row = cur.fetchone()
    parent_map = parse_pedigree(row[0], max_key) if row else {}

    # Collect ancestor keys we need names for
    ancestor_keys = set()
    for key in housed_keys:
        c = housed_cats[key]
        p1_key, p2_key = parent_map.get(key, (-1, -1))
        for pk in [p1_key, p2_key]:
            if pk and pk > 0:
                ancestor_keys.add(pk)
                # Grandparents
                gp1, gp2 = parent_map.get(pk, (-1, -1))
                for gpk in [gp1, gp2]:
                    if gpk and gpk > 0:
                        ancestor_keys.add(gpk)
        # Loves/hates keys
        if c["loves_key"] > 0:
            ancestor_keys.add(c["loves_key"])
        if c["hates_key"] > 0:
            ancestor_keys.add(c["hates_key"])

    # Only fetch ancestors we don't already have
    missing_keys = ancestor_keys - housed_keys

    # --- 4. Fetch ancestor blobs for name lookups ---
    ancestor_cats = fetch_cat_blobs(cur, missing_keys)

    conn.close()

    print(f"Fetched {len(ancestor_cats)} additional ancestor blobs for name lookups")

    # --- Build name lookup from housed + ancestor cats ---
    all_parsed = {**housed_cats, **ancestor_cats}
    name_lookup = {k: v["name"] for k, v in all_parsed.items()}

    def get_name(key):
        if key is None or key <= 0:
            return ""
        return name_lookup.get(key, f"?key{key}")

    # --- Assemble output (housed cats only) ---
    output = []
    for key in sorted(housed_keys):
        c = housed_cats[key]
        p1_key, p2_key = parent_map.get(key, (-1, -1))

        # Grandparents: look up each parent's parents
        gp_keys = []
        for pk in [p1_key, p2_key]:
            if pk and pk > 0 and pk in parent_map:
                gp1, gp2 = parent_map[pk]
                gp_keys.extend([gp1, gp2])
            else:
                gp_keys.extend([-1, -1])

        is_stray = (p1_key <= 0 and p2_key <= 0)

        entry = {
            "name": c["name"],
            "id": c["name"].lower().replace(" ", "_"),
            "sex": c["sex"],
            "STR": c["STR"],
            "DEX": c["DEX"],
            "CON": c["CON"],
            "INT": c["INT"],
            "SPD": c["SPD"],
            "CHA": c["CHA"],
            "LCK": c["LCK"],
            "libido": c["libido"],
            "libido_raw": c["libido_raw"],
            "aggression": c["aggression"],
            "aggression_raw": c["aggression_raw"],
            "loves": get_name(c["loves_key"]),
            "hates": get_name(c["hates_key"]),
            "room": room_map.get(key, ""),
            "stray": is_stray,
            "parent1": get_name(p1_key),
            "parent2": get_name(p2_key),
            "grandparent1": get_name(gp_keys[0]),
            "grandparent2": get_name(gp_keys[1]),
            "grandparent3": get_name(gp_keys[2]),
            "grandparent4": get_name(gp_keys[3]),
        }
        output.append(entry)

    return output


# =============================================================================
# CLI
# =============================================================================

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]

    if args:
        save_path = args[0]
    else:
        save_path = "steamcampaign01.sav"

    if not os.path.exists(save_path):
        print(f"Error: Save file not found: {save_path}")
        print(f"Usage: python {sys.argv[0]} [path/to/steamcampaign01.sav]")
        sys.exit(1)


    cats = extract(save_path)

    # Ensure output is always a flat array of cat objects
    if isinstance(cats, list) and len(cats) > 0 and isinstance(cats[0], list):
        cats = cats[0]

    # Always write output to the get-the-data directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(script_dir, "mewgenics_cats.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(cats, f, indent=2, ensure_ascii=False)

    # Summary
    bred = sum(1 for c in cats if not c["stray"])
    strays = sum(1 for c in cats if c["stray"])

    print(f"\nExtracted {len(cats)} housed cats → {out_path}")
    print(f"  {strays} strays, {bred} bred")

    # Print table
    print(f"\n{'Name':<16} {'Sex':<6} {'STR':>3} {'DEX':>3} {'CON':>3} {'INT':>3} {'SPD':>3} {'CHA':>3} {'LCK':>3}  {'Libido':<8} {'Aggr':<8} {'Room':<14} {'Loves':<16} {'Hates':<16} {'Parent1':<14} {'Parent2':<14}")
    print("─" * 160)
    for c in cats:
        p1 = c["parent1"] or "—"
        p2 = c["parent2"] or "—"
        room = c["room"] or "—"
        loves = c["loves"] or "—"
        hates = c["hates"] or "—"
        print(f"{c['name']:<16} {c['sex']:<6} {c['STR']:>3} {c['DEX']:>3} {c['CON']:>3} {c['INT']:>3} {c['SPD']:>3} {c['CHA']:>3} {c['LCK']:>3}  {c['libido']:<8} {c['aggression']:<8} {room:<14} {loves:<16} {hates:<16} {p1:<14} {p2:<14}")


if __name__ == "__main__":
    main()
