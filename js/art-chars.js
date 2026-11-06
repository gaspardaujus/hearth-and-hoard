'use strict';
/* ================= the hero: layered, 7 cosmetic slots ================= */
function shieldA(P, sh, br) {
  const y = -br;
  if (sh.kind === 'buckler') { for (let dy = -4; dy <= 4; dy++) { const dx = Math.floor(Math.sqrt(16 - dy * dy)); P(1 - dx, 18 + dy + y, dx * 2 + 1, 1, '#4A4644'); if (dx > 1) P(2 - dx, 18 + dy + y, dx * 2 - 1, 1, '#7A5634'); } P(0, 17 + y, 2, 2, '#B8BCC4'); return; }
  const pal = { kite: ['#8A8E96', '#3E5478', '#E0D6C6', '#4A4E56'], crest: ['#B8954A', '#5E4670', '#C9A24A', '#6A5428'], ember: ['#4A4446', '#2A2224', '#7A3A20', '#1E1A1C'], saint: ['#E0D8C8', '#C9A24A', '#F4EEE0', '#A89C88'] }[sh.kind];
  for (let i = 0; i < 16; i++) { const w = i < 10 ? 11 : 11 - (i - 9) * 2; if (w <= 0) continue; const lx = 1 - (w >> 1); P(lx, 11 + i + y, w, 1, pal[0]); if (w > 4) P(lx + 1, 11 + i + y, w - 2, 1, pal[1]); }
  if (sh.kind === 'kite' || sh.kind === 'saint') { P(1, 13 + y, 1, 10, pal[2]); P(-2, 16 + y, 7, 1, pal[2]); }
  if (sh.kind === 'crest') { for (let i = 0; i < 4; i++) { P(-3 + i, 15 + i + y, 1, 1, pal[2]); P(5 - i, 15 + i + y, 1, 1, pal[2]); } P(0, 19 + y, 3, 2, pal[2]); }
  if (sh.kind === 'ember') { P(-1, 15 + y, 5, 5, pal[2]); P(0, 16 + y, 3, 3, '#3A1A10'); }
  P(-4, 11 + y, 11, 1, pal[3]);
}
function capeA(P, cl, sway, br) {
  const long = cl.style === 'long' ? 2 : 0;
  for (let i = 0; i <= 21 + long; i++) {
    const dy = 10 + i - (i < 4 ? br : 0), w = 8 + Math.floor(i * .45), lx = 5 - Math.floor(i * .45) + (i > 12 ? Math.round(sway * (i - 12) / 9) : 0);
    P(lx, dy, w, 1, i % 6 === 5 ? cl.t : cl.c); P(lx, dy, 1, 1, cl.t);
    if (i > 3) P(lx + 2 + (i % 2), dy, 1, 1, shade(cl.c, .84));
  }
  const hy = 32 + long, hs = Math.round(sway * 10 / 9);
  if (cl.style === 'tattered') for (let k = 0; k < 6; k++) P(-4 + k * 3 + hs, hy, 1 + (k % 2), 1 + (k % 2), cl.c);
  if (cl.trim) P(-4 + hs, hy - 1, 17, 1, cl.trim);
  if (cl.fur) { P(3, 8 - br, 11, 3, '#E6DCCB'); P(4, 9 - br, 1, 1, '#B8AE9E'); P(9, 8 - br, 1, 1, '#B8AE9E'); }
}
function legA(P, bt, step, back) {
  const lx = back ? 4 - step : 9 + step, B = BOOTS[bt.kind];
  P(lx, 22, 3, 7, back ? '#2A2420' : '#3A322E');
  const bc = back ? shade(B.c, .78) : B.c;
  P(lx - 1, 29 - B.tall, 5, 5 + B.tall, bc); P(lx - 1, 33, 6, 1, B.sole);
  if (!back) P(lx, 29 - B.tall, 1, 3, B.hi);
  if (bt.kind === 'wraps') { P(lx - 1, 30, 5, 1, '#6A5A40'); P(lx - 1, 32, 5, 1, '#6A5A40'); }
  if (bt.kind === 'iron' || bt.kind === 'saint' || bt.kind === 'ember') { P(lx - 1, 23, 5, 3, bc); P(lx, 23, 2, 1, back ? bc : B.hi); }
}
function chestA(P, ch, br) {
  const Ac = CHEST[ch.kind], y0 = 10 - br;
  P(3, y0, 10, 10, Ac.c); P(3, y0, 10, 1, Ac.hi); P(3, y0 + 9, 10, 1, Ac.lo); P(3, y0, 1, 10, Ac.lo);
  if (ch.kind === 'mail') for (let yy = 1; yy < 9; yy++) for (let xx = yy % 2; xx < 9; xx += 2) P(4 + xx, y0 + yy, 1, 1, '#6E727A');
  if (ch.kind === 'leather') for (const [sx, sy] of [[5, 2], [10, 2], [5, 6], [10, 6], [7, 4]]) P(sx, y0 + sy, 1, 1, '#C8CCD4');
  if (ch.kind === 'tunic') { P(8, y0 + 1, 1, 6, '#5A3E26'); P(7, y0 + 2, 3, 1, '#5A3E26'); P(7, y0 + 4, 3, 1, '#5A3E26'); }
  if (ch.kind === 'plate' || ch.kind === 'ember' || ch.kind === 'saint') { P(5, y0 + 2, 6, 1, Ac.hi); P(8, y0 + 1, 1, 7, Ac.lo); P(4, y0 + 6, 8, 1, Ac.lo); }
  if (Ac.trim) { P(3, y0 + 9, 10, 1, Ac.trim); P(3, y0, 10, 1, Ac.trim); }
  P(5, y0 - 1, 7, 1, Ac.lo);
  const [pw, ph] = Ac.paul;
  P(1, y0 - 1, pw, ph, Ac.c); P(1, y0 - 1, pw, 1, Ac.hi); P(15 - pw, y0 - 1, pw, ph, Ac.c); P(15 - pw, y0 - 1, pw, 1, Ac.hi);
  if (ch.kind === 'ember') { P(2, y0 - 3, 1, 2, Ac.hi); P(13, y0 - 3, 1, 2, Ac.hi); }
  if (ch.kind === 'saint') { P(15 - pw, y0 + ph - 1, pw, 1, '#C9A24A'); P(1, y0 + ph - 1, pw, 1, '#C9A24A'); }
}
function armA(P, ch, hand, pose, br) {
  const Ac = CHEST[ch.kind], sleeve = Ac.c, gl = ch.kind === 'tunic' ? '#C89B7B' : Ac.lo;
  if (pose === 'strike') { P(12, 11 - br, 6, 3, sleeve); P(18, 11 - br, 2, 3, gl); }
  else if (pose === 'raise' || pose === 'victory') { P(12, 4 - br, 3, 8, sleeve); P(12, 1 - br, 3, 3, gl); }
  else { P(12, 11 - br, 3, 5, sleeve); P(13, 15 - br, 3, 3, sleeve); P(13, 17 - br, 3, 3, gl); }
}
function lanternA(P, ln, pos) { const [lx, ly] = pos; P(lx + 1, ly - 2, 1, 2, '#2A2522'); P(lx, ly, 4, 1, ln.frame); P(lx, ly + 1, 1, 4, ln.frame); P(lx + 3, ly + 1, 1, 4, ln.frame); P(lx + 1, ly + 1, 2, 4, '#2A2420'); P(lx, ly + 5, 4, 1, ln.frame); P(lx + 1, ly - 1, 2, 1, ln.frame); }
const wAt = (hand, fwd) => i => fwd ? [hand[0] + 1 + i, hand[1] - Math.floor(i / 6)] : [hand[0] + 1, hand[1] - i];
function weaponA(P, wp, hand, pose) {
  const [hx, hy] = hand, fwd = pose === 'strike', at = wAt(hand, fwd), W = WPN[wp.kind];
  if (W.pole) {
    for (let i = fwd ? -3 : -12; i < W.len; i++) { const [px, py] = at(i); P(px, py, 1, 1, i % 5 ? W.shaft : shade(W.shaft, .78)); }
    const [tx, ty] = at(W.len);
    if (wp.kind === 'staff') { P(tx - 1, ty - 1, 3, 2, '#8E6A44'); P(tx, ty - 2, 1, 1, '#C9A24A'); }
    if (wp.kind === 'keystaff') { if (fwd) { P(tx, ty - 2, 5, 5, '#D0A84A'); P(tx + 1, ty - 1, 3, 3, '#3A2E1E'); } else { P(tx - 2, ty - 5, 5, 5, '#D0A84A'); P(tx - 1, ty - 4, 3, 3, '#3A2E1E'); P(tx, ty, 1, 6, '#D0A84A'); P(tx + 1, ty + 2, 2, 1, '#D0A84A'); P(tx + 1, ty + 4, 2, 1, '#D0A84A'); } }
    if (wp.kind === 'glaive') { if (fwd) { for (let k = 0; k < 8; k++) P(tx + k, ty - 1 - Math.floor(k / 3), 1, 3, k < 6 ? '#C9CDD4' : '#E8ECF2'); P(tx - 1, ty - 2, 2, 5, '#C9A25A'); } else { for (let k = 0; k < 9; k++) P(tx - 1 + Math.floor(k / 3), ty - k, 3, 1, '#C9CDD4'); P(tx - 2, ty + 1, 5, 2, '#C9A25A'); P(tx + 2, ty - 8, 1, 1, '#F0F4F8'); } }
  } else if (W.blade) {
    if (fwd) { P(hx - 1, hy, 2, 1, W.shaft); P(hx + 1, hy - 2, 1, 5, W.guard); for (let i = 0; i < W.bladeL; i++) P(hx + 2 + i, hy - 1, 1, 2, W.blade); P(hx + 2 + W.bladeL, hy, 1, 1, W.blade); P(hx + 2, hy - 1, W.bladeL, 1, shade(W.blade, 1.12)); }
    else { P(hx + 1, hy + 1, 1, 2, W.shaft); P(hx + 1, hy + 3, 1, 1, W.guard); P(hx - 1, hy - 1, 5, 1, W.guard); for (let i = 0; i < W.bladeL; i++) P(hx + 1, hy - 2 - i, 2, 1, W.blade); P(hx + 1, hy - 2 - W.bladeL, 1, 1, W.blade); P(hx + 1, hy - W.bladeL - 1, 1, W.bladeL - 1, shade(W.blade, 1.12)); }
  } else if (wp.kind === 'hammer') {
    for (let i = -3; i < W.len; i++) { const [px, py] = at(i); P(px, py, 1, 1, W.shaft); }
    const [tx, ty] = at(W.len);
    if (fwd) { P(tx, ty - 4, 6, 8, W.head); P(tx, ty - 4, 6, 1, '#6E686A'); P(tx + 2, ty - 1, 2, 2, '#2A2022'); } else { P(tx - 3, ty - 5, 8, 6, W.head); P(tx - 3, ty - 5, 8, 1, '#6E686A'); P(tx - 1, ty - 3, 3, 2, '#2A2022'); }
  }
}
function stowedA(P, wp) {
  const W = WPN[wp.kind];
  if (W.pole) { for (let i = 0; i < 26; i++) P(-1 + Math.floor(i * .45), 31 - i, 1, 1, W.shaft); return; }
  if (W.blade) { P(0, 20, 2, 10, '#3A2A20'); P(0, 29, 2, 1, W.guard); P(-1, 19, 4, 1, W.guard); P(0, 16, 2, 3, W.shaft); return; }
  P(1, 19, 1, 9, W.shaft); P(-1, 26, 5, 4, W.head); P(-1, 26, 5, 1, '#6E686A');
}
function headA(P, hd, cl, br) {
  const y = -br;
  if (hd.kind === 'helm' || hd.kind === 'ashhelm' || hd.kind === 'emberhelm' || hd.kind === 'saint') {
    const c = { helm: ['#767A82', '#A8ACB4', '#5E626A'], ashhelm: ['#A8ACB8', '#D4D8E2', '#7A7E8A'], emberhelm: ['#3E3638', '#5E5458', '#241E20'], saint: ['#D8D0C0', '#F4EEE0', '#A89C88'] }[hd.kind];
    P(6, y, 5, 1, c[0]); P(5, y + 1, 7, 1, c[0]); P(4, y + 2, 9, 7, c[0]); P(5, y + 1, 3, 3, c[1]); P(4, y + 8, 9, 1, c[2]);
    if (hd.kind === 'saint') { P(9, y + 3, 3, 5, '#C89B7B'); P(10, y + 4, 1, 1, '#1A1412'); P(8, y + 2, 5, 1, '#C9A24A'); P(4, y + 8, 9, 1, '#C9A24A'); }
    else { P(8, y + 4, 5, 1, '#16181C'); P(10, y + 6, 1, 1, '#16181C'); P(12, y + 6, 1, 1, '#16181C'); P(12, y + 3, 1, 4, c[2]); }
    if (hd.kind === 'helm') { P(5, y - 3, 3, 1, '#8E2F23'); P(4, y - 2, 2, 2, '#8E2F23'); P(7, y - 2, 1, 2, '#A83A2C'); }
    if (hd.kind === 'ashhelm') { P(7, y - 3, 2, 3, '#C9A24A'); P(4, y + 2, 9, 1, '#C9A24A'); P(11, y + 5, 2, 3, '#C9A24A'); }
    if (hd.kind === 'emberhelm') { P(3, y, 2, 2, '#D8CFC0'); P(2, y - 2, 1, 2, '#D8CFC0'); P(1, y - 3, 1, 1, '#D8CFC0'); P(12, y, 2, 2, '#D8CFC0'); P(14, y - 2, 1, 2, '#D8CFC0'); P(15, y - 3, 1, 1, '#D8CFC0'); }
    return;
  }
  const isCrown = hd.kind === 'crown', hc = isCrown ? '#2A2030' : cl.c, hs = isCrown ? '#1A1420' : cl.t;
  P(6, y, 5, 1, hc); P(5, y + 1, 7, 1, hc); P(4, y + 2, 9, 7, hc); P(4, y + 2, 1, 7, hs); P(3, y + 4, 1, 4, hc); P(5, y + 1, 2, 1, shade(hc, 1.18));
  P(8, y + 3, 4, 5, '#241C18'); P(10, y + 4, 2, 4, '#C89B7B'); P(10, y + 5, 1, 1, '#1A1412'); P(9, y + 7, 3, 1, '#A87B5E');
  if (cl.trim && hd.kind === 'hood') P(7, y + 1, 1, 8, cl.trim);
  if (hd.kind === 'cowl') { P(9, y + 6, 4, 3, '#1E1A18'); P(10, y + 5, 2, 1, '#1E1A18'); }
  if (hd.kind === 'crownhood') { P(5, y + 1, 7, 1, '#C9A24A'); P(5, y - 1, 1, 2, '#C9A24A'); P(8, y - 2, 1, 3, '#C9A24A'); P(11, y - 1, 1, 2, '#C9A24A'); }
  if (isCrown) { P(4, y - 1, 9, 2, '#C9A24A'); [3, 4, 5, 4, 3].forEach((h, i) => P(4 + i * 2, y - 1 - h, 1, h, '#C9A24A')); }
}
function setAura(x, top, t, id) {
  if (id === 'ember') { embers5(x + 8, top + 30, t, 9, 9); bloom(x + 8, top + 33, 10, '#FF8A3D', .3); }
  if (id === 'saint') { for (let k = 0; k < 6; k++) { const a = (REDUCED ? 0 : t / 900) + k * 1.05, px = x + 8 + Math.round(Math.cos(a) * 12), py = top + 18 + Math.round(Math.sin(a) * 15); R(px, py, 1, 1, '#F8E8B0'); bloom(px, py, 2, '#F0D890', .55); } }
  if (id === 'ashen') { for (let k = 0; k < 5; k++) { const ph = ((REDUCED ? 0 : t / 380) + k * 2.3) % 5; if (ph < 1) { const px = x + 3 + ((k * 7) % 11), py = top + 4 + ((k * 11) % 26); R(px, py, 1, 1, '#FFFFFF'); R(px - 1, py, 3, 1, '#DDE4F0'); R(px, py - 1, 1, 3, '#DDE4F0'); } } }
}
function heroRig(x, base, t, G, pass, o) {
  o = o || {};
  const mono = o.mono, C = c => mono || c, still = REDUCED || o.still, top = base - 34;
  const P = (dx, dy, w, h, c) => R(x + dx, top + dy, w, h, C(c)), E = (dx, dy, w, h, c) => R(x + dx, top + dy, w, h, c);
  const pose = o.pose || 'idle', br = still ? 0 : (Math.sin(t / 650) > .55 ? 1 : 0), sway = still ? 0 : Math.round(Math.sin(t / 520) * 1.3);
  const step = o.walking && !still ? Math.floor(t / 150) % 2 : 0, lsw = still ? 0 : Math.round(Math.sin(t / 600) * .6);
  const hd = G.head, cl = G.cloak, ch = G.chest, bt = G.boots, wp = G.weapon, sh = G.shield, ln = G.lantern;
  const hand = pose === 'strike' ? [19, 14 - br] : (pose === 'raise' || pose === 'victory') ? [13, 2 - br] : [14, 18 - br];
  const lp = pose === 'raise' ? [hand[0] - 1, hand[1] - 1] : [11 + lsw, 22];
  if (pass === 'albedo') {
    if (sh.kind !== 'none') shieldA(P, sh, br);
    capeA(P, cl, sway, br);
    legA(P, bt, step, true);
    if (pose === 'raise' && wp.kind !== 'none') stowedA(P, wp);
    chestA(P, ch, br);
    legA(P, bt, step, false);
    P(3, 20, 10, 2, '#2A221E'); P(7, 20, 2, 2, '#C9A24A');
    if (pose !== 'raise') lanternA(P, ln, lp);
    armA(P, ch, hand, pose, br);
    if (wp.kind !== 'none' && pose !== 'raise') weaponA(P, wp, hand, pose);
    if (pose === 'raise') lanternA(P, ln, lp);
    headA(P, hd, cl, br);
    return;
  }
  if (mono) return;
  E(lp[0] + 1, lp[1] + 1, 2, 4, ln.glow); E(lp[0] + 1, lp[1] + 2, 1, 1, '#FFFFFF');
  bloom(x + lp[0] + 2, top + lp[1] + 3, pose === 'raise' ? 14 : 8, ln.glow, .95 * flick(t, 3));
  const y = -br;
  if (hd.kind === 'cowl') { E(11, y + 5, 1, 1, '#FFB347'); bloom(x + 11, top + y + 5, 2, '#FF8A3D', .6); }
  if (hd.kind === 'emberhelm') { E(8, y + 4, 5, 1, '#FF8A3D'); bloom(x + 10, top + y + 4, 4, '#FF8A3D', .7 * flick(t, 5)); }
  if (hd.kind === 'helm' || hd.kind === 'ashhelm') E(11, y + 4, 1, 1, '#9FC0FF');
  if (hd.kind === 'saint') { for (let i = -5; i <= 5; i++) E(8 + i, y - 3 + (Math.abs(i) > 3 ? 1 : 0), 1, 1, '#FFF0B0'); bloom(x + 8, top + y - 3, 6, '#F0D890', .6 * flick(t, 4)); }
  if (hd.kind === 'crown') { E(8, y - 2, 1, 1, '#FF6A4A'); E(10, y + 5, 1, 1, '#FF6A4A'); bloom(x + 8, top + y - 2, 3, '#FF6A4A', .6); }
  if (hd.kind === 'crownhood') E(8, y - 2, 1, 1, '#FF8A70');
  if (ch.kind === 'ember') { const p = REDUCED ? .8 : .55 + .45 * Math.sin(t / 380); g.globalAlpha = p; E(5, 13 + y, 1, 4, '#FF8A3D'); E(10, 13 + y, 1, 4, '#FF8A3D'); E(6, 17 + y, 4, 1, '#FF8A3D'); E(7, 12 + y, 2, 1, '#FFC27A'); g.globalAlpha = 1; bloom(x + 8, top + 15 + y, 5, '#FF8A3D', .4 * p); }
  if (ch.kind === 'saint') { E(7, 13 + y, 2, 4, '#FFE6A0'); E(6, 14 + y, 4, 1, '#FFE6A0'); bloom(x + 8, top + 15 + y, 5, '#F0D890', .45 * flick(t, 6)); }
  if (cl.glow) { const hs = Math.round(sway * 10 / 9), hy = 31; g.globalAlpha = .75; E(-4 + hs, hy, 17, 1, '#FF8A3D'); g.globalAlpha = 1; embers5(x + 4 + hs, top + hy, t, 4, 7); }
  if (bt.kind === 'ember') { E(3 - step, 33, 6, 1, '#FF8A3D'); E(8 + step, 33, 6, 1, '#FF8A3D'); bloom(x + 8, top + 33, 5, '#FF8A3D', .45); }
  if (bt.kind === 'saint') { E(9 + step, 30, 1, 1, '#FFF0B0'); }
  if (wp.kind === 'blade' && pose !== 'raise') { const [hx, hy] = hand, L = WPN.blade.bladeL; if (pose === 'strike') { E(hx + 2, hy - 1, L, 1, '#FFE6B8'); bloom(x + hx + 2 + (L >> 1), top + hy, 7, '#FFA552', .55 * flick(t, 6)); } else { E(hx + 1, hy - L - 1, 1, L - 1, '#FFE6B8'); bloom(x + hx + 1, top + hy - 2 - (L >> 1), 7, '#FFA552', .55 * flick(t, 6)); } }
  if (wp.kind === 'hammer' && pose !== 'raise') { const [tx, ty] = wAt(hand, pose === 'strike')(WPN.hammer.len); if (pose === 'strike') { E(tx + 2, ty - 1, 2, 2, '#FF8A3D'); bloom(x + tx + 3, top + ty, 6, '#FF8A3D', .75 * flick(t, 7)); } else { E(tx - 1, ty - 3, 3, 2, '#FF8A3D'); bloom(x + tx, top + ty - 2, 6, '#FF8A3D', .75 * flick(t, 7)); } }
  if (wp.kind === 'keystaff' && pose !== 'raise') { const fwd = pose === 'strike', [tx, ty] = wAt(hand, fwd)(WPN.keystaff.len), gx = fwd ? tx + 2 : tx, gy = fwd ? ty : ty - 3; E(gx, gy, 1, 1, '#FFE6A0'); bloom(x + gx, top + gy, 4, '#E0C070', .55); }
  if (sh.kind === 'ember') { E(0, 16 + y, 3, 3, '#FF8A3D'); bloom(x + 1, top + 17 + y, 4, '#FF8A3D', .5 * flick(t, 2)); }
  if (sh.kind === 'saint') { g.globalAlpha = .7; E(-4, 11 + y, 11, 1, '#FFF0B0'); g.globalAlpha = 1; bloom(x + 1, top + 18 + y, 6, '#F0D890', .3); }
  const set = activeSet(G); if (set && !o.noAura) setAura(x, top, t, set);
  if (o.slash >= 0 && o.slash <= 1) {
    const k = o.slash, cx = x + 20, cy = top + 14, r = 12, a0 = -1.25, cur = a0 + 2.5 * k;
    for (let a = a0; a <= cur; a += .07) { const fade = 1 - (cur - a) / 1.3; if (fade <= 0) continue; g.globalAlpha = fade; R(cx + Math.round(Math.cos(a) * r), cy + Math.round(Math.sin(a) * r), 2, 1, fade > .7 ? '#FFFFFF' : '#FFC27A'); R(cx + Math.round(Math.cos(a) * (r - 2)), cy + Math.round(Math.sin(a) * (r - 2)), 1, 1, '#FFE6B8'); }
    g.globalAlpha = 1; bloom(cx + 6, cy, 9, '#FFC27A', .55 * (1 - Math.abs(k - .5)));
  }
}
function heroThumb(G, scale, mono) {
  const key = 'hero6|' + SLOTS.map(s => G[s].id).join('.') + '@' + scale + (mono || '');
  if (urlCache[key]) return urlCache[key];
  const tmp = mk(40, 54), prev = g; g = tmp.getContext('2d');
  outlined(() => heroRig(12, 50, 0, G, 'albedo', { still: true, mono }), mono ? '#141010' : null); if (!mono) heroRig(12, 50, 0, G, 'emissive', { still: true, noAura: true });
  g = prev;
  const c = mk(40 * scale, 54 * scale), x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(tmp, 0, 0, 40 * scale, 54 * scale);
  return (urlCache[key] = c.toDataURL());
}
const miniPal = () => { const G = curGear(); return { h: G.cloak.c, H: G.cloak.t, c: G.cloak.c, C: G.cloak.t, s: '#C89B7B', e: '#1A1412', m: G.cloak.trim || G.cloak.c, l: '#3A332E', L: G.lantern.glow, b: '#231C19' }; };
function lanternLight(x, base, pose, G, t, boost) {
  const top = base - 34, lp = pose === 'raise' ? [12, 0] : [11, 22];
  return { x: x + lp[0] + 2, y: top + lp[1] + 3, r: pose === 'raise' ? 60 : 46, i: (pose === 'raise' ? 1.5 : 1.25) * (boost || 1) * flick(t, 3), c: rgbOf(G.lantern.glow) };
}

