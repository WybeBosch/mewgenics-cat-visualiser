import { useState, useEffect } from "react";

const STAT_ICONS = {
  STR: "💪",
  DEX: "🏹",
  CON: "➕",
  INT: "💡",
  SPD: "🥾",
  CHA: "💋",
  LCK: "🍀",
};

const STATS = ["STR", "DEX", "CON", "INT", "SPD", "CHA", "LCK"];

const DEFAULT_ROOMS = ["Breeding Room", "Royal Room", "Fight Club", "Offspring"];

const INITIAL_CATS = [
  { name: "Stripers", id: "stripers", sex: "♂", STR: 3, DEX: 5, CON: 6, INT: 5, SPD: 5, CHA: 4, LCK: 7, libido: "Avg", aggression: "Avg", loves: "Zefirka", hates: "—", mutations: "—", room: "Royal Room", stray: true, parent1: "", parent2: "", grandparent1: "", grandparent2: "", grandparent3: "", grandparent4: "" },
  { name: "Tibb", id: "tibb", sex: "♂", STR: 6, DEX: 5, CON: 7, INT: 4, SPD: 5, CHA: 6, LCK: 6, libido: "Avg", aggression: "High", loves: "—", hates: "—", mutations: "✅", room: "Royal Room", stray: false, parent1: "mrmeowsck", parent2: "mijina", grandparent1: "miranda", grandparent2: "lea", grandparent3: "eren", grandparent4: "snoozy" },
  { name: "Shirotabi", id: "shirotabi", sex: "♂", STR: 7, DEX: 4, CON: 5, INT: 5, SPD: 5, CHA: 6, LCK: 5, libido: "Avg", aggression: "High", loves: "Celica", hates: "Mungly Bungly", mutations: "—", room: "Breeding Room", stray: true, parent1: "", parent2: "", grandparent1: "", grandparent2: "", grandparent3: "", grandparent4: "" },
  { name: "Zara", id: "zara", sex: "♀", STR: 6, DEX: 5, CON: 7, INT: 6, SPD: 6, CHA: 6, LCK: 6, libido: "Avg", aggression: "High", loves: "Stripers", hates: "Celica", mutations: "✅", room: "Breeding Room", stray: false, parent1: "mijina", parent2: "mrmeowsck", grandparent1: "swoozy", grandparent2: "lea", grandparent3: "miranda", grandparent4: "eren" },
  { name: "Celica", id: "celica", sex: "♀", STR: 5, DEX: 5, CON: 7, INT: 4, SPD: 6, CHA: 6, LCK: 4, libido: "Avg", aggression: "Avg", loves: "Mungly Bungly", hates: "Milka", mutations: "✅", room: "Royal Room", stray: false, parent1: "mijina", parent2: "teo", grandparent1: "lea", grandparent2: "snoozy", grandparent3: "", grandparent4: "" },
  { name: "Mungly Bungly", id: "munglybungly", sex: "♂", STR: 6, DEX: 5, CON: 7, INT: 7, SPD: 6, CHA: 5, LCK: 6, libido: "Avg", aggression: "Low", loves: "Vegas ☠️", hates: "Eren ☠️", mutations: "—", room: "Royal Room", stray: false, parent1: "omry", parent2: "remi", grandparent1: "lecuna", grandparent2: "beevis", grandparent3: "solomon", grandparent4: "madamemaxime" },
  { name: "Hazel", id: "hazel", sex: "♀", STR: 6, DEX: 5, CON: 5, INT: 5, SPD: 5, CHA: 5, LCK: 5, libido: "Avg", aggression: "Avg", loves: "—", hates: "—", mutations: "🌹 Thorns", room: "Royal Room", stray: true, parent1: "", parent2: "", grandparent1: "", grandparent2: "", grandparent3: "", grandparent4: "" },
  { name: "Tums", id: "tums", sex: "⚥", STR: 6, DEX: 6, CON: 7, INT: 7, SPD: 6, CHA: 5, LCK: 4, libido: "High", aggression: "Avg", loves: "—", hates: "—", mutations: "+2 CON, -1 LCK", room: "Breeding Room", stray: false, parent1: "munglybungly", parent2: "celica", grandparent1: "omry", grandparent2: "remi", grandparent3: "mijina", grandparent4: "teo" },
  { name: "Big John", id: "bigjohn", sex: "♂", STR: 3, DEX: 5, CON: 7, INT: 5, SPD: 6, CHA: 4, LCK: 7, libido: "Avg", aggression: "High", loves: "—", hates: "—", mutations: "—", room: "Royal Room", stray: false, parent1: "celica", parent2: "stripers", grandparent1: "mijina", grandparent2: "teo", grandparent3: "", grandparent4: "" },
  { name: "Lashley", id: "lashley", sex: "♂", STR: 6, DEX: 5, CON: 7, INT: 6, SPD: 6, CHA: 6, LCK: 7, libido: "Avg", aggression: "Low", loves: "—", hates: "—", mutations: "+2 CON", room: "Offspring", stray: false, parent1: "stripers", parent2: "zara", grandparent1: "", grandparent2: "", grandparent3: "mijina", grandparent4: "mrmeowsck" },
  { name: "Einar", id: "einar", sex: "♂", STR: 6, DEX: 5, CON: 7, INT: 7, SPD: 6, CHA: 5, LCK: 6, libido: "Avg", aggression: "Low", loves: "—", hates: "—", mutations: "+2 CON, -1 LCK", room: "Offspring", stray: false, parent1: "munglybungly", parent2: "celica", grandparent1: "omry", grandparent2: "remi", grandparent3: "mijina", grandparent4: "teo" },
];

