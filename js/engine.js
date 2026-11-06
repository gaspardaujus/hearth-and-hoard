'use strict';
/* ================= sound ================= */
let AC;
function sfx(kind) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = AC.currentTime;
    const tone = (f, at, dur, type, vol, f2) => { const o = AC.createOscillator(), gn = AC.createGain(); o.type = type || 'triangle'; o.frequency.setValueAtTime(f, at); if (f2) o.frequency.exponentialRampToValueAtTime(f2, at + dur); gn.gain.setValueAtTime(.0001, at); gn.gain.exponentialRampToValueAtTime(vol || .07, at + .01); gn.gain.exponentialRampToValueAtTime(.0001, at + dur); o.connect(gn); gn.connect(AC.destination); o.start(at); o.stop(at + dur + .02); };
    const noise = (dur, vol, f0, f1, type) => { const len = Math.floor(AC.sampleRate * dur), buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2); const src = AC.createBufferSource(); src.buffer = buf; const fl = AC.createBiquadFilter(); fl.type = type || 'lowpass'; fl.frequency.setValueAtTime(f0, t0); if (f1) fl.frequency.exponentialRampToValueAtTime(f1, t0 + dur); const gn = AC.createGain(); gn.gain.value = vol; src.connect(fl); fl.connect(gn); gn.connect(AC.destination); src.start(t0); };
    if (kind === 'meow') { const o = AC.createOscillator(), gn = AC.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(620, t0); o.frequency.linearRampToValueAtTime(880, t0 + .09); o.frequency.exponentialRampToValueAtTime(470, t0 + .32); gn.gain.setValueAtTime(.0001, t0); gn.gain.exponentialRampToValueAtTime(.06, t0 + .03); gn.gain.exponentialRampToValueAtTime(.0001, t0 + .34); o.connect(gn); gn.connect(AC.destination); o.start(t0); o.stop(t0 + .36); return; }
    if (kind === 'hit') { tone(150, t0, .35, 'sine', .16, 45); noise(.22, .45, 2600, 500); return; }
    if (kind === 'crack') { noise(.3, .5, 3200, 700); tone(120, t0, .25, 'triangle', .06, 60); return; }
    if (kind === 'whoosh') { noise(.28, .3, 500, 3200, 'bandpass'); return; }
    if (kind === 'roar') { tone(78, t0, 1, 'sawtooth', .06, 48); tone(118, t0 + .05, .9, 'sawtooth', .03, 70); noise(.9, .18, 380, 140); return; }
    if (kind === 'shatter') { [1480, 1175, 1760, 990, 1320].forEach((f, i) => tone(f, t0 + i * .045, .2, 'triangle', .045)); noise(.25, .25, 5000, 1500, 'highpass'); return; }
    if (kind === 'collapse') { tone(110, t0, 1.3, 'sawtooth', .05, 30); tone(70, t0 + .2, 1.4, 'sine', .12, 28); noise(1.4, .35, 900, 120); return; }
    if (kind === 'ignite') { noise(.45, .22, 900, 200); tone(220, t0, .35, 'sine', .05, 330); return; }
    if (kind === 'light') { [523, 659, 784].forEach((f, i) => tone(f, t0 + i * .06, .5, 'sine', .04)); return; }
    if (kind === 'tap') { noise(.045, .16, 2600, 1100, 'bandpass'); tone(300, t0, .05, 'triangle', .035, 170); return; }
    if (kind === 'done') { tone(784, t0, .22, 'triangle', .06); tone(1175, t0 + .07, .3, 'triangle', .055); tone(1568, t0 + .14, .42, 'sine', .04); noise(.18, .07, 4000, 9000, 'highpass'); return; }
    const notes = { blip: [440], step: [392, 523], gone: [262, 330, 392, 523], boss: [196, 262, 330, 392, 523, 659], level: [330, 392, 494, 659] }[kind] || [440];
    notes.forEach((f, i) => tone(f, t0 + i * .11, .45, 'triangle', .07));
  } catch (e) {}
}