/* ================= the house cat ================= */
function catState(t, baseX, floor) {
  if (REDUCED) return { pose: 'sit', x: baseX, bottom: floor, flip: false };
  const c = t % 30000;
  if (c < 16000) return { pose: 'sit', x: baseX, bottom: floor, flip: false };
  if (c < 20000) { const p = (c - 16000) / 4000; return { pose: 'walk', x: Math.round(baseX - Math.sin(p * Math.PI) * 9), bottom: floor, flip: p < .5 }; }
  return { pose: 'sleep', x: baseX - 2, bottom: floor, flip: false };
}
const catPat = (c, t) => c.pose === 'sleep' ? CAT_SLEEP : c.pose === 'walk' ? CAT_WALK[REDUCED ? 0 : Math.floor(t / 180) % 2] : CAT_SIT[REDUCED ? 0 : Math.floor(t / 1100) % 2];
function drawCatA(c, t) { const pat = catPat(c, t); sprite(pat, c.x, c.bottom - pat.length, coatPal(S.cat.coat), c.flip); }
function drawCatE(c, t) {
  const pat = catPat(c, t), pal = coatPal(S.cat.coat), w = pat[0].length;
  if (S.cat.coat === 'black') pat.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'k') { const x = c.x + (c.flip ? w - 1 - i : i), y = c.bottom - pat.length + j; R(x, y, 1, 1, pal.k); bloom(x, y, 2, '#FFA552', .45); } }));
  if (c.pose === 'sleep' && !REDUCED) { const z = Math.floor(t / 600) % 3; g.globalAlpha = .8; R(c.x + 9 + z, c.bottom - 7 - z * 2, 2, 1, '#E7DCC6'); R(c.x + 10 + z, c.bottom - 8 - z * 2, 1, 1, '#E7DCC6'); g.globalAlpha = 1; }
  if (t - petAt < 1400) sprite(HEART, c.x + 2, c.bottom - pat.length - 6 - Math.floor((t - petAt) / 300), { r: '#E0604A' });
}