/* ─── Shared tooltip builder ─── */
function buildTooltipLines(cat, allCats) {
  const displayName = (id) => {
    if (!id) return null;
    const found = allCats.find((c) => c.id === id);
    return found ? found.name : id;
  };
  const isParentStray = (c, num) => {
    if (num === 1) return !c.grandparent1 && !c.grandparent2;
    return !c.grandparent3 && !c.grandparent4;
  };

  if (cat.stray) return [{ label: "Stray", value: "Yes" }];
  const lines = [];
  if (cat.parent1 || cat.parent2) {
    const p1 = cat.parent1 ? displayName(cat.parent1) + (isParentStray(cat, 1) ? " (Stray)" : "") : "—";
    const p2 = cat.parent2 ? displayName(cat.parent2) + (isParentStray(cat, 2) ? " (Stray)" : "") : "—";
    lines.push({ label: "Parents", value: `${p1}  ×  ${p2}` });
  }
  const gps = [cat.grandparent1, cat.grandparent2, cat.grandparent3, cat.grandparent4];
  if (gps.some((g) => g)) {
    const gpNames = gps.map((g) => g ? displayName(g) : "—");
    lines.push({ label: "GP (P1 side)", value: `${gpNames[0]}  ×  ${gpNames[1]}` });
    lines.push({ label: "GP (P2 side)", value: `${gpNames[2]}  ×  ${gpNames[3]}` });
  }
  return lines;
}

