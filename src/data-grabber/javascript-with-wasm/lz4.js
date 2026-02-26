/**
 * LZ4 block decompressor — ported from mewgenics_extract.py
 *
 * Each cat blob starts with a uint32 (little-endian) declaring the uncompressed
 * size, followed by the LZ4-compressed payload. Pass the payload (blob.slice(4))
 * and that declared size to this function.
 *
 * @param {Uint8Array} src - The compressed payload
 * @param {number} uncompressedSize - Declared output size (uint32 at blob offset 0)
 * @returns {Uint8Array}
 */
export function lz4DecompressBlock(src, uncompressedSize) {
  const dst = new Uint8Array(uncompressedSize);
  let dstPos = 0;
  let pos = 0;

  while (pos < src.length && dstPos < uncompressedSize) {
    const token = src[pos++];
    let litLen = (token >> 4) & 0xf;
    const matchLenBase = token & 0xf;

    // Extended literal length
    if (litLen === 15) {
      while (pos < src.length) {
        const extra = src[pos++];
        litLen += extra;
        if (extra !== 255) break;
      }
    }

    // Copy literals
    const litEnd = pos + litLen;
    if (litEnd > src.length) {
      // Truncated — copy whatever is left
      const remaining = src.length - pos;
      dst.set(src.subarray(pos, pos + remaining), dstPos);
      dstPos += remaining;
      break;
    }
    dst.set(src.subarray(pos, litEnd), dstPos);
    dstPos += litLen;
    pos = litEnd;

    if (dstPos >= uncompressedSize) break;
    if (pos + 2 > src.length) break;

    // Match offset (little-endian 16-bit)
    const offset = src[pos] | (src[pos + 1] << 8);
    pos += 2;
    if (offset === 0) break;

    // Extended match length
    let matchLen = matchLenBase + 4;
    if (matchLenBase === 15) {
      while (pos < src.length) {
        const extra = src[pos++];
        matchLen += extra;
        if (extra !== 255) break;
      }
    }

    // Copy match — matchPos is computed ONCE before the loop (handles overlapping copies)
    const matchPos = dstPos - offset;
    if (matchPos < 0) break;
    for (let i = 0; i < matchLen && dstPos < uncompressedSize; i++) {
      dst[dstPos++] = dst[matchPos + (i % offset)];
    }
  }

  return dst.subarray(0, dstPos);
}