/* ================= bosses ================= */
const MTN = [
  { lv: 4, k: 'frames', x: -28, y: -66, w: 56, h: 16, z: 0 },
  { lv: 1, k: 'trunk', x: -24, y: -17, w: 13, h: 17, c: '#7A5A3C', z: 1 },
  { lv: 1, k: 'trunk', x: 11, y: -17, w: 13, h: 17, c: '#7E5E40', z: 1 },
  { lv: 1, k: 'steamer', x: -22, y: -33, w: 44, h: 17, c: '#6E4E32', z: 2, up: 1 },
  { lv: 1, k: 'crate', x: -20, y: -50, w: 40, h: 18, c: '#8A6A48', z: 3, up: 1 },
  { lv: 3, k: 'crate', x: -16, y: -58, w: 32, h: 9, c: '#7A5C40', z: 3, up: 1 },
  { lv: 2, k: 'crate', x: -37, y: -54, w: 17, h: 12, c: '#806246', z: 4, up: 1 },
  { lv: 3, k: 'crate', x: 20, y: -54, w: 17, h: 12, c: '#86664A', z: 4, up: 1 },
  { lv: 2, k: 'rug', x: -38, y: -43, w: 9, h: 22, c: '#8E3A2E', z: 5, up: 1 },
  { lv: 2, k: 'crate', x: -43, y: -23, w: 15, h: 13, c: '#76583C', z: 6, up: 1 },
  { lv: 3, k: 'legs', x: 29, y: -44, w: 9, h: 20, c: '#6B4A2E', z: 5, up: 1 },
  { lv: 3, k: 'chestbox', x: 26, y: -27, w: 16, h: 13, c: '#5A3E2A', z: 6, up: 1 },
  { lv: 2, k: 'chain', x: -22, y: -48, w: 44, h: 30, z: 7, up: 1 },
  { lv: 3, k: 'drape', x: -32, y: -56, w: 64, h: 12, c: '#5E6648', z: 8, up: 1 },
  { lv: 1, k: 'head', x: -12, y: -67, w: 24, h: 16, c: '#94744E', z: 9, up: 2 },
  { lv: 4, k: 'shade', x: -9, y: -76, w: 18, h: 9, c: '#B89A6A', z: 10, up: 2 },
  { lv: 4, k: 'candles', x: -34, y: -60, w: 70, h: 6, z: 11, up: 1 }
];
function mtnPiece(m, X, Y, flash) {
  const c = flash ? '#FFFFFF' : m.c, f = v => flash ? '#FFFFFF' : v;
  switch (m.k) {
    case 'crate': crate5(X, Y, m.w, m.h, c); break;
    case 'trunk': R(X, Y, m.w, m.h, shade(c, .7)); R(X + 1, Y + 1, m.w - 2, m.h - 2, c); for (const yy of [Y + 3, Y + m.h - 5]) { R(X, yy, m.w, 2, f('#4A4644')); R(X, yy, m.w, 1, f('#7A7672')); } R(X + 2, Y + 1, 1, m.h - 2, f(shade(m.c, 1.15))); break;
    case 'steamer': R(X, Y + 2, m.w, m.h - 2, shade(c, .7)); R(X + 1, Y + 3, m.w - 2, m.h - 4, c); R(X + 2, Y, m.w - 4, 3, c); for (const xx of [X + 6, X + m.w - 8]) { R(xx, Y, 2, m.h, f('#4A4644')); R(xx, Y, 1, m.h, f('#7A7672')); } R(X + (m.w >> 1) - 2, Y + 5, 5, 5, f('#B8954A')); R(X + (m.w >> 1) - 1, Y + 7, 2, 2, f('#3A2E1E')); R(X + 1, Y + 3, m.w - 2, 1, f(shade(m.c, 1.18))); break;
    case 'head': R(X, Y, m.w, m.h, shade(c, .66)); R(X + 1, Y + 1, m.w - 2, m.h - 2, c); R(X + 1, Y + 1, m.w - 2, 1, f(shade(m.c, 1.2))); for (const xx of [X + 3, X + m.w - 5]) R(xx, Y, 2, m.h, f('#4A4644')); R(X + 3, Y + 4, 6, 3, f('#1A1210')); R(X + m.w - 9, Y + 4, 6, 3, f('#1A1210')); R(X + 2, Y + 10, m.w - 4, 3, f('#1A1210')); for (let i = X + 3; i < X + m.w - 3; i += 2) { R(i, Y + 10, 1, 1, f('#C8BBA0')); R(i + 1, Y + 12, 1, 1, f('#C8BBA0')); } R(X + 1, Y + 9, m.w - 2, 1, f('#4A4644')); break;
    case 'rug': R(X, Y, m.w, m.h, c); for (let i = 1; i < m.h; i += 3) R(X, Y + i, m.w, 1, f('#C9A24A')); R(X, Y + m.h - 2, m.w, 2, f(shade(m.c, .7))); R(X + 1, Y, 1, m.h, f(shade(m.c, 1.18))); break;
    case 'legs': R(X, Y, 2, m.h, c); R(X + m.w - 2, Y + 2, 2, m.h - 2, c); R(X, Y + 5, m.w, 2, f(shade(m.c, 1.15))); R(X, Y + m.h - 6, m.w, 2, f(shade(m.c, 1.15))); break;
    case 'chestbox': R(X, Y, m.w, m.h, shade(c, .7)); R(X + 1, Y + 1, m.w - 2, m.h - 2, c); R(X, Y + 4, m.w, 1, f('#C9A24A')); for (const [px, py] of [[0, 0], [m.w - 2, 0], [0, m.h - 2], [m.w - 2, m.h - 2]]) R(X + px, Y + py, 2, 2, f('#C9A24A')); break;
    case 'chain': for (let i = 0; i < 44; i++) R(X + i, Y + Math.round(i * .62), 1, 1, f(i % 3 ? '#9A948E' : '#5C5854')); for (let i = 0; i < 36; i++) R(X + 4 + i, Y + 26 - Math.round(i * .5), 1, 1, f(i % 3 ? '#9A948E' : '#5C5854')); break;
    case 'drape': for (let i = 0; i < m.w; i++) { const hh = 4 + Math.round(Math.abs(Math.sin(i / 5)) * (m.h - 4)) - (i > 12 && i < m.w - 12 ? 4 : 0); R(X + i, Y, 1, Math.max(2, hh), i % 4 === 0 ? f(shade(m.c, .8)) : c); } break;
    case 'shade': for (let i = 0; i < m.h; i++) { const w = m.w - (m.h - 1 - i); R(X + ((m.w - w) >> 1), Y + i, w, 1, i % 3 === 0 ? f(shade(m.c, .85)) : c); } for (let i = 0; i < m.w; i += 2) R(X + i, Y + m.h, 1, 2, f('#8A6A48')); break;
    case 'frames': [[0, 2, 11, 14, '#B8954A', '#3A4A5A'], [22, -2, 12, 12, '#9A7A3A', '#5A3A3A'], [44, 3, 12, 13, '#B8954A', '#3A5A4A']].forEach(([dx, dy, w, h, fc, ic]) => { R(X + dx, Y + dy, w, h, f(fc)); R(X + dx + 1, Y + dy + 1, w - 2, h - 2, f(ic)); }); break;
    case 'candles': for (const dx of [2, 6, 62, 66]) { R(X + dx, Y, 2, m.h, f('#D8CBB0')); } break;
  }
}
function ward6(cx, cy, rx, ry, t, crackA) {
  g.globalAlpha = .08; for (let dy = -ry; dy <= ry; dy++) { const yy = cy + dy; if (yy >= FY) continue; const dx = Math.round(rx * Math.sqrt(1 - (dy * dy) / (ry * ry))); R(cx - dx, yy, dx * 2, 1, '#7FA8FF'); } g.globalAlpha = 1;
  for (let a = 0; a < 170; a++) { const an = a / 170 * Math.PI * 2, px = Math.round(cx + Math.cos(an) * rx), py = Math.round(cy + Math.sin(an) * ry); if (py >= FY) continue; if (REDUCED ? a % 3 === 0 : ((a + Math.floor(t / 70)) % 7) < 3) { g.globalAlpha = .7; R(px, py, 1, 1, '#A9C6FF'); } }
  g.globalAlpha = 1;
  for (let k = 0; k < 8; k++) { const an = (REDUCED ? 0 : t / 2400) + k * Math.PI / 4, px = Math.round(cx + Math.cos(an) * (rx + 2)), py = Math.round(FY - 2 + Math.sin(an) * 4); R(px - 1, py, 3, 1, '#CFE0FF'); R(px, py - 1, 1, 1, '#CFE0FF'); }
  for (let k = 0; k < 3; k++) { const an = REDUCED ? k * 2.1 : t / 1300 + k * 2.1, px = Math.round(cx + Math.cos(an) * rx), py = Math.round(cy + Math.sin(an) * ry * .95); if (py < FY - 2) { R(px - 1, py, 3, 1, '#E8F0FF'); R(px, py - 1, 1, 3, '#E8F0FF'); bloom(px, py, 4, '#7FA8FF', .6); } }
  if (crackA > 0) { const r = rng(17); g.globalAlpha = crackA; for (let c = 0; c < 4; c++) { let an = r() * Math.PI - Math.PI, px = cx + Math.cos(an) * rx * .8, py = cy + Math.sin(an) * ry * .8; for (let k = 0; k < 10; k++) { R(px, py, 1, 1, '#FFFFFF'); px += (r() - .5) * 4; py += (r() - .3) * 3; } } g.globalAlpha = 1; bloom(cx, cy, 20, '#9FC0FF', .4 * crackA); }
}
const wardCrack = t => bossAct.kind === 'wardcrack' && t - bossAct.at < 900 ? 1 - (t - bossAct.at) / 900 : 0;
function mountain(t, opt, pass) {
  const met = met4('chambers'), hp = opt.relive ? 4 : Math.max(1, 4 - met), bx = 124, base = FY, ct = opt.cutT || 0, a = t - bossAct.at, k = bossAct.kind;
  let ox = 0, oy = 0, flash = false, roar = false, squint = false;
  const br = REDUCED ? 0 : Math.round(Math.sin(t / 900));
  if (ct <= 0) {
    if (k === 'flinch' && a < 280) { ox = 2; flash = a < 60; }
    if (k === 'stagger' && a < 650) { flash = a < 140; ox = Math.round(4 * (1 - a / 650)) + (REDUCED ? 0 : Math.round(Math.sin(a / 18) * 2)); roar = a < 520; }
    if (k === 'roar' && a < 1100) { roar = true; oy = a < 300 ? -1 : 0; ox = REDUCED ? 0 : Math.round(Math.sin(a / 25)); }
    if (k === 'recoil' && a < 750) { ox = 3; squint = true; }
    if (k === 'wardcrack' && a < 400) ox = 1;
    if (!REDUCED && !ct) { const c = t % 12000; if (c > 300 && c < 1000) roar = true; }
  } else {
    if (ct > 260 && ct < 700) { ox = REDUCED ? 0 : Math.round(Math.sin(ct / 14) * 3); flash = ct < 400; }
    if (ct >= 700 && ct < 1500) { roar = true; ox = REDUCED ? 0 : Math.round(Math.sin(ct / 20) * 2); }
  }
  const pcs = MTN.filter(m => m.lv <= hp).sort((p, q) => p.z - q.z);
  const fallOrder = pcs.slice().sort((p, q) => p.y - q.y);
  const fallStep = Math.min(230, 2400 / pcs.length), fallOf = m => { if (ct < 1500) return 0; const i = Math.max(0, fallOrder.indexOf(m)); return clamp01((ct - 1500 - i * fallStep) / 650); };
  const rubbleFade = ct > 5000 ? clamp01(1 - (ct - 5000) / 900) : 1;
  if (pass === 'a') {
    pcs.forEach(m => {
      const f = fallOf(m), dir = m.x + m.w / 2 >= 0 ? 1 : -1;
      let X = bx + m.x + ox + Math.round(dir * f * 10), Y = base + m.y + (m.up ? br * m.up : 0) + oy;
      if (f > 0) Y = Math.min(Y + Math.round(f * f * 90), FY - Math.min(m.h, 12) + 2);
      if (ct > 5000) g.globalAlpha = rubbleFade;
      mtnPiece(m, X, Y, flash); g.globalAlpha = 1;
    });
    const sinceHit = !ct && lastHit && lastHit.rg === 'chambers' ? performance.now() - lastHit.at : 1e9;
    if (sinceHit < 1100 && met < 4) MTN.filter(m => m.lv === hp + 1).forEach(m => {
      const f = clamp01(sinceHit / 750), dir = m.x + m.w / 2 >= 0 ? 1 : -1;
      g.globalAlpha = 1 - clamp01((sinceHit - 750) / 350);
      mtnPiece(m, bx + m.x + Math.round(dir * f * 16), Math.min(base + m.y + Math.round(f * f * 80), FY - Math.min(m.h, 12) + 2), sinceHit < 120);
      g.globalAlpha = 1;
    });
    return;
  }
  if (pass === 'dust') {
    if (ct > 1600 && ct < 4600) { const q = (ct - 1600) / 3000; for (let i = 0; i < 22; i++) { const an = i / 22 * Math.PI * 2, rr = 8 + q * 46; g.globalAlpha = .5 * (1 - q); R(bx + Math.cos(an) * rr - 2, base - 10 + Math.sin(an) * rr * .3, 6, 3, '#C8BEB2'); } g.globalAlpha = 1; }
    if (!REDUCED && !ct) { const dd = t % 2600; if (dd < 900) { g.globalAlpha = .7; R(bx - 10 + ((t / 2600 | 0) * 7) % 20, base - 40 + dd / 30, 1, 1, '#B8AFA4'); g.globalAlpha = 1; } }
    return;
  }
  const head = MTN[14], hf = fallOf(head), hy0 = base + head.y + br * 2 + oy, hx = bx + head.x + ox + Math.round(hf * 10), hy = hf > 0 ? Math.min(hy0 + Math.round(hf * hf * 90), FY - 10) : hy0, eyeA = !ct || ct < 2400 ? 1 : clamp01(1 - (ct - 2400) / 1200);
  if (!ct && warded('chambers')) ward6(bx, base - 32, 52, 44, t, k === 'wardcrack' && a < 900 ? 1 - a / 900 : 0);
  const veinK = ct ? (ct < 700 ? .6 : ct < 2000 ? 1 : Math.max(0, 1 - (ct - 2000) / 800)) : (roar ? .9 : .35 + .2 * (REDUCED ? 0 : Math.sin(t / 420)));
  if (veinK > 0 && !(ct > 1500)) {
    g.globalAlpha = veinK;
    for (let x = bx - 20; x < bx + 20; x += 2) R(x + ox, base - 33 + br + oy + ((x >> 2) % 2), 1, 1, '#FF8A3D');
    for (let y = base - 49; y < base - 34; y += 2) { R(bx - 6 + ox, y + br, 1, 1, '#FF8A3D'); R(bx + 8 + ox, y + br + 1, 1, 1, '#FF8A3D'); }
    for (let x = bx - 11; x < bx + 11; x += 2) R(x + ox, base - 51 + br * 2 + oy, 1, 1, '#FFB347');
    if (ct > 700) { const r = rng(9), n = Math.floor(clamp01((ct - 700) / 800) * 12); for (let c = 0; c < n; c++) { let px = bx - 20 + r() * 40, py = base - 50 + r() * 34; for (let s = 0; s < 6; s++) { R(px + ox, py, 1, 1, '#FFC27A'); px += (r() - .5) * 4; py += r() * 2; } } }
    g.globalAlpha = 1; bloom(bx + ox, base - 40, 14, '#FF8A3D', .35 * veinK);
  }
  if (eyeA > 0 && !(t % 4300 < 140 && !REDUCED && !roar && !ct)) { const ec = flash ? '#FFFFFF' : roar ? '#FFE0A0' : '#FFB347', h = squint ? 1 : 2; g.globalAlpha = eyeA; R(hx + 4, hy + 5, 4, h, ec); R(hx + head.w - 8, hy + 5, 4, h, ec); g.globalAlpha = 1; bloom(hx + 6, hy + 5, roar ? 6 : 4, '#FF8A3D', .8 * eyeA); bloom(hx + head.w - 6, hy + 5, roar ? 6 : 4, '#FF8A3D', .8 * eyeA); }
  if (roar && !(ct > 1500)) { R(hx + 3, hy + 11, head.w - 6, 1, '#FF8A3D'); bloom(hx + head.w / 2, hy + 11, 8, '#FF8A3D', .7); }
  if (hp >= 4 && ct <= 0) { const m = MTN[16]; for (const dx of [2, 6, 62, 66]) flame5(bx + m.x + dx + 1 + ox, base + m.y + br, t, 2, dx); }
}
/* ================= shared boss motion and junk-part bosses ================= */
function bossMotion(t, ct) {
  const a = t - bossAct.at, k = bossAct.kind; let ox = 0, oy = 0, flash = false, roar = false, squint = false;
  if (ct <= 0) {
    if (k === 'flinch' && a < 280) { ox = 2; flash = a < 60; }
    if (k === 'stagger' && a < 650) { flash = a < 140; ox = Math.round(4 * (1 - a / 650)) + (REDUCED ? 0 : Math.round(Math.sin(a / 18) * 2)); roar = a < 520; }
    if (k === 'roar' && a < 1100) { roar = true; oy = a < 300 ? -1 : 0; ox = REDUCED ? 0 : Math.round(Math.sin(a / 25)); }
    if (k === 'recoil' && a < 750) { ox = 3; squint = true; }
    if (!REDUCED && !ct) { const c = t % 12000; if (c > 300 && c < 1000) roar = true; }
  } else {
    if (ct > 260 && ct < 700) { ox = REDUCED ? 0 : Math.round(Math.sin(ct / 14) * 3); flash = ct < 400; }
    if (ct >= 700 && ct < 1500) { roar = true; ox = REDUCED ? 0 : Math.round(Math.sin(ct / 20) * 2); }
  }
  return { ox, oy, flash, roar, squint };
}
function partState(B, t, opt) {
  const ct = opt.cutT || 0, met = B.met(), hp = opt.relive ? 4 : Math.max(1, 4 - met), br = REDUCED ? 0 : Math.round(Math.sin(t / 900)), mo = bossMotion(t, ct);
  const pcs = B.parts.filter(m => m.lv <= hp).sort((p, q) => p.z - q.z), order = pcs.slice().sort((p, q) => p.y - q.y), step = Math.min(230, 2400 / pcs.length);
  const land = m => B.base - Math.min(m.h, 12) + 2;
  const posOf = m => {
    const f = ct < 1500 ? 0 : clamp01((ct - 1500 - Math.max(0, order.indexOf(m)) * step) / 650), dir = m.x + m.w / 2 >= 0 ? 1 : -1;
    let X = B.x + m.x + mo.ox + Math.round(dir * f * 10), Y = B.base + m.y + (m.up ? br * m.up : 0) + mo.oy;
    if (f > 0) Y = Math.min(Y + Math.round(f * f * 90), land(m));
    return [X, Y, f];
  };
  return { ct, met, hp, mo, pcs, land, posOf, fade: ct > 5000 ? clamp01(1 - (ct - 5000) / 900) : 1, eyeA: ct <= 0 || ct < 2400 ? 1 : clamp01(1 - (ct - 2400) / 1200) };
}
function partDraw(B, P, opt) {
  P.pcs.forEach(m => { const [X, Y] = P.posOf(m); if (P.ct > 5000) g.globalAlpha = P.fade; B.piece(m, X, Y, P.mo.flash); g.globalAlpha = 1; });
  const sinceHit = P.ct <= 0 && !opt.relive && lastHit && lastHit.rg === B.rg ? performance.now() - lastHit.at : 1e9;
  if (sinceHit < 1100 && P.met < 4) B.parts.filter(m => m.lv === P.hp + 1).forEach(m => {
    const f = clamp01(sinceHit / 750), dir = m.x + m.w / 2 >= 0 ? 1 : -1;
    g.globalAlpha = 1 - clamp01((sinceHit - 750) / 350);
    B.piece(m, B.x + m.x + Math.round(dir * f * 16), Math.min(B.base + m.y + Math.round(f * f * 80), P.land(m)), sinceHit < 120);
    g.globalAlpha = 1;
  });
}
function partDust(B, P) {
  if (P.ct > 1600 && P.ct < 4600) { const q = (P.ct - 1600) / 3000; for (let i = 0; i < 22; i++) { const an = i / 22 * Math.PI * 2, rr = 8 + q * 46; g.globalAlpha = .5 * (1 - q); R(B.x + Math.cos(an) * rr - 2, B.base - 10 + Math.sin(an) * rr * .3, 6, 3, '#C8BEB2'); } g.globalAlpha = 1; }
}
function zzz(x, y, t, period) {
  if (REDUCED) return;
  const c = t % period; if (c > 2400) return;
  const k = c / 2400, zx = x + Math.round(k * 8), zy = y - Math.round(k * 12);
  g.globalAlpha = Math.sin(k * Math.PI) * .85; R(zx, zy, 3, 1, '#E7DCC6'); R(zx + 1, zy + 1, 1, 1, '#E7DCC6'); R(zx, zy + 2, 3, 1, '#E7DCC6'); g.globalAlpha = 1;
}

