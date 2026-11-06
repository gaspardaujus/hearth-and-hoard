// Draws the Hearth & Hoard app icon (a stone hearth arch with a fire) as pixel art and writes the PNG sizes
// the manifest and iOS need. No dependencies. Usage: node tools/make-icons.mjs
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import url from 'node:url';

const outDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'icons');
fs.mkdirSync(outDir, { recursive: true });

const CRC = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = buf => { let c = 0xFFFFFFFF; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const BG = '#121011';

/* the 32 x 32 design */
function design() {
  const N = 32, px = Array.from({ length: N * N }, () => BG);
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < N && y < N) px[y * N + x] = c; };
  const get = (x, y) => px[y * N + x];
  const cx = 16, cy = 15;
  const inArch = (x, y, r) => { const dx = x + .5 - cx, dy = y + .5 - cy; return y <= 26 && (y + .5 < cy ? dx * dx + dy * dy <= r * r : Math.abs(dx) <= r); };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (inArch(x, y, 12.5) && !inArch(x, y, 8.4)) {
      const row = Math.floor(y / 3), off = (row % 2) * 2, brick = Math.floor((x + off) / 4);
      const mortar = y % 3 === 2 || (x + off) % 4 === 3;
      const shade = ['#5E544D', '#4E4640', '#433C37'][(row + brick) % 3];
      set(x, y, mortar ? '#2A2421' : shade);
      const dx = x + .5 - cx, dy = y + .5 - cy;
      if (!mortar && y + .5 < cy && dx * dx + dy * dy > 11.7 * 11.7) set(x, y, '#7A6E64');
      if (!mortar && y + .5 >= cy && Math.abs(dx) > 11.7) set(x, y, '#6A5F57');
    } else if (inArch(x, y, 8.4)) set(x, y, '#0C0908');
  }
  for (let y = 8; y < 27; y++) for (let x = 7; x < 25; x++) {
    if (get(x, y) !== '#0C0908') continue;
    const dx = x + .5 - 16, dy = (y + .5 - 22) * 1.25, d = Math.sqrt(dx * dx + dy * dy);
    if (d < 9) set(x, y, d < 4.5 ? '#3A1A0C' : d < 6.5 ? '#2A130A' : '#1A0D08');
  }
  for (let x = 2; x < 30; x++) { set(x, 27, '#9A8E84'); set(x, 28, '#74685E'); set(x, 29, '#4A423D'); }
  for (let x = 9; x < 23; x++) { set(x, 25, '#6A4A30'); set(x, 26, '#4A3220'); }
  for (let i = 0; i < 10; i++) set(11 + i, i < 5 ? 24 : 23, '#8A6440');
  for (let y = 11; y < 25; y++) {
    const t = (y - 11) / 13, half = Math.min(5, Math.round(.5 + 5.2 * Math.pow(t, .75)));
    for (let x = 16 - half; x < 16 + half; x++) {
      const inner = Math.abs(x + .5 - 16) / Math.max(1, half);
      set(x, y, inner > .78 ? '#C2421A' : inner > .5 ? '#E8772E' : t > .38 && inner < .3 ? '#FFE6B8' : '#FFA552');
    }
  }
  set(15, 10, '#FFA552'); set(16, 9, '#E8772E');
  for (const [x, y] of [[12, 12], [20, 10], [18, 7], [13, 8]]) set(x, y, '#FFB85C');
  return { N, px };
}

function render(scale, size, pad) {
  const { N, px } = design(), buf = Buffer.alloc(size * size * 4), bg = hex(BG);
  for (let i = 0; i < size * size; i++) { buf[i * 4] = bg[0]; buf[i * 4 + 1] = bg[1]; buf[i * 4 + 2] = bg[2]; buf[i * 4 + 3] = 255; }
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const c = hex(px[y * N + x]);
    for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
      const X = pad + x * scale + dx, Y = pad + y * scale + dy, o = (Y * size + X) * 4;
      buf[o] = c[0]; buf[o + 1] = c[1]; buf[o + 2] = c[2];
    }
  }
  return png(size, size, buf);
}

const out = [
  ['icon-192.png', 6, 192, 0],
  ['icon-512.png', 16, 512, 0],
  ['apple-touch-icon.png', 5, 180, 10],
  ['icon-maskable-512.png', 12, 512, 64]
];
for (const [name, scale, size, pad] of out) { fs.writeFileSync(path.join(outDir, name), render(scale, size, pad)); console.log(name, size + 'x' + size); }