/* ─── HTML tooltip for table ─── */
function NameCellTooltip({ cat, allCats }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const lines = buildTooltipLines(cat, allCats);

  const handleMouseMove = (e) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <td
      style={{ padding: "10px 12px", fontWeight: 600, color: "#fff", cursor: "default" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onMouseMove={handleMouseMove}
    >
      <span style={{ borderBottom: "1px dashed #666" }}>{cat.name}</span>
      {show && (
        <div style={{
          position: "fixed", top: pos.y - 10, left: pos.x + 16, zIndex: 99999,
          transform: "translateY(-100%)",
          background: "#1e1e3a", border: "1px solid #555", borderRadius: 8, padding: "10px 14px",
          minWidth: 220, pointerEvents: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 6 }}>{cat.name}</div>
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 11, marginBottom: 3 }}>
              <span style={{ color: "#888" }}>{line.label}:</span>
              <span style={{ color: "#ddd", textAlign: "right" }}>{line.value}</span>
            </div>
          ))}
        </div>
      )}
    </td>
  );
}
function RelationshipGraph({ cats, allCats }) {
  const [hovered, setHovered] = useState(null);

  if (cats.length === 0) return <p style={{ color: "#666", textAlign: "center", padding: 40 }}>No cats in this room yet.</p>;

  const W = 800, H = 500;
  const cx = W / 2, cy = H / 2;
  const radius = Math.min(180, 60 + cats.length * 20);

  const positions = cats.map((cat, i) => {
    const angle = (i / cats.length) * 2 * Math.PI - Math.PI / 2;
    return { name: cat.name, sex: cat.sex, x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  const findPos = (name) => {
    if (!name || name === "—") return null;
    const clean = name.replace(/\s*☠️/g, "").trim().toLowerCase();
    return positions.find((p) => p.name.toLowerCase() === clean);
  };

  const edges = [];
  cats.forEach((cat) => {
    const from = findPos(cat.name);
    if (!from) return;
    if (cat.loves && cat.loves !== "—") {
      const to = findPos(cat.loves);
      if (to) edges.push({ from, to, type: "love" });
    }
    if (cat.hates && cat.hates !== "—") {
      const to = findPos(cat.hates);
      if (to) edges.push({ from, to, type: "hate" });
    }
  });

  const getPath = (from, to, type) => {
    const dx = to.x - from.x, dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const nodeR = 28;
    const x1 = from.x + dx * (nodeR / dist), y1 = from.y + dy * (nodeR / dist);
    const x2 = from.x + dx * ((dist - nodeR) / dist), y2 = from.y + dy * ((dist - nodeR) / dist);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const offset = type === "love" ? 25 : -25;
    return { x1, y1, x2, y2, cx: mx + (-dy / dist) * offset, cy: my + (dx / dist) * offset };
  };

  // Lookup a display name for a parent ID
  const displayName = (id) => {
    if (!id) return null;
    const found = allCats.find((c) => c.id === id);
    return found ? found.name : id;
  };

  const buildTooltip = (cat) => buildTooltipLines(cat, allCats);

  return (
    <div style={{ background: "#1a1a2e", borderRadius: 12, border: "1px solid #333", padding: 16, display: "flex", justifyContent: "center", position: "relative" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: "100%" }}>
        <defs>
          <marker id="arrow-love" viewBox="0 0 10 6" refX="10" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 3 L 0 6 z" fill="#4ade80" />
          </marker>
          <marker id="arrow-hate" viewBox="0 0 10 6" refX="10" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 3 L 0 6 z" fill="#ef4444" />
          </marker>
        </defs>

        {edges.map((e, i) => {
          const p = getPath(e.from, e.to, e.type);
          return (
            <path key={i} d={`M ${p.x1} ${p.y1} Q ${p.cx} ${p.cy} ${p.x2} ${p.y2}`}
              fill="none" stroke={e.type === "love" ? "#4ade80" : "#ef4444"} strokeWidth={2}
              strokeDasharray={e.type === "hate" ? "6,4" : "none"} markerEnd={`url(#arrow-${e.type})`} opacity={0.7} />
          );
        })}

        {/* External relations (cats not in this room) */}
        {cats.map((cat, i) => {
          const from = positions[i];
          const externals = [];
          if (cat.loves && cat.loves !== "—" && !findPos(cat.loves)) externals.push({ label: cat.loves, type: "love" });
          if (cat.hates && cat.hates !== "—" && !findPos(cat.hates)) externals.push({ label: cat.hates, type: "hate" });
          return externals.map((ext, j) => {
            const angle = Math.atan2(from.y - cy, from.x - cx);
            const outX = from.x + 55 * Math.cos(angle) + j * 20;
            const outY = from.y + 55 * Math.sin(angle) + j * 14;
            const color = ext.type === "love" ? "#4ade80" : "#ef4444";
            return (
              <g key={`ext-${i}-${j}`}>
                <line x1={from.x + 28 * Math.cos(angle)} y1={from.y + 28 * Math.sin(angle)} x2={outX} y2={outY}
                  stroke={color} strokeWidth={1.5} strokeDasharray={ext.type === "hate" ? "4,3" : "none"} opacity={0.5} />
                <text x={outX + 8 * Math.cos(angle)} y={outY + 8 * Math.sin(angle)} textAnchor="middle" fill={color}
                  fontSize={11} fontStyle="italic" dominantBaseline="middle">
                  {ext.type === "love" ? "❤️" : "💔"} {ext.label}
                </text>
              </g>
            );
          });
        })}

        {/* Shared lineage lines on hover */}
        {hovered !== null && (() => {
          const hovCat = cats[hovered];
          const hovAncestors = [hovCat.parent1, hovCat.parent2, hovCat.grandparent1, hovCat.grandparent2, hovCat.grandparent3, hovCat.grandparent4].filter(Boolean);

          return cats.map((other, oi) => {
            if (oi === hovered) return null;
            const from = positions[hovered];
            const to = positions[oi];

            // Check direct parent relationship (either direction)
            const hovIsParentOfOther = other.parent1 === hovCat.id || other.parent2 === hovCat.id;
            const otherIsParentOfHov = hovCat.parent1 === other.id || hovCat.parent2 === other.id;
            if (hovIsParentOfOther || otherIsParentOfHov) {
              return (
                <g key={`kin-${oi}`}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke="#f97316" strokeWidth={3} opacity={0.6} />
                  <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8}
                    textAnchor="middle" fontSize={9} fill="#f97316" opacity={0.8}>
                    parent
                  </text>
                </g>
              );
            }

            // Check sibling / related
            const otherAncestors = [other.parent1, other.parent2, other.grandparent1, other.grandparent2, other.grandparent3, other.grandparent4].filter(Boolean);
            const shared = hovAncestors.filter((a) => otherAncestors.includes(a));
            if (shared.length === 0) return null;

            const isParentMatch = shared.some((s) => [hovCat.parent1, hovCat.parent2].includes(s) && [other.parent1, other.parent2].includes(s));

            return (
              <g key={`kin-${oi}`}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isParentMatch ? "#fbbf24" : "#a78bfa"}
                  strokeWidth={isParentMatch ? 3 : 2}
                  strokeDasharray={isParentMatch ? "none" : "8,4"}
                  opacity={0.6} />
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 8}
                  textAnchor="middle" fontSize={9} fill={isParentMatch ? "#fbbf24" : "#a78bfa"} opacity={0.8}>
                  {isParentMatch ? "sibling" : "related"}
                </text>
              </g>
            );
          });
        })()}

        {positions.map((p, i) => (
          <g key={p.name}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}>
            <circle cx={p.x} cy={p.y} r={28}
              fill={hovered === i ? (cats[i].sex === "♀" ? "#5a2a5a" : cats[i].sex === "⚥" ? "#3b2a5a" : "#2a3a6a") : (cats[i].sex === "♀" ? "#3b1a3b" : cats[i].sex === "⚥" ? "#2a1a4a" : "#1a2a4a")}
              stroke={cats[i].sex === "♀" ? "#f472b6" : cats[i].sex === "⚥" ? "#c084fc" : "#60a5fa"} strokeWidth={hovered === i ? 3.5 : 2.5} />
            <text x={p.x} y={p.y - 2} textAnchor="middle" dominantBaseline="middle" fill="#fff"
              fontSize={cats[i].name.length > 8 ? 9 : 11} fontWeight={600}>
              {cats[i].name.length > 12 ? cats[i].name.slice(0, 11) + "…" : cats[i].name}
            </text>
            <text x={p.x} y={p.y + 12} textAnchor="middle" fill={cats[i].sex === "♀" ? "#f472b6" : cats[i].sex === "⚥" ? "#c084fc" : "#60a5fa"} fontSize={10}>
              {cats[i].sex}
            </text>
          </g>
        ))}

        {/* Tooltip */}
        {hovered !== null && (() => {
          const cat = cats[hovered];
          const pos = positions[hovered];
          const lines = buildTooltip(cat);
          const tipW = 220, tipH = 20 + lines.length * 22;
          let tx = pos.x - tipW / 2;
          let ty = pos.y - 40 - tipH;
          if (ty < 5) ty = pos.y + 38;
          if (tx < 5) tx = 5;
          if (tx + tipW > W - 5) tx = W - tipW - 5;

          return (
            <g>
              <rect x={tx} y={ty} width={tipW} height={tipH} rx={8} fill="#1e1e3a" stroke="#555" strokeWidth={1} opacity={0.95} />
              <text x={tx + tipW / 2} y={ty + 16} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
                {cat.name}
              </text>
              {lines.map((line, li) => (
                <g key={li}>
                  <text x={tx + 10} y={ty + 36 + li * 22} fill="#888" fontSize={10}>{line.label}:</text>
                  <text x={tx + tipW - 10} y={ty + 36 + li * 22} textAnchor="end" fill="#ddd" fontSize={10}>{line.value}</text>
                </g>
              ))}
            </g>
          );
        })()}

        <g transform={`translate(16, ${H - 50})`}>
          <line x1={0} y1={0} x2={30} y2={0} stroke="#4ade80" strokeWidth={2} />
          <text x={36} y={4} fill="#aaa" fontSize={11}>Loves</text>
          <line x1={100} y1={0} x2={130} y2={0} stroke="#ef4444" strokeWidth={2} strokeDasharray="6,4" />
          <text x={136} y={4} fill="#aaa" fontSize={11}>Hates</text>
          <circle cx={230} cy={0} r={6} fill="#3b1a3b" stroke="#f472b6" strokeWidth={1.5} />
          <text x={242} y={4} fill="#aaa" fontSize={11}>Female</text>
          <circle cx={300} cy={0} r={6} fill="#1a2a4a" stroke="#60a5fa" strokeWidth={1.5} />
          <text x={312} y={4} fill="#aaa" fontSize={11}>Male</text>
          <circle cx={370} cy={0} r={6} fill="#2a1a4a" stroke="#c084fc" strokeWidth={1.5} />
          <text x={382} y={4} fill="#aaa" fontSize={11}>Intersex</text>
          <line x1={440} y1={0} x2={470} y2={0} stroke="#f97316" strokeWidth={3} />
          <text x={476} y={4} fill="#aaa" fontSize={11}>Parent</text>
          <line x1={540} y1={0} x2={570} y2={0} stroke="#fbbf24" strokeWidth={3} />
          <text x={576} y={4} fill="#aaa" fontSize={11}>Sibling</text>
          <line x1={640} y1={0} x2={670} y2={0} stroke="#a78bfa" strokeWidth={2} strokeDasharray="8,4" />
          <text x={676} y={4} fill="#aaa" fontSize={11}>Related</text>
        </g>
      </svg>
    </div>
  );
}