/* The Buried Table (Threshold): an oak table creature heaped with everyday clutter, drawer-pull eyes */
const TABLE = [
  { lv: 1, k: 'backlegs', x: -22, y: -13, w: 44, h: 13, z: 0 },
  { lv: 1, k: 'leg', x: -29, y: -13, w: 7, h: 13, c: '#6A4A30', z: 3 },
  { lv: 1, k: 'leg', x: 22, y: -13, w: 7, h: 13, c: '#6A4A30', z: 3 },
  { lv: 1, k: 'apron', x: -29, y: -22, w: 58, h: 10, c: '#7A5434', z: 2 },
  { lv: 1, k: 'slab', x: -33, y: -26, w: 66, h: 5, c: '#8E6844', z: 4 },
  { lv: 1, k: 'papers', x: -30, y: -31, w: 58, h: 5, z: 5, up: 1 },
  { lv: 2, k: 'box', x: -26, y: -42, w: 18, h: 11, c: '#A8824E', z: 6, up: 1 },
  { lv: 2, k: 'plates', x: -6, y: -38, w: 14, h: 7, z: 6, up: 1 },
  { lv: 2, k: 'bag', x: 11, y: -41, w: 13, h: 10, c: '#8A3A30', z: 6, up: 1 },
  { lv: 3, k: 'coat', x: -38, y: -48, w: 76, h: 36, c: '#4A5A6E', z: 7, up: 1 },
  { lv: 3, k: 'boots', x: 3, y: -54, w: 12, h: 7, z: 8, up: 1 },
  { lv: 4, k: 'lamp', x: -17, y: -72, w: 13, h: 24, z: 9, up: 2 },
  { lv: 4, k: 'pizza', x: 12, y: -57, w: 17, h: 4, c: '#C8A060', z: 9, up: 1 },
  { lv: 4, k: 'keys', x: 25, y: -50, w: 5, h: 8, z: 10, up: 1 }
];
function tablePiece(m, X, Y, flash, tamed) {
  const f = v => flash ? '#FFFFFF' : v, c = flash ? '#FFFFFF' : m.c;
  switch (m.k) {
    case 'backlegs': R(X + 3, Y, 4, m.h, f('#4A3220')); R(X + m.w - 7, Y, 4, m.h, f('#4A3220')); R(X + 3, Y + 4, m.w - 6, 2, f('#3A2618')); break;
    case 'leg': R(X, Y, m.w, m.h - 3, c); R(X + 1, Y, 1, m.h - 3, f(shade(m.c, 1.25))); R(X, Y + 3, m.w, 1, f(shade(m.c, .7))); R(X + 1, Y + 6, m.w - 2, 1, f(shade(m.c, .8))); R(X - 1, Y + m.h - 3, m.w + 2, 3, f('#6C6864')); R(X - 2, Y + m.h - 1, 2, 1, f('#6C6864')); R(X + m.w, Y + m.h - 1, 2, 1, f('#6C6864')); break;
    case 'apron':
      R(X, Y, m.w, m.h, f(shade(m.c, .72))); R(X + 1, Y + 1, m.w - 2, m.h - 2, c); R(X + 1, Y + 1, m.w - 2, 1, f(shade(m.c, 1.18)));
      for (const dx of [6, m.w - 20]) {
        R(X + dx, Y + 2, 14, 4, f(shade(m.c, .84))); R(X + dx, Y + 2, 14, 1, f(shade(m.c, 1.12))); R(X + dx + 5, Y + 3, 4, 2, f(tamed ? '#8A6A3A' : '#B8954A'));
        if (tamed) { R(X + dx + 4, Y + 4, 6, 1, f('#2A1A10')); R(X + dx + 4, Y + 3, 1, 1, f('#2A1A10')); R(X + dx + 9, Y + 3, 1, 1, f('#2A1A10')); }
      }
      if (tamed) { R(X + (m.w >> 1) - 4, Y + 7, 8, 1, f('#3A2618')); R(X + (m.w >> 1) - 5, Y + 6, 1, 1, f('#3A2618')); R(X + (m.w >> 1) + 4, Y + 6, 1, 1, f('#3A2618')); }
      else { R(X + 3, Y + 7, m.w - 6, 2, f('#160E0A')); for (let i = X + 4; i < X + m.w - 4; i += 3) { R(i, Y + 7, 1, 1, f('#E0D4BA')); R(i + 1, Y + 8, 1, 1, f('#E0D4BA')); } }
      break;
    case 'slab': R(X, Y, m.w, m.h, f(shade(m.c, .76))); R(X, Y, m.w, 2, c); R(X, Y, m.w, 1, f(shade(m.c, 1.22))); R(X + 2, Y + 3, m.w - 4, 1, f(shade(m.c, .62))); break;
    case 'papers': for (let i = 0; i < 7; i++) { const px = X + i * 8 + ((i * 3) % 4), py = Y + ((i * 5) % 3); R(px, py, 9, 3, f(i % 3 ? '#E8E0D0' : '#D8CBB0')); R(px + 1, py + 1, 6, 1, f('#9A9288')); } break;
    case 'box': R(X, Y, m.w, m.h, f(shade(m.c, .74))); R(X + 1, Y + 1, m.w - 2, m.h - 2, c); R(X + 1, Y + 1, m.w - 2, 1, f(shade(m.c, 1.2))); R(X + (m.w >> 1) - 1, Y, 3, m.h, f('#D8C890')); R(X + 2, Y + 5, 5, 1, f('#3A2E22')); R(X + 2, Y + 7, 4, 1, f('#3A2E22')); break;
    case 'plates': for (let i = 0; i < 4; i++) R(X + (i % 2), Y + i * 2, m.w - 1, 2, f(i % 2 ? '#C8D2DC' : '#EEF2F6')); R(X + 2, Y + 1, m.w - 5, 1, f('#6F8FB8')); R(X + 3, Y + 5, m.w - 6, 1, f('#6F8FB8')); break;
    case 'bag': R(X, Y + 3, m.w, m.h - 3, c); R(X + 1, Y + 4, 1, m.h - 5, f(shade(m.c, 1.25))); R(X + 3, Y, 1, 4, f('#3A2E22')); R(X + m.w - 4, Y, 1, 4, f('#3A2E22')); R(X + 3, Y, m.w - 6, 1, f('#3A2E22')); R(X + 3, Y + 5, m.w - 6, 2, f('#E8E0D0')); break;
    case 'coat': {
      const cx = X + (m.w >> 1);
      for (let i = 0; i < 8; i++) { const w = 26 + i * 4; R(cx - (w >> 1), Y + i, w, 1, i % 4 === 3 ? f(shade(m.c, .8)) : c); }
      R(cx - 5, Y - 2, 10, 3, f(shade(m.c, .66))); R(cx - 1, Y + 1, 2, 7, f(shade(m.c, .7)));
      for (let i = 0; i < 3; i++) R(cx - 4, Y + 2 + i * 2, 1, 1, f('#C9A24A'));
      for (const sx of [X, X + m.w - 7]) {
        R(sx, Y + 6, 7, m.h - 11, c); R(sx + 1, Y + 6, 1, m.h - 11, f(shade(m.c, 1.2))); R(sx + 5, Y + 6, 1, m.h - 11, f(shade(m.c, .72)));
        R(sx - 1, Y + m.h - 6, 9, 2, f(shade(m.c, .7))); R(sx, Y + m.h - 4, 7, 3, f('#2E2A2C')); R(sx + (sx === X ? -1 : 6), Y + m.h - 2, 2, 2, f('#2E2A2C')); R(sx + 2, Y + m.h - 1, 1, 1, f('#2E2A2C')); R(sx + 4, Y + m.h - 1, 1, 1, f('#2E2A2C'));
      }
      break;
    }
    case 'boots': R(X, Y + 1, 5, 5, f('#3A2A20')); R(X + 6, Y, 5, 6, f('#4A3628')); R(X - 1, Y + 6, 7, 1, f('#22180F')); R(X + 5, Y + 6, 7, 1, f('#22180F')); R(X + 1, Y + 1, 1, 4, f('#5A4430')); R(X + 7, Y, 1, 5, f('#6A5038')); break;
    case 'lamp': R(X + 6, Y + 8, 1, m.h - 8, f('#8A8278')); R(X + 4, Y + m.h - 1, 5, 1, f('#6C6864')); for (let i = 0; i < 8; i++) { const w = 6 + i; R(X + 3 - (i >> 1) + (i >> 2), Y + i, w, 1, i % 3 === 0 ? f('#B89A6A') : f('#D8C090')); } R(X + 5, Y + 8, 3, 2, f('#F0E8C0')); break;
    case 'pizza': R(X, Y, m.w, m.h, c); R(X, Y, m.w, 1, f(shade(m.c, 1.18))); R(X + 3, Y + 1, 7, 2, f('#9A3E30')); R(X + 11, Y + 1, 3, 2, f('#5E7048')); break;
    case 'keys': R(X + 1, Y, 3, 3, f('#C9A24A')); R(X + 2, Y + 1, 1, 1, f('#3A2E22')); R(X + 2, Y + 3, 1, 5, f('#D8BC6A')); R(X + 3, Y + 6, 2, 1, f('#D8BC6A')); R(X + 3, Y + 4, 1, 1, f('#D8BC6A')); break;
  }
}
const B_TABLE = { rg: 'threshold', x: 104, base: FY + 6, parts: TABLE, piece: (m, X, Y, fl) => tablePiece(m, X, Y, fl, false), met: () => met4('threshold') };
function buriedTable(t, opt, pass) {
  const P = partState(B_TABLE, t, opt);
  if (pass === 'a') { partDraw(B_TABLE, P, opt); return; }
  if (pass === 'dust') { partDust(B_TABLE, P); return; }
  const ap = TABLE[3], [X, Y] = P.posOf(ap), mo = P.mo, ct = P.ct;
  if (ct <= 0 && warded('threshold')) ward6(104, FY - 18, 50, 36, t, wardCrack(t));
  if (P.eyeA > 0 && !(t % 4600 < 140 && !REDUCED && !mo.roar && !ct)) {
    const ec = mo.flash ? '#FFFFFF' : mo.roar ? '#FFE0A0' : '#FFB347', h = mo.squint ? 1 : 2;
    g.globalAlpha = P.eyeA; for (const dx of [6, ap.w - 20]) R(X + dx + 5, Y + 3, 4, h, ec); g.globalAlpha = 1;
    for (const dx of [6, ap.w - 20]) bloom(X + dx + 7, Y + 4, mo.roar ? 6 : 4, '#FF8A3D', .8 * P.eyeA);
  }
  if (mo.roar && ct < 1500) { R(X + 4, Y + 7, ap.w - 8, 1, '#FF8A3D'); bloom(X + (ap.w >> 1), Y + 8, 10, '#FF8A3D', .7); }
  if (P.hp >= 4 && ct < 1500) { const [lx, ly] = P.posOf(TABLE[11]); R(lx + 5, ly + 8, 3, 2, '#FFF4D0'); bloom(lx + 6, ly + 9, 7, '#FFD27A', .75 * flick(t, 4)); }
}
function tableTamed(t, pass) {
  const bx = 104, base = FY + 10, top = base - 26;
  if (pass === 'a') {
    [TABLE[0], TABLE[3], TABLE[1], TABLE[2], TABLE[4]].forEach(m => tablePiece(m, bx + m.x, base + m.y, false, true));
    R(bx - 23, top - 8, 2, 6, '#E8E0CC'); R(bx - 24, top - 2, 4, 2, '#B8954A');
    R(bx - 5, top - 3, 13, 3, '#9A6A44'); R(bx - 4, top, 11, 1, '#7A4E30'); R(bx - 3, top - 6, 3, 3, '#B8483A'); R(bx, top - 5, 3, 3, '#8AA34A'); R(bx + 3, top - 6, 3, 3, '#D8A040');
    R(bx + 15, top - 8, 4, 7, '#4A6A9A'); R(bx + 16, top - 7, 1, 5, '#6A8ABA'); R(bx + 16, top - 12, 1, 4, '#5E7E46'); R(bx + 15, top - 14, 3, 2, '#E0A0B0');
    return;
  }
  flame5(bx - 22, top - 9, t, 2, 7);
  zzz(bx + 4, base - 24, t, 5200);
}