/* ================= canvas core ================= */
const W5 = 192, H5 = 132, FY = 100, SC5 = 6;
let g = null, lastT = 0, target = null;
const cache = {};
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function R(x, y, w, h, c) { if (w <= 0 || h <= 0) return; g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function A(a, fn) { const p = g.globalAlpha; g.globalAlpha = a; fn(); g.globalAlpha = p; }
function sprite(pat, x, y, pal, flip) { const w = pat[0].length; pat.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.' && pal[ch]) R(x + (flip ? w - 1 - i : i), y + j, 1, 1, pal[ch]); })); }
function disc(cx, cy, r, c) { for (let dy = -r; dy <= r; dy++) { const dx = Math.floor(Math.sqrt(r * r - dy * dy)); R(cx - dx, cy + dy, dx * 2 + 1, 1, c); } }
function discClear(cx, cy, r) { for (let dy = -r; dy <= r; dy++) { const dx = Math.floor(Math.sqrt(r * r - dy * dy)); g.clearRect(cx - dx, cy + dy, dx * 2 + 1, 1); } }
function archRows(cx, spring, hw, fn) { const w = hw * 2, apex = Math.round(1.732 * hw); for (let y = 0; y <= apex; y++) { const s = Math.sqrt(Math.max(0, w * w - y * y)), l = cx - hw + (w - s), r = cx - hw + s; if (r - l >= 1) fn(Math.round(l), spring - y, Math.round(r - l)); } }
function pArch(cx, spring, hw, floor, c) { archRows(cx, spring, hw, (x, y, w) => R(x, y, w, 1, c)); R(cx - hw, spring, hw * 2, floor - spring, c); }
function pArchClear(cx, spring, hw, floor) { archRows(cx, spring, hw, (x, y, w) => g.clearRect(x, y, w, 1)); g.clearRect(cx - hw, spring, hw * 2, floor - spring); }
function rArch(cx, spring, r, floor, c) { for (let y = 0; y <= r; y++) { const hw = Math.round(Math.sqrt(r * r - y * y)); R(cx - hw, spring - y, hw * 2, 1, c); } R(cx - r, spring, r * 2, floor - spring, c); }
const SH = {};
function shade(c, f) { const k = c + f; if (SH[k]) return SH[k]; const n = parseInt(c.slice(1), 16), cl = v => Math.max(0, Math.min(255, Math.round(v * f))); return (SH[k] = 'rgb(' + cl(n >> 16) + ',' + cl((n >> 8) & 255) + ',' + cl(n & 255) + ')'); }
function rgbOf(c) { const n = parseInt(c.slice(1), 16); return [(n >> 16) / 255 * 1.25, ((n >> 8) & 255) / 255 * 1.25, (n & 255) / 255 * 1.25]; }
function getStatic(key, w, h, fn) { if (cache[key]) return cache[key]; const c = mk(w, h), prev = g; g = c.getContext('2d'); fn(); g = prev; return (cache[key] = c); }
function flick(t, s) { return REDUCED ? 1 : .86 + .08 * Math.sin(t / 97 + s * 1.7) + .06 * Math.sin(t / 41 + s); }
function bloom(x, y, r, c, a) {
  const op = g.globalCompositeOperation; g.globalCompositeOperation = 'lighter'; g.fillStyle = c;
  for (let k = r; k >= 1; k--) { g.globalAlpha = a * .065; for (let dy = -k; dy <= k; dy++) { const dx = Math.floor(Math.sqrt(k * k - dy * dy)); g.fillRect(x - dx, y + dy, dx * 2 + 1, 1); } }
  g.globalAlpha = 1; g.globalCompositeOperation = op;
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => v / 16);
const VIGS = {};
function lightPass(ctx, w, h, lights, amb) {
  const im = ctx.getImageData(0, 0, w, h), d = im.data, key = w + 'x' + h;
  let V = VIGS[key];
  if (!V) { V = VIGS[key] = new Float32Array(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const nx = (x / w - .5) * 2, ny = (y / h - .45) * 2; V[y * w + x] = Math.max(.62, 1 - .28 * (nx * nx + ny * ny)); } }
  const L = lights.filter(l => l.i > .01).map(l => ({ x: l.x, y: l.y, r2: l.r * l.r, ir: 1 / l.r, cr: l.c[0] * l.i, cg: l.c[1] * l.i, cb: l.c[2] * l.i, x0: Math.max(0, Math.floor(l.x - l.r)), x1: Math.min(w, Math.ceil(l.x + l.r)), y0: Math.max(0, Math.floor(l.y - l.r)), y1: Math.min(h, Math.ceil(l.y + l.r)) }));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4; if (d[o + 3] === 0) continue;
      const v = V[y * w + x]; let lr = amb[0] * v, lg = amb[1] * v, lb = amb[2] * v;
      for (let k = 0; k < L.length; k++) { const l = L[k]; if (x < l.x0 || x >= l.x1 || y < l.y0 || y >= l.y1) continue; const dx = x - l.x, dy = y - l.y, d2 = dx * dx + dy * dy; if (d2 < l.r2) { let f = 1 - Math.sqrt(d2) * l.ir; f *= f; lr += f * l.cr; lg += f * l.cg; lb += f * l.cb; } }
      const th = BAYER[((y & 3) << 2) + (x & 3)];
      lr = Math.min(1.45, Math.floor(lr * 8 + th) / 8); lg = Math.min(1.45, Math.floor(lg * 8 + th) / 8); lb = Math.min(1.45, Math.floor(lb * 8 + th) / 8);
      d[o] = Math.min(255, d[o] * lr); d[o + 1] = Math.min(255, d[o + 1] * lg); d[o + 2] = Math.min(255, d[o + 2] * lb);
    }
  }
  ctx.putImageData(im, 0, 0);
}
const BUF = {};
function bufs(w, h) { const k = w + 'x' + h; if (!BUF[k]) { const a = mk(w, h), b = mk(w, h); BUF[k] = { lit: a, litX: a.getContext('2d', { willReadFrequently: true }), vis: b, visX: b.getContext('2d') }; } return BUF[k]; }
function renderLit(ctx, w, h, sc, o) {
  const B = bufs(w, h);
  B.visX.setTransform(1, 0, 0, 1, 0, 0); B.visX.globalAlpha = 1; B.visX.globalCompositeOperation = 'source-over'; B.visX.clearRect(0, 0, w, h);
  if (o.sky) B.visX.drawImage(getStatic(o.sky[0], w, h, o.sky[1]), 0, 0); else { B.visX.fillStyle = '#050404'; B.visX.fillRect(0, 0, w, h); }
  B.litX.setTransform(1, 0, 0, 1, 0, 0); B.litX.globalAlpha = 1; B.litX.globalCompositeOperation = 'source-over'; B.litX.clearRect(0, 0, w, h);
  B.litX.drawImage(getStatic(o.alb[0], w, h, o.alb[1]), 0, 0);
  if (o.blend) { B.litX.globalAlpha = o.blend[2]; B.litX.drawImage(getStatic(o.blend[0], w, h, o.blend[1]), 0, 0); B.litX.globalAlpha = 1; }
  g = B.litX; if (o.dynA) o.dynA();
  lightPass(B.litX, w, h, o.lights, o.amb);
  B.visX.drawImage(B.lit, 0, 0);
  g = B.visX; if (o.dynE) o.dynE();
  const sh = o.shake || [0, 0];
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w * sc, h * sc); ctx.drawImage(B.vis, sh[0] * sc, sh[1] * sc, w * sc, h * sc);
}
/* draws fn() into a side buffer, then stamps a 1px dark silhouette outline under it so characters read against busy stone */
const OUT = {};
function outlined(fn, col) {
  const tgt = g, w = tgt.canvas.width, h = tgt.canvas.height, k = w + 'x' + h;
  if (!OUT[k]) { const a = mk(w, h), b = mk(w, h); OUT[k] = { a, ax: a.getContext('2d'), b, bx: b.getContext('2d') }; }
  const O = OUT[k];
  O.ax.setTransform(1, 0, 0, 1, 0, 0); O.ax.globalAlpha = 1; O.ax.globalCompositeOperation = 'source-over'; O.ax.clearRect(0, 0, w, h);
  g = O.ax; fn(); g = tgt;
  O.bx.globalCompositeOperation = 'source-over'; O.bx.clearRect(0, 0, w, h); O.bx.drawImage(O.a, 0, 0);
  O.bx.globalCompositeOperation = 'source-in'; O.bx.fillStyle = col || '#140E0C'; O.bx.fillRect(0, 0, w, h); O.bx.globalCompositeOperation = 'source-over';
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) tgt.drawImage(O.b, dx, dy);
  tgt.drawImage(O.a, 0, 0);
}
function shake(amp, ms) { const now = performance.now(); if (now > shakeUntil) shakeAmp = 0; shakeAmp = Math.max(shakeAmp, amp); shakeUntil = Math.max(shakeUntil, now + ms); }
function shakeOff(t) { if (REDUCED || t > shakeUntil) return [0, 0]; const k = Math.min(1, (shakeUntil - t) / 400), a = shakeAmp * k; return [Math.round(Math.sin(t / 17) * a), Math.round(Math.cos(t / 23) * a * .6)]; }
function hitStop(ms) { if (REDUCED) return; drawTarget(performance.now()); hitStopUntil = performance.now() + ms; }