/* ─── Main App ─── */
export default function MewgenicsCats() {
  const [cats, setCats] = useState(INITIAL_CATS);
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [activeRoom, setActiveRoom] = useState(DEFAULT_ROOMS[0]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const emptyForm = { name: "", id: "", sex: "♂", STR: 5, DEX: 5, CON: 5, INT: 5, SPD: 5, CHA: 5, LCK: 5, libido: "Avg", aggression: "Avg", loves: "—", hates: "—", mutations: "—", room: DEFAULT_ROOMS[0], stray: false, parent1: "", parent2: "", grandparent1: "", grandparent2: "", grandparent3: "", grandparent4: "" };
  const [form, setForm] = useState({ ...emptyForm });
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  // Load
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("mewgenics-v8");
        if (result?.value) {
          const data = JSON.parse(result.value);
          if (data.cats) setCats(data.cats);
          if (data.rooms) { setRooms(data.rooms); setActiveRoom(data.rooms[0]); }
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  // Save
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { await window.storage.set("mewgenics-v8", JSON.stringify({ cats, rooms })); } catch {}
    })();
  }, [cats, rooms, loaded]);

  const resetForm = () => setForm({ ...emptyForm, room: activeRoom });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const entry = { ...form, name: form.name.trim() };
    entry.id = entry.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    STATS.forEach((s) => (entry[s] = Number(entry[s])));
    if (editIdx !== null) {
      const updated = [...cats];
      updated[editIdx] = entry;
      setCats(updated);
      setEditIdx(null);
    } else {
      setCats([...cats, entry]);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (globalIdx) => {
    setForm({ ...cats[globalIdx] });
    setEditIdx(globalIdx);
    setShowForm(true);
  };

  const handleDelete = (globalIdx) => {
    setCats(cats.filter((_, idx) => idx !== globalIdx));
  };

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(col === "name" || col === "sex"); }
  };

  const handleAddRoom = () => {
    const trimmed = newRoomName.trim();
    if (!trimmed || rooms.includes(trimmed)) return;
    setRooms([...rooms, trimmed]);
    setNewRoomName("");
    setShowAddRoom(false);
  };

  const handleDeleteRoom = (roomName) => {
    if (rooms.length <= 1) return;
    const catsInRoom = cats.filter((c) => c.room === roomName);
    if (catsInRoom.length > 0) {
      const fallback = rooms.find((r) => r !== roomName);
      setCats(cats.map((c) => c.room === roomName ? { ...c, room: fallback } : c));
    }
    setRooms(rooms.filter((r) => r !== roomName));
    if (activeRoom === roomName) setActiveRoom(rooms.find((r) => r !== roomName));
  };

  const totalStat = (cat) => STATS.reduce((sum, s) => sum + cat[s], 0);

  const roomCats = cats.filter((c) => c.room === activeRoom);

  const sorted = [...roomCats].sort((a, b) => {
    if (!sortCol) return 0;
    if (sortCol === "total") return sortAsc ? totalStat(a) - totalStat(b) : totalStat(b) - totalStat(a);
    const av = a[sortCol], bv = b[sortCol];
    if (typeof av === "string") return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortAsc ? av - bv : bv - av;
  });

  const tabStyle = (room) => ({
    padding: "10px 20px",
    background: activeRoom === room ? "#6366f1" : "#252547",
    color: activeRoom === room ? "#fff" : "#aaa",
    border: "none",
    borderRadius: "8px 8px 0 0",
    cursor: "pointer",
    fontWeight: activeRoom === room ? 700 : 500,
    fontSize: 14,
    transition: "background 0.15s",
  });

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#1a1a2e", minHeight: "100vh", color: "#e0e0e0", padding: "24px" }}>
      <div style={{ margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>🐱 Mewgenics Cat Tracker</h1>
            <p style={{ color: "#888", margin: "4px 0 0", fontSize: 14 }}>
              {cats.length} total cats across {rooms.length} rooms
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                const header = ["Name", "ID", "Sex", ...STATS, "Total", "Libido", "Aggression", "Loves", "Hates", "Mutations", "Room", "Stray", "Parent1", "Parent2", "GP1", "GP2", "GP3", "GP4"].join(" | ");
                const divider = header.replace(/[^|]/g, "-");
                const rows = cats.map((c) => {
                  const total = STATS.reduce((s, k) => s + c[k], 0);
                  return [c.name, c.id, c.sex, ...STATS.map((s) => c[s]), total, c.libido, c.aggression, c.loves, c.hates, c.mutations, c.room, c.stray ? "yes" : "no", c.parent1 || "—", c.parent2 || "—", c.grandparent1 || "—", c.grandparent2 || "—", c.grandparent3 || "—", c.grandparent4 || "—"].join(" | ");
                });
                const text = `Mewgenics Cat Roster (${cats.length} cats)\nBase stats only (inheritable by kittens). Stats range ~1-10, 7+ is strong.\nID field is the normalized name (lowercase, no spaces/special chars) used for genealogy references.\nParent/grandparent fields use normalized IDs. GP1-2 are Parent1's parents, GP3-4 are Parent2's parents.\nRooms: ${rooms.join(", ")}\n\n${header}\n${divider}\n${rows.join("\n")}`;
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              style={{ background: copied ? "#16a34a" : "#374151", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
            >
              {copied ? "✅ Copied!" : "📋 Copy All"}
            </button>
            <button
              onClick={() => { resetForm(); setEditIdx(null); setShowForm(!showForm); }}
              style={{ background: showForm ? "#444" : "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
            >
              {showForm ? "Cancel" : "+ Add Cat"}
            </button>
          </div>
        </div>

        {/* Room Tabs */}
        <div style={{ display: "flex", alignItems: "end", gap: 4, borderBottom: "2px solid #333" }}>
          {rooms.map((room) => (
            <div key={room} style={{ position: "relative" }}>
              <button onClick={() => setActiveRoom(room)} style={tabStyle(room)}>
                {room}
                <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.6 }}>
                  ({cats.filter((c) => c.room === room).length})
                </span>
              </button>
              {rooms.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room); }}
                  style={{ position: "absolute", top: 2, right: 2, background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 10, padding: "2px 4px", lineHeight: 1 }}
                  title={`Delete ${room}`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {showAddRoom ? (
            <div style={{ display: "flex", gap: 4, padding: "6px 0", marginLeft: 4 }}>
              <input
                autoFocus
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddRoom()}
                placeholder="Room name"
                style={{ background: "#252547", border: "1px solid #444", borderRadius: 6, padding: "6px 10px", color: "#fff", fontSize: 13, width: 130 }}
              />
              <button onClick={handleAddRoom} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>Add</button>
              <button onClick={() => { setShowAddRoom(false); setNewRoomName(""); }} style={{ background: "#444", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>✕</button>
            </div>
          ) : (
            <button onClick={() => setShowAddRoom(true)} style={{ padding: "10px 16px", background: "none", color: "#666", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1 }} title="Add room">+</button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{ background: "#252547", borderRadius: "0 0 12px 12px", padding: 20, marginBottom: 20, border: "1px solid #333", borderTop: "none" }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
              <div>
                <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Cat name"
                  style={{ background: "#1a1a2e", border: "1px solid #444", borderRadius: 6, padding: "8px 12px", color: "#fff", width: 140 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>Sex</label>
                <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })}
                  style={{ background: "#1a1a2e", border: "1px solid #444", borderRadius: 6, padding: "8px 12px", color: "#fff" }}>
                  <option value="♂">♂ Male</option>
                  <option value="♀">♀ Female</option>
                  <option value="⚥">⚥ Intersex</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>🏠 Room</label>
                <select value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}
                  style={{ background: "#1a1a2e", border: "1px solid #444", borderRadius: 6, padding: "8px 12px", color: "#fff" }}>
                  {rooms.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {STATS.map((s) => (
                <div key={s}>
                  <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>{STAT_ICONS[s]} {s}</label>
                  <input type="number" min={1} max={10} value={form[s]} onChange={(e) => setForm({ ...form, [s]: e.target.value })}
                    style={{ background: "#1a1a2e", border: "1px solid #444", borderRadius: 6, padding: "8px 12px", color: "#fff", width: 60 }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>💕 Libido</label>
                <select value={form.libido} onChange={(e) => setForm({ ...form, libido: e.target.value })}
                  style={{ background: "#1a1a2e", border: "1px solid #444", borderRadius: 6, padding: "8px 12px", color: "#fff" }}>
                  <option value="Low">Low</option><option value="Avg">Avg</option><option value="High">High</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>😾 Aggro</label>
                <select value={form.aggression} onChange={(e) => setForm({ ...form, aggression: e.target.value })}
                  style={{ background: "#1a1a2e", border: "1px solid #444", borderRadius: 6, padding: "8px 12px", color: "#fff" }}>
                  <option value="Low">Low</option><option value="Avg">Avg</option><option value="High">High</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>❤️ Loves</label>
                <input value={form.loves} onChange={(e) => setForm({ ...form, loves: e.target.value })}
                  style={{ background: "#1a1a2e", border: "1px solid #444", borderRadius: 6, padding: "8px 12px", color: "#fff", width: 120 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>💔 Hates</label>
                <input value={form.hates} onChange={(e) => setForm({ ...form, hates: e.target.value })}
                  style={{ background: "#1a1a2e", border: "1px solid #444", borderRadius: 6, padding: "8px 12px", color: "#fff", width: 120 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>🧬 Mutations</label>
                <input value={form.mutations} onChange={(e) => setForm({ ...form, mutations: e.target.value })}
                  style={{ background: "#1a1a2e", border: "1px solid #444", borderRadius: 6, padding: "8px 12px", color: "#fff", width: 120 }} />
              </div>
              <button onClick={handleAdd}
                style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", cursor: "pointer", fontWeight: 600, height: 38 }}>
                {editIdx !== null ? "Save" : "Add"}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto", borderRadius: showForm ? "0" : "0 12px 0 0", border: "1px solid #333", borderTop: "none" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#252547" }}>
                {[
                  { key: "name", label: "Name" },
                  { key: "sex", label: "Sex" },
                  ...STATS.map((s) => ({ key: s, label: `${STAT_ICONS[s]} ${s}` })),
                  { key: "total", label: "Total" },
                  { key: "libido", label: "💕" },
                  { key: "aggression", label: "😾" },
                  { key: "loves", label: "❤️" },
                  { key: "hates", label: "💔" },
                  { key: "mutations", label: "🧬" },
                  { key: "actions", label: "" },
                ].map((col) => (
                  <th key={col.key}
                    onClick={col.key !== "actions" ? () => handleSort(col.key) : undefined}
                    style={{
                      padding: "12px 12px", textAlign: col.key === "name" ? "left" : "center",
                      cursor: col.key !== "actions" ? "pointer" : "default", userSelect: "none",
                      fontWeight: 600, color: sortCol === col.key ? "#6366f1" : "#aaa",
                      fontSize: 13, borderBottom: "2px solid #333", whiteSpace: "nowrap",
                    }}>
                    {col.label} {sortCol === col.key ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr><td colSpan={14} style={{ padding: 40, textAlign: "center", color: "#666" }}>No cats in this room. Add one above!</td></tr>
              )}
              {sorted.map((cat, i) => {
                const globalIdx = cats.indexOf(cat);
                const total = totalStat(cat);
                return (
                  <tr key={cat.name + i}
                    style={{ background: i % 2 === 0 ? "#1a1a2e" : "#1f1f3a", borderBottom: "1px solid #2a2a4a" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a5a")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#1a1a2e" : "#1f1f3a")}>
                    <NameCellTooltip cat={cat} allCats={cats} />
                    <td style={{ padding: "10px 12px", textAlign: "center", color: cat.sex === "♀" ? "#f472b6" : cat.sex === "⚥" ? "#c084fc" : "#60a5fa" }}>{cat.sex}</td>
                    {STATS.map((s) => (
                      <td key={s} style={{
                        padding: "10px 12px", textAlign: "center", fontVariantNumeric: "tabular-nums",
                        fontWeight: cat[s] >= 7 ? 800 : 400, color: cat[s] >= 7 ? "#4ade80" : "#ccc",
                        fontSize: cat[s] >= 7 ? "1.05em" : "1em",
                      }}>{cat[s]}</td>
                    ))}
                    <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#a78bfa" }}>{total}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#ccc" }}>{cat.libido}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: cat.aggression === "High" ? "#f87171" : cat.aggression === "Low" ? "#86efac" : "#ccc" }}>{cat.aggression}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#f9a8d4", whiteSpace: "nowrap" }}>{cat.loves}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#fca5a5", whiteSpace: "nowrap" }}>{cat.hates}</td>
                    <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "#93c5fd", whiteSpace: "nowrap" }}>{cat.mutations}</td>
                    <td style={{ padding: "10px 8px", textAlign: "center", whiteSpace: "nowrap" }}>
                      <button onClick={() => handleEdit(globalIdx)} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, marginRight: 8 }}>✏️</button>
                      <button onClick={() => handleDelete(globalIdx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13 }}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p style={{ color: "#555", fontSize: 12, marginTop: 12, textAlign: "center" }}>
          Click column headers to sort • Data saves automatically between sessions
        </p>

        {/* Relationship Graph */}
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 16 }}>💞 {activeRoom} — Relationships</h2>
          <RelationshipGraph cats={roomCats} allCats={cats} />
        </div>
      </div>
    </div>
  );
}