/* The Closet That Would Not Close (Armory): a wardrobe bursting with clothes, sleeves for arms, a drawer for a jaw */
const CLOSET = [
  { lv: 4, k: 'hangers', x: -16, y: -84, w: 32, h: 18, z: 0, up: 1 },
  { lv: 1, k: 'cabinet', x: -21, y: -66, w: 42, h: 60, c: '#5A3E2A', z: 1 },
  { lv: 1, k: 'plinth', x: -23, y: -7, w: 46, h: 7, c: '#4A3220', z: 2 },
  { lv: 1, k: 'doorL', x: -36, y: -62, w: 15, h: 50, c: '#6A4A30', z: 3 },
  { lv: 2, k: 'doorR', x: 21, y: -60, w: 13, h: 46, c: '#6A4A30', z: 3 },
  { lv: 1, k: 'jaw', x: -18, y: -18, w: 36, h: 9, c: '#6E4C32', z: 4 },
  { lv: 2, k: 'sleeve', x: -45, y: -52, w: 9, h: 52, c: '#6E4E80', z: 5 },
  { lv: 3, k: 'sleeve', x: 36, y: -50, w: 9, h: 50, c: '#3E5A88', z: 5 },
  { lv: 2, k: 'tie', x: -2, y: -11, w: 5, h: 12, c: '#9A3E30', z: 6 },
  { lv: 3, k: 'scarf', x: -24, y: -70, w: 18, h: 13, c: '#C9A24A', z: 7, up: 1 },
  { lv: 4, k: 'hat', x: 5, y: -76, w: 13, h: 8, c: '#3A3440', z: 8, up: 1 }
];
function closetPiece(m, X, Y, flash, tamed) {
  const f = v => flash ? '#FFFFFF' : v, c = flash ? '#FFFFFF' : m.c;
  switch (m.k) {
    case 'hangers':
      for (const [dx, h, lean] of [[2, 14, -1], [10, 18, 0], [19, 16, 1], [27, 13, 1]]) {
        const hx = X + dx, tx = hx + Math.round(lean * h / 5), ty = Y + m.h - h;
        for (let i = 0; i < h - 4; i++) R(hx + Math.round(lean * i / 5), Y + m.h - i, 1, 1, f('#A8ACB4'));
        R(tx - 3, ty + 4, 7, 1, f('#C8CCD4')); R(tx - 2, ty + 3, 1, 1, f('#C8CCD4')); R(tx + 2, ty + 3, 1, 1, f('#C8CCD4')); R(tx - 1, ty + 2, 1, 1, f('#C8CCD4')); R(tx + 1, ty + 2, 1, 1, f('#C8CCD4')); R(tx, ty, 1, 2, f('#E0E4EC')); R(tx + 1, ty - 1, 1, 1, f('#E0E4EC'));
      }
      break;
    case 'cabinet': {
      R(X - 2, Y - 3, m.w + 4, 3, f('#4A3220')); R(X - 2, Y - 3, m.w + 4, 1, f('#8A6440')); R(X + 4, Y - 5, m.w - 8, 2, f('#4A3220'));
      R(X, Y, m.w, m.h, f(shade(m.c, .72))); R(X + 1, Y + 1, m.w - 2, m.h - 2, c); R(X + 1, Y + 1, 1, m.h - 2, f(shade(m.c, 1.2)));
      if (tamed) {
        const pw = (m.w >> 1) - 4;
        for (const dx of [3, (m.w >> 1) + 1]) {
          R(X + dx, Y + 4, pw, m.h - 16, f(shade(m.c, 1.12))); R(X + dx + 2, Y + 7, pw - 4, 13, f(shade(m.c, .86))); R(X + dx + 2, Y + 24, pw - 4, 16, f(shade(m.c, .86)));
          R(X + dx + 3, Y + 14, pw - 6, 1, f('#2A1A10')); R(X + dx + 3, Y + 13, 1, 1, f('#2A1A10')); R(X + dx + pw - 4, Y + 13, 1, 1, f('#2A1A10'));
        }
        R(X + (m.w >> 1) - 1, Y + 4, 2, m.h - 16, f(shade(m.c, .6))); R(X + (m.w >> 1) - 2, Y + 27, 4, 4, f('#C9A24A')); R(X + (m.w >> 1) - 1, Y + 28, 2, 2, f('#5A4020'));
        R(X + 3, Y + m.h - 11, m.w - 6, 7, f(shade(m.c, 1.05))); R(X + (m.w >> 1) - 3, Y + m.h - 8, 6, 2, f('#C9A24A'));
      } else {
        R(X + 4, Y + 4, m.w - 8, m.h - 16, f('#140C0A')); R(X + 4, Y + 7, m.w - 8, 1, f('#6A6460'));
        const cols = ['#6E4E80', '#9A3E30', '#4E5E80', '#5E6E4E', '#7E6E5E', '#3E4E6E', '#A8483A', '#C9A24A'];
        for (let i = 0; i < 8; i++) { if (i === 3 || i === 4) continue; const cx = X + 5 + i * 4, hh = 20 + ((i * 7) % 11); R(cx, Y + 8, 3, hh, f(cols[i])); R(cx, Y + 8, 1, hh, f(shade(cols[i], 1.22))); R(cx + 1, Y + 7, 1, 1, f('#A8ACB4')); }
        for (let i = 0; i < 9; i++) R(X + 5 + i * 4, Y + m.h - 13, 2, 3 + (i % 2) * 2, f(i % 3 === 1 ? '#C8BBA0' : '#E0D4BA'));
      }
      break;
    }
    case 'plinth': R(X, Y, m.w, m.h - 2, c); R(X, Y, m.w, 1, f(shade(m.c, 1.25))); R(X + 2, Y + m.h - 2, 5, 2, f('#2A1E14')); R(X + m.w - 7, Y + m.h - 2, 5, 2, f('#2A1E14')); break;
    case 'doorL':
      for (let xx = 0; xx < m.w; xx++) { const inset = Math.round((m.w - 1 - xx) * .22); R(X + xx, Y + inset, 1, m.h - inset * 2, xx === 0 ? f(shade(m.c, .62)) : xx < 3 ? f(shade(m.c, 1.18)) : c); }
      R(X + 4, Y + 9, m.w - 7, 12, f(shade(m.c, .84))); R(X + 4, Y + 26, m.w - 7, 15, f(shade(m.c, .84))); R(X + 2, Y + 23, 2, 3, f('#C9A24A'));
      R(X + 5, Y + 41, 3, 8, f('#E0D4BA')); R(X + 5, Y + 47, 5, 2, f('#E0D4BA'));
      break;
    case 'doorR':
      for (let i = 0; i < m.h; i++) { const sh = Math.round(i / 8); R(X + sh, Y + i, m.w, 1, i % 12 === 0 ? f(shade(m.c, .82)) : c); R(X + sh + m.w - 1, Y + i, 1, 1, f(shade(m.c, .66))); }
      R(X + 3, Y + 8, m.w - 6, 11, f(shade(m.c, .84))); R(X + 5, Y + 24, m.w - 6, 13, f(shade(m.c, .84))); R(X, Y + 2, 2, 3, f('#9A948E'));
      break;
    case 'jaw':
      R(X, Y, m.w, m.h, f(shade(m.c, .72))); R(X + 1, Y + 1, m.w - 2, m.h - 2, c); R(X + 1, Y + 1, m.w - 2, 1, f(shade(m.c, 1.2))); R(X + (m.w >> 1) - 3, Y + 4, 6, 2, f('#C9A24A'));
      for (let i = 0; i < 9; i++) R(X + 2 + i * 4, Y - 3 - (i % 2), 3, 4 + (i % 2), f(['#E8E0D0', '#D8CBB0', '#A8483A', '#E8E0D0', '#6F8FB8'][i % 5]));
      break;
    case 'sleeve': {
      const outw = m.x < 0 ? -1 : 1;
      for (let i = 0; i < m.h - 5; i++) { const sx = X + Math.round(Math.sin(i / (m.h - 5) * Math.PI) * 3 * outw); R(sx, Y + i, m.w - 2, 1, i % 6 === 5 ? f(shade(m.c, .8)) : c); R(sx + (outw < 0 ? 0 : m.w - 3), Y + i, 1, 1, f(shade(m.c, .7))); }
      R(X - 1, Y + m.h - 7, m.w, 2, f(shade(m.c, .7))); R(X, Y + m.h - 5, m.w - 2, 4, f('#2E2A2C')); R(X + (outw < 0 ? -2 : m.w - 2), Y + m.h - 3, 2, 3, f('#2E2A2C')); R(X + 2, Y + m.h - 1, 1, 1, f('#2E2A2C')); R(X + 4, Y + m.h - 1, 1, 1, f('#2E2A2C'));
      break;
    }
    case 'tie': for (let i = 0; i < m.h; i++) { const w = i > m.h - 4 ? Math.max(1, 5 - (i - (m.h - 4)) * 2) : 3; R(X + ((m.w - w) >> 1), Y + i, w, 1, c); } R(X + 2, Y + 2, 1, m.h - 5, f(shade(m.c, 1.25))); break;
    case 'scarf': for (let i = 0; i < m.h; i++) R(X + Math.max(0, i - 5), Y + i, Math.max(3, Math.round(m.w - i * 1.2)), 1, i % 3 === 0 ? f(shade(m.c, .82)) : c); for (let i = 0; i < 4; i++) R(X + i * 2, Y + m.h, 1, 3, c); break;
    case 'hat': R(X + 2, Y, m.w - 4, 6, c); R(X, Y + 6, m.w, 2, c); R(X + 2, Y + 4, m.w - 4, 1, f('#6E4E80')); R(X + 3, Y + 1, 1, 3, f(shade(m.c, 1.3))); break;
  }
}
const B_CLOSET = { rg: 'armory', x: 100, base: FY, parts: CLOSET, piece: (m, X, Y, fl) => closetPiece(m, X, Y, fl, false), met: () => met4('armory') };
function closetBoss(t, opt, pass) {
  const P = partState(B_CLOSET, t, opt);
  if (pass === 'a') { partDraw(B_CLOSET, P, opt); return; }
  if (pass === 'dust') { partDust(B_CLOSET, P); return; }
  const cab = CLOSET[1], [X, Y] = P.posOf(cab), mo = P.mo, ct = P.ct;
  if (ct <= 0 && warded('armory')) ward6(100, FY - 40, 42, 50, t, wardCrack(t));
  if (P.eyeA > 0 && !(t % 5000 < 150 && !REDUCED && !mo.roar && !ct)) {
    const ec = mo.flash ? '#FFFFFF' : mo.roar ? '#FFF4FF' : '#EAD0FF', h = mo.squint ? 1 : 2;
    g.globalAlpha = P.eyeA; R(X + 18, Y + 18, 2, h, ec); R(X + 22, Y + 18, 2, h, ec); g.globalAlpha = 1;
    bloom(X + 19, Y + 19, mo.roar ? 6 : 4, '#B07AE8', .85 * P.eyeA); bloom(X + 23, Y + 19, mo.roar ? 6 : 4, '#B07AE8', .85 * P.eyeA);
  }
  if (mo.roar && ct < 1500) { const [jx, jy] = P.posOf(CLOSET[5]); R(jx + 2, jy - 1, CLOSET[5].w - 4, 1, '#C890F8'); bloom(jx + 18, jy, 10, '#B07AE8', .6); }
  if (P.hp >= 4 && ct < 1500 && !REDUCED) { const [hx, hy] = P.posOf(CLOSET[0]), sx = hx + [2, 10, 19, 27][Math.floor(t / 260) % 4] + 1; R(sx, hy + 4, 1, 1, '#FFFFFF'); bloom(sx, hy + 4, 2, '#DDE4F0', .6); }
}
function closetTamed(t, pass) {
  const bx = 100, base = FY;
  if (pass === 'a') {
    [CLOSET[1], CLOSET[2]].forEach(m => closetPiece(m, bx + m.x, base + m.y, false, true));
    R(bx - 14, base - 72, 28, 4, '#8A3A30'); R(bx - 14, base - 72, 28, 1, '#A8483A'); R(bx - 12, base - 75, 24, 3, '#3E5A88'); R(bx - 12, base - 75, 24, 1, '#5E7AA8');
    return;
  }
  zzz(bx + 6, base - 56, t, 6000);
}