/* ================= detail helpers & props ================= */
const PALS = {
  under: { b: '#6E6259', l: '#7E7166', d: '#5A4F48', m: '#3E3631' },
  col: { b: '#82756A', l: '#968878', d: '#665A50', m: '#3E3631' },
  floorU: { b: '#625750', l: '#72665C', d: '#52483F', m: '#322A25' },
  gate: { b: '#82766E', l: '#94877E', d: '#6E635C', m: '#443A33' },
  tower: { b: '#6E6870', l: '#7E7884', d: '#5C575E', m: '#3C383E' },
  chapel: { b: '#827268', l: '#948478', d: '#6D6058', m: '#423834' }
};
const WARM = [1.2, .8, .46], COOL = [.58, .7, 1.05], GOLD = [1.15, .92, .55], EMBERL = [1.25, .6, .3];
function blocks(x, y, w, h, P, seed, bw, bh) {
  bw = bw || 12; bh = bh || 6; const r = rng(seed);
  R(x, y, w, h, P.m);
  for (let row = 0, yy = y; yy < y + h; row++, yy += bh) {
    const off = row % 2 ? (bw >> 1) : 0, hh = Math.min(bh - 1, y + h - yy - 1);
    if (hh <= 0) break;
    for (let xx = x - off; xx < x + w; xx += bw) {
      const bx = Math.max(x, xx + 1), ex = Math.min(x + w, xx + bw), ww = ex - bx;
      if (ww <= 0) continue;
      const v = r(), col = v < .22 ? P.d : v > .86 ? P.l : P.b;
      R(bx, yy + 1, ww, hh, col); R(bx, yy + 1, ww, 1, shade(col, 1.14)); R(bx, yy + hh, ww, 1, shade(col, .8));
      const v2 = r();
      if (v2 < .1 && ww > 4) { let cx = bx + 1 + Math.floor(r() * (ww - 3)); for (let k = 0; k < hh - 1; k++) { R(cx, yy + 2 + k, 1, 1, P.m); if (r() < .5) cx++; } }
      else if (v2 > .93) R(bx + Math.floor(r() * ww), yy + 1 + Math.floor(r() * hh), 2, 1, shade(col, .7));
    }
  }
}
function column(x, y0, y1, w, P) {
  R(x, y0, w, y1 - y0, P.b); R(x, y0, 1, y1 - y0, shade(P.b, 1.2)); R(x + w - 1, y0, 1, y1 - y0, shade(P.b, .68));
  for (let i = 3; i < w - 2; i += 3) R(x + i, y0 + 15, 1, y1 - y0 - 22, shade(P.b, .86));
  R(x - 2, y0 + 10, w + 4, 3, P.l); R(x - 2, y0 + 10, w + 4, 1, shade(P.l, 1.18)); R(x - 1, y0 + 13, w + 2, 2, shade(P.b, .9));
  R(x - 2, y1 - 5, w + 4, 5, P.l); R(x - 2, y1 - 5, w + 4, 1, shade(P.l, 1.18)); R(x - 1, y1 - 7, w + 2, 2, shade(P.b, .9));
}
function flagstones(y0, y1, P, seed) {
  const r = rng(seed); R(0, y0, W5, y1 - y0, P.m);
  for (let row = 0, yy = y0; yy < y1; row++) {
    const h = 4 + row, sw = 14 + row * 3, off = (row * 7) % 13;
    for (let xx = -off; xx < W5; xx += sw) { const v = r(), c = v < .25 ? P.d : v > .85 ? P.l : P.b; R(xx + 1, yy + 1, sw - 1, h - 1, c); R(xx + 1, yy + 1, sw - 1, 1, shade(c, 1.12)); }
    yy += h;
  }
}
function crate5(x, y, w, h, c) {
  R(x, y, w, h, shade(c, .66)); R(x + 1, y + 1, w - 2, h - 2, c);
  for (let yy = y + 4; yy < y + h - 1; yy += 3) R(x + 1, yy, w - 2, 1, shade(c, .8));
  R(x + 1, y + 1, w - 2, 1, shade(c, 1.16));
  if (w > 8 && h > 7) for (let i = 0; i < h - 3; i++) R(x + 1 + Math.round(i * (w - 3) / (h - 3)), y + 1 + i, 1, 1, shade(c, .74));
  for (const [px, py] of [[1, 1], [w - 2, 1], [1, h - 2], [w - 2, h - 2]]) R(x + px, y + py, 1, 1, '#2E2A28');
}
function barrel(x, base) { R(x + 1, base - 13, 8, 13, '#7A5634'); R(x, base - 11, 10, 9, '#7A5634'); for (const yy of [base - 12, base - 7, base - 3]) R(x, yy, 10, 1, '#4A4644'); R(x + 3, base - 12, 1, 11, '#94704A'); R(x + 7, base - 12, 1, 11, '#5E422A'); }
function sack(x, base) { R(x + 1, base - 8, 7, 8, '#9A8A6A'); R(x, base - 6, 9, 5, '#9A8A6A'); R(x + 3, base - 10, 3, 2, '#7A6A4A'); R(x + 2, base - 7, 1, 5, '#B0A080'); }
function urn(x, base, c) { c = c || '#9A6A44'; R(x + 1, base - 9, 6, 9, c); R(x, base - 7, 8, 5, c); R(x + 2, base - 11, 4, 2, shade(c, .8)); R(x + 2, base - 7, 1, 4, shade(c, 1.2)); R(x + 1, base - 5, 6, 1, '#C9A24A'); }
function cobweb5(x, y, dir, s) {
  const c = '#A29D96';
  for (let i = 0; i < s; i++) { R(x + i * dir, y, 1, 1, c); R(x, y + i, 1, 1, c); if (i < s * .72) R(x + Math.round(i * .7) * dir, y + Math.round(i * .7), 1, 1, c); }
  for (const rr of [s * .42, s * .78]) for (let a = 0; a <= 8; a++) { const an = a / 8 * Math.PI / 2; R(x + Math.round(Math.cos(an) * rr) * dir, y + Math.round(Math.sin(an) * rr), 1, 1, c); }
}
function chain5(x, y0, len) { for (let i = 0; i < len; i += 3) { R(x, y0 + i, 1, 2, '#7A7672'); R(x - 1, y0 + i + 2, 3, 1, '#5C5854'); } }
function moss(x, y, w, seed) { const r = rng(seed); for (let i = 0; i < w; i++) if (r() < .3) R(x + i, y + Math.floor(r() * 3), 1, 1 + Math.floor(r() * 2), r() < .5 ? '#5E7048' : '#4A5A3A'); }
function banner5(x, y, w, h, c) {
  R(x - 1, y, w + 2, 1, '#5A5654');
  for (let i = 0; i < w; i++) R(x + i, y + 1, 1, h - (i % 2) * 2 - ((i * 5) % 3), i % 3 === 0 ? shade(c, .78) : c);
  R(x + (w >> 1) - 1, y + 6, 3, 5, '#C9A24A'); R(x + (w >> 1), y + 5, 1, 7, '#C9A24A');
}
function candlesA(list, base) { list.forEach(([cx, top]) => { R(cx, top, 2, base - top, '#D8CBB0'); R(cx + 1, top + 1, 1, 2, '#ECE2CC'); R(cx - 1, base - 1, 4, 1, '#C8BBA0'); }); }
function shelf(x, y, w, seed, tidy) {
  R(x, y, w, 2, '#6B4A2E'); R(x, y, w, 1, '#8E6A44'); R(x + 1, y + 2, 1, 3, '#4A3220'); R(x + w - 2, y + 2, 1, 3, '#4A3220');
  const r = rng(seed); let cx = x + 1;
  while (cx < x + w - 3) {
    const k = r();
    if (k < .35) { const h = 5 + Math.floor(r() * 4), bw = 2 + Math.floor(r() * 2), c = ['#9A3E30', '#3E5A88', '#5E7048', '#C9A24A', '#7E6E5E', '#6E4E80'][Math.floor(r() * 6)]; R(cx, y - h, bw, h, c); R(cx, y - h, 1, h, shade(c, 1.22)); R(cx, y - h + 2, bw, 1, '#D8C890'); cx += bw; if (!tidy && r() < .3) { R(cx, y - 3, 4, 2, c); cx += 3; } }
    else if (k < .6) { const h = 4 + Math.floor(r() * 3), c = ['#6F8FB8', '#8AA36B', '#C9A24A', '#B8BCC4'][Math.floor(r() * 4)]; R(cx, y - h, 3, h, c); R(cx, y - h - 1, 3, 1, '#6B4A2E'); R(cx, y - h + 1, 1, h - 2, '#EEF2F8'); cx += 4; }
    else if (k < .75) { R(cx, y - 3, 5, 3, '#D8CBB0'); R(cx + 4, y - 3, 1, 3, '#B8AB90'); R(cx + 2, y - 3, 1, 3, '#A8483A'); cx += 6; }
    else if (k < .87 && tidy) { R(cx, y - 5, 6, 5, '#4A6A9A'); R(cx + 1, y - 3, 4, 2, '#E8E0D0'); cx += 7; }
    else cx += 2;
  }
}
function torchA(x, y) { R(x - 2, y + 4, 5, 1, '#3A3533'); R(x - 1, y + 3, 3, 1, '#3A3533'); R(x, y, 1, 8, '#6B4A2E'); R(x - 1, y - 1, 3, 2, '#4A3626'); }
function hangLantern(x, y0, len) { for (let i = 0; i < len; i += 2) R(x, y0 + i, 1, 1, '#6C6864'); const y = y0 + len; R(x - 2, y, 5, 1, '#4A4644'); R(x - 2, y + 1, 1, 5, '#4A4644'); R(x + 2, y + 1, 1, 5, '#4A4644'); R(x - 1, y + 1, 3, 5, '#2A2420'); R(x - 2, y + 6, 5, 1, '#4A4644'); R(x - 1, y - 1, 3, 1, '#6C6864'); }
function statueHooded(x, base, h, c) {
  c = c || '#8A8078'; const top = base - h;
  for (let i = 0; i < h; i++) { const w = i < h * .3 ? 6 + Math.floor(i / 2) : 8 + Math.floor((i - h * .3) / 4); R(x - (w >> 1), top + i, w, 1, c); R(x - (w >> 1), top + i, 1, 1, shade(c, 1.22)); R(x + (w >> 1) - 1, top + i, 1, 1, shade(c, .72)); }
  R(x - 2, top + 3, 4, 4, shade(c, .5)); R(x - 1, top + Math.floor(h * .45), 3, 4, shade(c, 1.15)); R(x - 6, base, 12, 3, shade(c, .9)); R(x - 6, base, 12, 1, shade(c, 1.15));
}
function tapestry(x, y, w, h, c1, c2) {
  R(x - 1, y - 1, w + 2, 1, '#6B4A2E');
  for (let i = 0; i < w; i++) R(x + i, y, 1, h - ((i % 3 === 1) ? 1 : 0), i % 4 === 0 ? shade(c1, .82) : c1);
  R(x + 2, y + 2, w - 4, 1, c2); R(x + 2, y + h - 4, w - 4, 1, c2);
  R(x + (w >> 1) - 2, y + Math.floor(h * .35), 5, 6, c2); R(x + (w >> 1) - 1, y + Math.floor(h * .35) + 1, 3, 4, shade(c1, .7));
  for (let i = 0; i < w; i += 2) R(x + i, y + h, 1, 2, c2);
}
function ivy(x, y, len, seed) { const r = rng(seed); let cx = x; for (let i = 0; i < len; i++) { R(cx, y + i, 1, 1, '#3E5A30'); if (r() < .45) R(cx + (r() < .5 ? -1 : 1), y + i, 2, 1, r() < .5 ? '#5E7E46' : '#4A6A3A'); if (r() < .2) cx += r() < .5 ? -1 : 1; } }
function roots(x, y, len, seed) { const r = rng(seed); let cx = x; for (let i = 0; i < len; i++) { R(cx, y + i, 1, 1, '#5A4430'); if (r() < .25) cx += r() < .5 ? -1 : 1; if (r() < .12) R(cx + 1, y + i, 2, 1, '#4A3626'); } }
function rugRunner(x, y, w, h, c) { R(x, y, w, h, c); R(x + 1, y + 1, w - 2, 1, '#C9A24A'); R(x + 1, y + h - 2, w - 2, 1, '#C9A24A'); for (let i = 4; i < w - 4; i += 6) R(x + i, y + (h >> 1), 2, 1, '#C9A24A'); }
function chandelier(x, y) { R(x, 0, 1, y, '#6C6864'); R(x - 10, y, 21, 2, '#4A4644'); R(x - 10, y + 2, 1, 2, '#4A4644'); R(x + 10, y + 2, 1, 2, '#4A4644'); R(x - 5, y + 2, 11, 1, '#4A4644'); for (const dx of [-10, -5, 0, 5, 10]) R(x + dx, y - 3, 1, 3, '#D8CBB0'); }
function frieze(x, y, w) { R(x, y, w, 6, '#8A7C70'); R(x, y, w, 1, '#A89A8C'); R(x, y + 5, w, 1, '#5A5048'); for (let i = 2; i < w - 3; i += 6) { R(x + i, y + 2, 3, 2, '#5A5048'); R(x + i + 1, y + 1, 1, 4, '#A89A8C'); } }
function flame5(x, y, t, s, seed) {
  const f = REDUCED ? 0 : Math.floor(t / 100 + (seed || 0)) % 3, h = s + (f === 1 ? 1 : 0);
  R(x - 1, y - h, 3, h, '#D2541E'); R(x, y - h - (f === 2 ? 1 : 0), 1, h, '#FFA552'); R(x, y - 1, 1, 1, '#FFE6B8');
  bloom(x, y - (h >> 1), s + 4, '#FF9A45', .9 * flick(t, seed || 1));
}
function embers5(x, y, t, n, spread) {
  if (REDUCED) return;
  for (let k = 0; k < n; k++) { const cyc = 1.8, tt = t / 1000 + k * .61, a = tt % cyc, gen = Math.floor(tt / cyc); const ex = x + Math.sin(gen * 12.9898 + k * 78.233) * spread + Math.sin(tt * 2 + k) * 2, ey = y - a * 24; g.globalAlpha = Math.max(0, 1 - a / cyc); R(ex, ey, 1, 1, k % 3 ? '#FFA552' : '#FFD08A'); }
  g.globalAlpha = 1;
}
function motes5(t, x, y, w, h, n, seed, c) {
  const r = rng(seed); g.fillStyle = c || '#E7DCC6';
  for (let i = 0; i < n; i++) { const bx = r() * w, by = r() * h, sp = .5 + r(), al = .25 + .3 * r(); g.globalAlpha = al; g.fillRect(Math.round(x + (bx + (REDUCED ? 0 : t / 1000 * 2.4 * sp)) % w), Math.round(y + (by + (REDUCED ? 0 : t / 1000 * 1.2 * sp)) % h), 1, 1); }
  g.globalAlpha = 1;
}
function mist5(t, y, h, a) {
  g.fillStyle = '#9AA6BC';
  for (let k = 0; k < 4; k++) { const span = W5 + 90, x = ((REDUCED ? k * 50 : t / (260 + k * 70)) + k * 61) % span - 80, yy = y + k * Math.max(1, Math.floor(h / 4)); g.globalAlpha = a; g.fillRect(Math.round(x), yy, 70, 2); g.fillRect(Math.round(x) + 12, yy - 1, 40, 1); g.fillRect(Math.round(x) + 8, yy + 2, 50, 1); }
  g.globalAlpha = 1;
}
function rays(x, y, len, w, t) {
  const op = g.globalCompositeOperation; g.globalCompositeOperation = 'lighter'; g.fillStyle = '#7F96C0';
  for (let i = 0; i < len; i++) { g.globalAlpha = Math.max(0, .07 * (1 - i / len) + (REDUCED ? 0 : .015 * Math.sin(t / 900 + i / 9))); g.fillRect(x + Math.round(i * .55), y + i, w, 1); }
  g.globalAlpha = 1; g.globalCompositeOperation = op;
}
function rockFace(x, y, w, h, seed) {
  const r = rng(seed);
  for (let xx = x; xx < x + w; xx++) { const top = y + Math.round(4 * Math.sin(xx / 9) + 3 * Math.sin(xx / 3.7) + 4); R(xx, top, 1, y + h - top, '#6E645F'); R(xx, top, 1, 1, '#8E847E'); }
  for (let yy = y + 10; yy < y + h; yy += 7 + Math.floor(r() * 4)) for (let xx = x; xx < x + w; xx++) if (r() < .7) R(xx, yy + Math.round(Math.sin(xx / 11 + yy)), 1, 1, '#5A504C');
  for (let i = 0; i < w * h / 30; i++) { const v = r(); R(x + Math.floor(r() * w), y + 8 + Math.floor(r() * (h - 8)), 1 + Math.floor(v * 3), 1, v < .5 ? '#5E5450' : '#7E746E'); }
  for (let i = 0; i < w / 12; i++) { let px = x + Math.floor(r() * w), py = y + 10 + Math.floor(r() * h * .5); for (let k = 0; k < 10; k++) { R(px, py, 1, 2, '#423A38'); px += Math.floor(r() * 3) - 1; py += 2; } }
}
function skyNight5(seed, mx, my, hz) {
  const B = ['#0E0E1A', '#121222', '#16162A', '#1B1A32', '#211F3A', '#282442', '#2F294A', '#372F52'];
  const bh = Math.ceil(H5 / B.length); B.forEach((c, i) => R(0, i * bh, W5, bh, c));
  const r = rng(seed);
  for (let i = 0; i < 60; i++) R(Math.floor(r() * W5), Math.floor(r() * hz * .8), 1, 1, r() < .3 ? '#F0ECFF' : '#8A86A8');
  for (let k = 18; k > 6; k -= 2) A(.055, () => disc(mx, my, k, '#E0DAC6'));
  disc(mx, my, 6, '#F2ECD8'); R(mx - 3, my - 1, 2, 2, '#D6CFBA'); R(mx + 1, my + 2, 2, 1, '#D6CFBA'); R(mx + 2, my - 3, 1, 1, '#D6CFBA');
  for (let x = 0; x < W5; x++) { const h = 16 + Math.round(9 * Math.sin(x / 19 + seed) + 5 * Math.sin(x / 6.7 + seed * 2)); R(x, hz - h, 1, h + 60, '#1A1A34'); }
  const r2 = rng(seed + 5); let x = -3;
  while (x < W5) { const tw = 4 + Math.floor(r2() * 10), th = 6 + Math.floor(r2() * 24); R(x, hz - th, tw, th + 60, '#211F38'); if (r2() < .5) R(x + (tw >> 1), hz - th - 5, 1, 5, '#211F38'); if (r2() < .45) R(x + 1 + Math.floor(r2() * Math.max(1, tw - 2)), hz - th + 3 + Math.floor(r2() * 6), 1, 1, '#D0803A'); x += tw + Math.floor(r2() * 6); }
}
function relicAt(x, y, kind, t, a) { bloom(x, y + 4, 14, kind === 'stone' ? '#7FA8FF' : kind === 'seal' ? '#FF6A4A' : '#FFC27A', .85 * a * flick(t, 9)); A(a, () => sprite(RELIC[kind], x - 4, y, SPAL)); }