/* Make Room for the Past (Reliquary): a veiled mourner in a porcelain mask, holding a shroud over the keepsakes */
function wraith(t, opt, pass) {
  const ct = opt.cutT || 0, met = met4('reliquary'), hp = opt.relive ? 4 : Math.max(1, 4 - met), cx = 96, mo = bossMotion(t, ct);
  const flare = mo.roar || (ct <= 0 && bossAct.kind === 'stagger' && t - bossAct.at < 650), flash = mo.flash, ox = mo.ox;
  const bob = REDUCED ? 0 : Math.round(Math.sin(t / 1100) * 2), rise = ct > 1500 ? Math.min(1, (ct - 1500) / 2600) * 100 : 0, fade = ct > 1500 ? 1 - Math.min(1, (ct - 1500) / 2600) : 1;
  const sinceHit = ct <= 0 && !opt.relive && lastHit && lastHit.rg === 'reliquary' ? performance.now() - lastHit.at : 1e9, hpVis = sinceHit < 700 && met < 4 ? hp + 1 - clamp01(sinceHit / 700) : hp;
  const hem = 60 + hpVis * 7 - rise, top = 18 - rise + bob, X = cx + ox, lx = 24, rx = 168, hy = 46 - rise + bob, C = v => flash ? '#FFFFFF' : v;
  if (pass === 'a') {
    if (fade <= 0) return;
    for (let x = lx; x < rx; x++) {
      const sag = Math.round(Math.sin((x - lx) / (rx - lx) * Math.PI) * 7), wave = REDUCED ? 0 : Math.sin(t / 900 + x / 11) * 2, yT = hy + sag, h = hem + wave + ((x * 7) % 5 === 0 ? 3 : 0), hh = Math.max(0, Math.round(h - yT)), solid = Math.max(0, hh - 6), col = C((x + Math.floor(x / 7)) % 9 < 2 ? '#A8A2B6' : '#CEC8D8');
      g.globalAlpha = .9 * fade; R(x + ox, yT, 1, solid, col); g.globalAlpha = .4 * fade; R(x + ox, yT + solid, 1, hh - solid, col);
    }
    for (let i = 0; i < 52; i++) {
      const y = top + 14 + i, w = 12 + Math.floor(i / 2.1), wob = REDUCED ? 0 : Math.round(Math.sin(t / 520 + i / 5) * (i / 26));
      g.globalAlpha = fade * (i < 38 ? 1 : Math.max(0, 1 - (i - 38) / 15));
      R(X - (w >> 1) + wob, y, w, 1, C(i % 7 === 6 ? '#2A2638' : '#3A3450')); R(X - (w >> 1) + wob, y, 1, 1, C('#5E5678')); R(X + (w >> 1) - 1 + wob, y, 1, 1, C('#221E2E'));
    }
    g.globalAlpha = fade * .55;
    for (let k = 0; k < 6; k++) { const sx = X - 14 + k * 5 + (REDUCED ? 0 : Math.round(Math.sin(t / 400 + k))); R(sx, top + 62, 2, 6 + (k * 3) % 5, C('#3A3450')); }
    g.globalAlpha = fade;
    R(X - 1, top + 17, 2, 30, C('#8A82A0'));
    const arm = (x0, y0, x1, y1) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let i = 0; i <= n; i++) { const px = Math.round(x0 + (x1 - x0) * i / n), py = Math.round(y0 + (y1 - y0) * i / n); R(px, py, 2, 3, C('#3A3450')); R(px, py, 2, 1, C('#5E5678')); if (i % 7 === 3 && i < n - 4) R(px, py + 3, 1, 2 + (i % 3), C('#2A2638')); } };
    arm(X - 7, top + 16, lx + 4, hy); arm(X + 6, top + 16, rx - 6, hy);
    const hand = hx => { R(hx, hy - 1, 4, 3, C('#E4DED4')); R(hx, hy + 2, 1, 2, C('#E4DED4')); R(hx + 2, hy + 2, 1, 3, C('#E4DED4')); R(hx + 3, hy + 2, 1, 2, C('#E4DED4')); };
    hand(lx + 1); hand(rx - 6);
    const sw = REDUCED ? 0 : Math.round(Math.sin(t / 700) * 1.4);
    [[-6, 10, 'locket'], [1, 15, 'frame'], [7, 8, 'bear']].forEach(([dx, len, kind]) => {
      const kx = X + dx, ky = top + 32;
      for (let j = 0; j < len; j += 2) R(kx + Math.round(sw * j / len), ky + j, 1, 1, '#9A948E');
      const ex = kx + sw, ey = ky + len;
      if (kind === 'locket') { R(ex - 1, ey, 3, 3, C('#D9B35C')); R(ex, ey + 1, 1, 1, '#8A6A2A'); }
      else if (kind === 'frame') { R(ex - 2, ey, 5, 5, C('#C9A24A')); R(ex - 1, ey + 1, 3, 3, '#3A4A5A'); }
      else { R(ex - 2, ey + 1, 4, 4, C('#8A6040')); R(ex - 2, ey, 1, 1, C('#8A6040')); R(ex + 1, ey, 1, 1, C('#8A6040')); R(ex - 1, ey + 2, 1, 1, '#1A1412'); }
    });
    for (let i = 0; i < 17; i++) { const w = i < 5 ? 8 + i * 2 : 18; R(X - (w >> 1), top + i, w, 1, C(i % 5 === 4 ? '#2E2A3E' : '#3A3450')); }
    R(X - 9, top + 5, 1, 12, C('#5E5678'));
    R(X - 6, top + 4, 12, 11, '#0C0A12');
    R(X - 6, top + 3, 12, 1, C('#E0DAE8')); R(X - 7, top + 4, 1, 10, C('#E0DAE8')); R(X + 6, top + 4, 1, 10, C('#E0DAE8'));
    R(X - 4, top + 5, 8, 9, C('#ECE6DC')); R(X - 3, top + 14, 6, 1, C('#ECE6DC')); R(X - 4, top + 5, 1, 9, C('#C8C2B8'));
    R(X - 3, top + 7, 2, 2, '#16121E'); R(X + 1, top + 7, 2, 2, '#16121E');
    R(X - 1, top + 11, 2, mo.roar ? 3 : 1, '#2A2436');
    R(X + 2, top + 5, 1, 2, '#A8A29A'); R(X + 3, top + 7, 1, 2, '#A8A29A');
    g.globalAlpha = 1; return;
  }
  if (ct <= 0 && warded('reliquary')) ward6(96, 58, 76, 40, t, wardCrack(t));
  if (fade > .2) {
    const blink = !REDUCED && t % 4800 < 150 && ct <= 0;
    if (!blink) {
      const ec = flare ? '#FFFFFF' : '#CFE8FF', eh = flare ? 2 : 1;
      R(X - 3, top + 7, 2, eh, ec); R(X + 1, top + 7, 2, eh, ec);
      bloom(X - 2, top + 8, flare ? 7 : 4, '#9FC0F0', (flare ? .9 : .6) * fade); bloom(X + 2, top + 8, flare ? 7 : 4, '#9FC0F0', (flare ? .9 : .6) * fade);
    }
    bloom(X, top + 30, 18, '#7A86C0', .16 * fade);
  }
  motes5(t, 20, Math.max(0, 40 - rise), 150, 50, ct > 0 ? 44 : 14, 5, '#DCE6F0');
}
function keeper(x, base, t, awake, pass, fade) {
  fade = fade == null ? 1 : fade; if (fade <= 0) return;
  const sway = REDUCED ? 0 : Math.round(Math.sin(t / 900) * 1.5), lsw = REDUCED ? 0 : Math.round(Math.sin(t / 700) * 1.5), bob = REDUCED ? 0 : (Math.sin(t / 1200) > .6 ? 1 : 0), hy = base - 68 - bob;
  if (pass === 'a') {
    g.globalAlpha = fade;
    for (let i = 0; i < 54; i++) { const w = 14 + Math.floor(i / 2.6), l = x - (w >> 1) - 3 + (i > 38 ? sway : 0); R(l, base - 56 + i, w, 1, '#2A2534'); }
    for (let i = 0; i < 56; i++) { const w = 12 + Math.floor(i / 3.2), l = x - (w >> 1) + (i > 46 ? sway : 0); R(l, base - 56 + i, w, 1, '#3E3850'); R(l, base - 56 + i, 1, 1, '#6A6480'); R(l + w - 1, base - 56 + i, 1, 1, '#2A2534'); }
    for (const fx of [-5, 0, 5]) R(x + fx, base - 46, 1, 44, '#2E2938');
    R(x - 1, base - 54, 1, 52, '#B8954A'); R(x + 1, base - 54, 1, 52, '#B8954A');
    for (let k = 0; k < 10; k++) R(x - 15 + k * 3 + sway, base - 1, 2, 1 + (k % 2), '#3E3850');
    for (let i = 0; i < 22; i++) R(x - 10 + i, base - 38 + Math.round(i * .45), 1, 1, i % 2 ? '#A49E98' : '#6C6864');
    R(x + 9, base - 30, 5, 4, '#9A9692'); R(x + 10, base - 32, 3, 2, '#9A9692');
    R(x - 7, base - 31, 13, 2, '#4A3A2A'); for (const kx of [-6, -4, -2]) { R(x + kx, base - 29, 1, 6, '#C9A24A'); R(x + kx, base - 24, 2, 1, '#C9A24A'); }
    R(x - 8, hy + 3, 16, 12, '#3E3850'); R(x - 7, hy + 1, 14, 2, '#3E3850'); R(x - 5, hy, 10, 1, '#3E3850'); R(x - 8, hy + 3, 1, 11, '#6A6480'); R(x - 6, hy + 1, 4, 1, '#6A6480');
    R(x - 4, hy + 5, 9, 8, '#09080C'); R(x - 3, hy + 9, 7, 3, '#2A2534');
    R(x + 11, base - 78, 2, 78, '#6A503A'); R(x + 12, base - 78, 1, 78, '#4A3828'); R(x + 8, base - 48, 5, 5, '#3E3850');
    R(x + 12, base - 78, 7, 2, '#5A5654'); R(x + 17 + lsw, base - 76, 1, 4, '#5A5654');
    R(x + 14 + lsw, base - 72, 7, 10, '#5A5654'); R(x + 15 + lsw, base - 71, 5, 8, '#1A1614'); R(x + 14 + lsw, base - 73, 7, 1, '#6E6A66'); R(x + 16 + lsw, base - 74, 3, 1, '#6E6A66');
    g.globalAlpha = 1; return;
  }
  const blink = !REDUCED && t % 5200 < 160, ec = awake ? '#FFA552' : '#B4CCE6';
  if (!blink) { g.globalAlpha = fade; R(x - 3, hy + 7, 2, 1, ec); R(x + 2, hy + 7, 2, 1, ec); g.globalAlpha = 1; bloom(x, hy + 7, 6, ec, .65 * fade); }
  if (awake) { g.globalAlpha = fade; R(x + 15 + lsw, base - 71, 5, 8, '#FFC27A'); R(x + 17 + lsw, base - 69, 1, 3, '#FFFFFF'); g.globalAlpha = 1; bloom(x + 17 + lsw, base - 67, 12, '#FFA552', .95 * fade * flick(t, 8)); } else { g.globalAlpha = fade; R(x + 17 + lsw, base - 68, 1, 3, '#5D6A7A'); g.globalAlpha = 1; }
  for (let k = 0; k < 4; k++) { const an = REDUCED ? k * 1.6 : t / 1600 + k * 1.57, px = Math.round(x + Math.cos(an) * 24), py = Math.round(base - 38 + Math.sin(an) * 15); g.globalAlpha = fade; R(px, py, 1, 1, '#DCE6F0'); g.globalAlpha = 1; bloom(px, py, 3, '#9FB4C8', .5 * fade); }
}