/* particles */
const PARTS = [];
function addPart(o) { PARTS.push(Object.assign({ t0: performance.now() }, o)); }
function parts(layer, rg) {
  const now = performance.now();
  for (let i = PARTS.length - 1; i >= 0; i--) {
    const q = PARTS[i], a = (now - q.t0) / 1000;
    if (a > q.life) { PARTS.splice(i, 1); continue; }
    if (a < 0 || q.rg !== rg || q.layer !== layer) continue;
    let x = q.x + q.vx * a, y = q.y + q.vy * a + .5 * (q.g || 0) * a * a;
    if (q.floor && y > q.floor) y = q.floor;
    g.globalAlpha = q.fade ? Math.max(0, 1 - a / q.life) : 1; R(x, y, q.w || 1, q.h || 1, q.c); g.globalAlpha = 1;
  }
}
function debris(rg, x, y, n, col) { for (let i = 0; i < n; i++) addPart({ rg, layer: 'a', x: x - 12 + Math.random() * 24, y: y + Math.random() * 16, vx: (Math.random() - .3) * 120, vy: -50 - Math.random() * 90, g: 340, life: 1.5, floor: FY - 2, w: 2 + (Math.random() * 3 | 0), h: 2 + (Math.random() * 2 | 0), c: col || ['#8A6A48', '#7E6040', '#94744E', '#6E4E32'][i % 4], fade: true }); }
function sparks(rg, x, y, n, col) { for (let i = 0; i < n; i++) { const an = Math.random() * Math.PI * 2, sp = 50 + Math.random() * 110; addPart({ rg, layer: 'e', x, y, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp - 30, g: 120, life: .6 + Math.random() * .4, c: col || (i % 2 ? '#FFC27A' : '#FFF0D0'), fade: true }); } }
function shards(rg, x, y, n) { for (let i = 0; i < n; i++) { const an = Math.random() * Math.PI * 2, sp = 40 + Math.random() * 110; addPart({ rg, layer: 'e', x: x + Math.cos(an) * 28, y: y + Math.sin(an) * 24, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp, life: .85, c: '#CFE0FF', fade: true, w: 1 + (i % 2), h: 1 }); } }
