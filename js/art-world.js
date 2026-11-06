'use strict';
/* ================= region scenes ================= */
const SKY5 = { threshold: () => skyNight5(3, 160, 18, 74), armory: () => skyNight5(31, 46, 40, 92), chambers: null, reliquary: () => skyNight5(41, 120, 20, 92), vault: () => skyNight5(77, 30, 16, 64), refuge: () => skyNight5(61, 26, 40, 96) };
const AMB = { threshold: [.72, .72, .88], armory: [.62, .6, .72], chambers: [.6, .56, .66], reliquary: [.6, .55, .64], vault: [.7, .7, .86], refuge: [.58, .5, .48] };
const ALB = {}, DYNA = {}, DYNE = {}, LIGHTS = {};

ALB.chambers = (st, p) => {
  const lit = st === 'restored';
  blocks(0, 0, W5, FY, PALS.under, 11);
  for (let x = 0; x < W5; x++) { const yy = Math.round(13 * Math.sin(x / W5 * Math.PI)); R(x, 0, 1, Math.max(0, 15 - yy), '#4A403A'); }
  for (let x = 26; x < 170; x++) { const yy = 20 - Math.round(13 * Math.sin((x - 26) / 144 * Math.PI)); R(x, yy, 1, 2, '#A0927F'); R(x, yy + 2, 1, 1, '#5A5048'); }
  rArch(46, 46, 22, 90, '#5E534B'); rArch(46, 46, 20, 90, '#A0927F'); rArch(46, 46, 18, 90, lit ? '#6E5848' : '#463C35');
  shelf(29, 58, 34, 71, lit); shelf(29, 72, 34, 72, lit); shelf(29, 86, 34, 73, lit); R(27, 88, 38, 2, '#6B4A2E');
  pArch(126, 76, 31, FY, '#4A403A'); pArch(126, 76, 30, FY, '#A0927F'); pArch(126, 76, 27, FY, '#706459'); pArch(126, 76, 24, FY, lit ? '#8A6440' : '#241D18');
  archRows(126, 76, 29, (x, y, w) => { if (y % 5 === 0) { R(x, y, 1, 1, '#5A5048'); R(x + w - 1, y, 1, 1, '#5A5048'); } });
  const ky = 76 - Math.round(1.732 * 30); R(123, ky - 1, 7, 6, '#B4A696'); R(124, ky, 5, 4, '#A0927F');
  pArch(126, 82, 17, FY, lit ? '#9A7450' : '#16110E'); pArch(126, 86, 11, FY, lit ? '#B08A60' : '#0E0B09');
  if (lit) { for (let i = 0; i < 3; i++) { R(112, 70 + i * 9, 28, 1, '#5A3E26'); for (let j = 0; j < 4; j++) { R(114 + j * 6, 64 + i * 9, 5, 6, '#4A6A9A'); R(115 + j * 6, 66 + i * 9, 3, 2, '#E8E0D0'); } } R(120, 92, 12, 8, '#7A6D63'); R(118, 90, 16, 2, '#A0927F'); }
  column(6, 0, FY, 12, PALS.col); column(176, 0, FY, 12, PALS.col);
  torchA(12, 42); torchA(182, 42);
  hangLantern(76, 0, 16);
  if (lit) chandelier(126, 14);
  roots(98, 0, 11, 5); roots(158, 0, 15, 6); roots(66, 0, 8, 7);
  for (const sx of [104, 160]) for (let i = 0; i < 20; i++) R(sx + (i % 3 === 0 ? 1 : 0), 20 + i, 1, 1, '#5A5048');
  flagstones(FY, H5, PALS.floorU, 12);
  if (lit) rugRunner(70, 104, 80, 7, '#7A2E2A');
  R(54, 108, 22, 2, '#3A3E4A'); R(58, 107, 14, 1, '#3A3E4A');
  barrel(0, FY); crate5(2, FY - 22, 9, 9, '#7A5C40'); sack(166, FY); barrel(156, FY); crate5(157, FY - 21, 9, 8, '#86664A');
  if (!lit) {
    cobweb5(19, 16, 1, 12); cobweb5(175, 16, -1, 12); cobweb5(99, 48, 1, 7);
    const r = rng(5); for (let i = 0; i < Math.round((1 - p) * 18) + 5; i++) R(50 + Math.floor(r() * 110), FY + Math.floor(r() * 3), 2, 1, '#8E8074');
    for (let i = 0; i < 6; i++) R(64 + i * 15, FY + 4 + (i % 2) * 5, 4, 3, '#C8BBA0');
  }
  moss(0, FY - 3, W5, 14);
  chain5(160, 0, 30); chain5(165, 0, 22);
};
DYNA.chambers = (t, st, p, opt) => { if (st !== 'restored' || opt.cutT) { outlined(() => mountain(t, opt, 'a')); mountain(t, opt, 'dust'); } };
DYNE.chambers = (t, st, p, opt) => {
  const lit = st === 'restored', ct = opt.cutT || 0, ign = at => !ct || ct < 4300 ? 1 : ct < at ? 0 : 1;
  if (ign(4900)) { flame5(12, 41, t, 4, 1); embers5(12, 36, t, 3, 2); }
  if (ign(5150)) { flame5(182, 41, t, 4, 2); embers5(182, 36, t, 3, 2); }
  R(75, 17, 3, 5, '#FFC27A'); bloom(76, 19, 6, '#FF9A45', .8 * flick(t, 3));
  if (lit || ct > 5400) for (const dx of [-10, -5, 0, 5, 10]) flame5(126 + dx, 10, t, 2, dx + 20);
  g.globalAlpha = .5; R(56, 108, 18, 1, '#D8A060'); g.globalAlpha = 1;
  if (!lit || ct) mountain(t, opt, 'e');
  if (lit && !ct) relicAt(126, 80, 'stone', t, 1);
  motes5(t, 40, 30, 130, 64, 14, 3, '#F4DCB4'); mist5(t, FY - 7, 10, .06);
};
LIGHTS.chambers = (t, st, p, opt) => {
  const ct = opt.cutT || 0, lit = st === 'restored', dim = !ct ? 1 : ct < 4300 ? 1 : ct < 4800 ? 1 - .75 * (ct - 4300) / 500 : .25;
  const ign = at => !ct ? 1 : ct < 4300 ? 1 : ct < at ? dim : Math.min(1, dim + (ct - at) / 300);
  const L = [{ x: 12, y: 38, r: 76, i: 1.25 * ign(4900) * flick(t, 1), c: WARM }, { x: 182, y: 38, r: 76, i: 1.25 * ign(5150) * flick(t, 2), c: WARM }, { x: 76, y: 20, r: 50, i: .85 * (ct ? dim : 1), c: WARM }];
  const k = lit && !ct ? 1 : ct > 5400 ? Math.min(1, (ct - 5400) / 600) : 0;
  if (k > 0) L.push({ x: 126, y: 80, r: 74, i: 1 * k, c: WARM }, { x: 126, y: 10, r: 120, i: .75 * k, c: WARM });
  if ((!lit || ct) && ct < 1600) L.push({ x: 124, y: FY - 58, r: 30, i: .8, c: EMBERL }, { x: 124, y: FY - 36, r: 44, i: .4, c: EMBERL });
  if (ct > 5600 && ct < 8600) L.push({ x: 126, y: 60, r: 70, i: .9 * clamp01((ct - 5600) / 500), c: [.8, .95, 1.25] });
  return L;
};

ALB.threshold = (st, p) => {
  const lit = st === 'restored';
  blocks(0, 60, W5, FY - 60, PALS.gate, 20);
  for (let x = 0; x < W5; x += 11) { R(x, 54, 7, 6, PALS.gate.b); R(x, 54, 7, 1, shade(PALS.gate.b, 1.14)); }
  for (const tx of [22, 138]) {
    blocks(tx, 30, 32, FY - 30, PALS.gate, tx);
    for (let x = tx; x < tx + 32; x += 8) { R(x, 25, 5, 5, PALS.gate.b); R(x, 25, 5, 1, shade(PALS.gate.b, 1.14)); }
    R(tx, 30, 32, 1, '#A09284'); R(tx + 15, 42, 2, 9, '#120E0C'); R(tx + 15, 66, 2, 9, '#120E0C'); R(tx + 15, 10, 1, 15, '#4A4644');
    ivy(tx + 3, 32, 34, tx); ivy(tx + 28, 44, 26, tx + 1);
  }
  blocks(54, 42, 84, FY - 42, PALS.gate, 23);
  for (let x = 54; x < 138; x += 9) { R(x, 37, 6, 5, PALS.gate.b); R(x, 37, 6, 1, shade(PALS.gate.b, 1.14)); }
  rArch(96, 78, 27, FY, '#4A4038'); rArch(96, 78, 26, FY, '#A89A8C'); rArch(96, 78, 23, FY, '#887C72'); rArch(96, 78, 20, FY, lit ? '#9A7048' : '#110D0B');
  for (let k = 0; k <= 12; k++) { const an = Math.PI * (k / 12); R(96 + Math.round(Math.cos(an) * 24.5), 78 - Math.round(Math.sin(an) * 24.5), 1, 2, '#5A5048'); }
  if (lit) {
    R(76, 84, 40, 16, '#8A6A48'); R(88, 72, 16, 12, '#6A4A30'); R(92, 75, 8, 9, '#3A2A1E'); R(80, 80, 4, 8, '#4A6A3A'); R(108, 80, 4, 8, '#4A6A3A');
    R(76, 58, 40, 1, '#3A3533'); R(76, 62, 40, 1, '#3A3533'); for (let x = 77; x < 116; x += 3) { R(x, 58, 1, 6, '#3A3533'); R(x, 64, 1, 2, '#3A3533'); }
    banner5(64, 46, 8, 24, '#9A3530'); banner5(120, 46, 8, 24, '#9A3530');
  } else {
    const planks = Math.round((1 - p) * 3) + 2; for (let i = 0; i < planks; i++) { R(74, 66 + i * 7, 44, 3, '#6A5038'); R(74, 66 + i * 7, 44, 1, '#8A6A48'); }
    for (let k = 0; k < 26; k++) { R(76 + k, 62 + k, 3, 1, '#5A4430'); R(116 - k, 62 + k, 3, 1, '#5A4430'); }
    crate5(78, 88, 12, 12, '#7A5C40'); crate5(100, 86, 14, 14, '#86664A');
  }
  for (const bx of [70, 122]) { R(bx - 4, FY - 16, 9, 3, '#4A4644'); R(bx - 4, FY - 17, 9, 1, '#6E6864'); R(bx - 3, FY - 13, 7, 1, '#3A3533'); R(bx, FY - 12, 1, 11, '#3A3533'); R(bx - 3, FY - 1, 7, 1, '#3A3533'); }
  for (const lx of [52, 142]) { R(lx, FY - 24, 2, 24, '#3A3533'); R(lx - 2, FY - 25, 6, 1, '#4A4644'); R(lx - 2, FY - 31, 1, 6, '#3A3533'); R(lx + 3, FY - 31, 1, 6, '#3A3533'); R(lx - 1, FY - 30, 4, 4, '#2A2420'); R(lx - 2, FY - 32, 6, 1, '#4A4644'); }
  R(0, FY, W5, H5 - FY, '#544E4A');
  for (let y = FY; y < H5; y++) { const w = 40 + (y - FY) * 2; R(96 - (w >> 1), y, w, 1, lit ? '#76695C' : '#625A54'); }
  const r = rng(13); for (let i = 0; i < 110; i++) { const x = Math.floor(r() * W5), y = FY + Math.floor(r() * (H5 - FY)); R(x, y, 2 + Math.floor(r() * 3), 1, r() < .5 ? '#66605A' : '#46403C'); }
  for (let i = 0; i < 40; i++) { const x = Math.floor(r() * W5); if (Math.abs(x - 96) > 28) R(x, FY - 1, 1, 2, '#5E7048'); }
  R(4, FY - 10, 20, 10, '#82766E'); for (let x = 4; x < 24; x += 5) R(x, FY - 10, 1, 10, '#5A5048'); R(4, FY - 10, 20, 1, '#A09284'); R(6, FY - 26, 2, 16, '#5A3E26'); R(20, FY - 26, 2, 16, '#5A3E26'); R(2, FY - 30, 24, 4, '#6A3A2A'); R(2, FY - 30, 24, 1, '#8A4A36'); R(14, FY - 26, 1, 6, '#C8BBA0'); R(12, FY - 20, 4, 3, '#6B4A2E');
  R(152, FY - 14, 28, 8, '#6B4A2E'); R(152, FY - 14, 28, 1, '#8E6A44'); R(154, FY - 21, 24, 7, '#C9A24A'); for (let i = 0; i < 12; i++) R(155 + i * 2, FY - 21 + (i % 3), 1, 3, '#E0C070'); disc(160, FY - 4, 4, '#4A3626'); disc(174, FY - 4, 4, '#4A3626'); R(160, FY - 4, 1, 1, '#8E6A44'); R(174, FY - 4, 1, 1, '#8E6A44'); R(180, FY - 12, 10, 1, '#5A3E26');
  for (const fx of [186, 190]) R(fx, 92, 2, H5 - 92, '#0B0A09');
};
DYNA.threshold = (t, st, p, opt) => {
  for (const tx of [22, 138]) for (let i = 0; i < 9; i++) R(tx + 16 + i, 11 + (REDUCED ? 0 : Math.round(Math.sin(t / 260 + i / 2) * 1)), 1, 5, i % 3 === 0 ? '#7A2A26' : '#9A3530');
  if (st !== 'restored') { outlined(() => buriedTable(t, opt, 'a')); buriedTable(t, opt, 'dust'); }
  else outlined(() => tableTamed(t, 'a'));
  if (opt.inCut && opt.cutT > 5600) { g.globalAlpha = clamp01((opt.cutT - 5600) / 900); outlined(() => tableTamed(t, 'a')); g.globalAlpha = 1; }
};
DYNE.threshold = (t, st, p, opt) => {
  const lit = st === 'restored' || (opt.inCut && opt.cutT > 5400);
  if (lit || p >= .5) { flame5(70, FY - 17, t, 4, 1); flame5(68, FY - 17, t + 70, 3, 2); flame5(72, FY - 17, t + 140, 3, 3); embers5(70, FY - 22, t, 6, 3); }
  if (lit) {
    flame5(122, FY - 17, t, 4, 4); flame5(120, FY - 17, t + 70, 3, 5); flame5(124, FY - 17, t + 140, 3, 6); embers5(122, FY - 22, t, 6, 3);
    for (const tx of [22, 138]) { R(tx + 15, 42, 2, 9, '#FFB347'); R(tx + 15, 66, 2, 9, '#FFB347'); bloom(tx + 16, 46, 4, '#FF9A45', .5); bloom(tx + 16, 70, 4, '#FF9A45', .5); }
    for (const lx of [52, 142]) { R(lx - 1, FY - 30, 4, 4, '#FFC27A'); bloom(lx + 1, FY - 28, 6, '#FF9A45', .7 * flick(t, lx)); }
  }
  if (st !== 'restored') buriedTable(t, opt, 'e'); else tableTamed(t, 'e');
  if (opt.inCut && opt.cutT > 6400) tableTamed(t, 'e');
  motes5(t, 0, 50, W5, 48, 8, 8); mist5(t, FY - 6, 10, .07);
};
LIGHTS.threshold = (t, st, p) => {
  const lit = st === 'restored', L = [];
  if (lit || p >= .5) L.push({ x: 70, y: FY - 22, r: 70, i: 1.15 * flick(t, 1), c: WARM });
  if (lit) L.push({ x: 122, y: FY - 22, r: 70, i: 1.15 * flick(t, 4), c: WARM }, { x: 96, y: 84, r: 58, i: 1, c: WARM }, { x: 53, y: FY - 28, r: 44, i: .9, c: WARM }, { x: 143, y: FY - 28, r: 44, i: .9, c: WARM }, { x: 82, y: FY - 26, r: 30, i: .8 * flick(t, 7), c: WARM });
  else L.push({ x: 104, y: FY - 12, r: 36, i: .6, c: EMBERL });
  return L;
};

ALB.armory = (st, p) => {
  const lit = st === 'restored';
  blocks(0, 0, W5, FY, PALS.tower, 31);
  for (const cx of [44, 148]) { pArch(cx, 44, 13, 78, '#A8A2AE'); pArch(cx, 44, 11, 78, '#6E6876'); pArchClear(cx, 44, 9, 76); R(cx, 28, 1, 48, '#A8A2AE'); R(cx - 9, 56, 18, 1, '#A8A2AE'); R(cx - 2, 32, 5, 1, '#A8A2AE'); R(cx - 12, 78, 25, 2, '#8E8894'); }
  tapestry(60, 8, 12, 28, '#6E4E80', '#C9A24A'); tapestry(120, 8, 12, 28, '#3E5A88', '#C9A24A');
  R(0, FY, W5, H5 - FY, '#7E5C3C'); for (let y = FY + 3; y < H5; y += 4) R(0, y, W5, 1, '#62462E'); const r = rng(33); for (let i = 0; i < 30; i++) R(Math.floor(r() * W5), FY + 1 + Math.floor(r() * (H5 - FY - 2)), 1, 3, '#62462E');
  R(62, 104, 68, 9, '#8E3A30'); R(64, 106, 64, 5, '#A8483A'); for (let x = 66; x < 126; x += 6) R(x, 108, 3, 1, '#C9A24A');
  R(2, 44, 20, 2, '#6B4A2E'); for (let i = 0; i < 4; i++) { R(4 + i * 5, 46, 1, 54, '#7A5634'); R(3 + i * 5, 41, 3, 5, i % 2 ? '#C9CDD4' : '#B8BCC4'); R(4 + i * 5, 40, 1, 1, '#E8ECF2'); } R(2, 70, 20, 2, '#6B4A2E');
  const cols = ['#6E4E80', '#4E5E80', '#9A3E30', '#5E6E4E', '#7E6E5E', '#3E4E6E'];
  if (lit) [[63, '#6E4E80'], [128, '#3E5A88']].forEach(([x, c]) => { R(x - 2, 44, 5, 2, '#5E422A'); R(x, 46, 1, 2, '#3A3533'); for (let yy = 0; yy < 30; yy++) { const w = 4 + Math.floor(yy / 6); R(x + 1 - (w >> 1), 48 + yy, w, 1, yy % 7 === 0 ? shade(c, .85) : c); } R(x - 1, 49, 1, 26, shade(c, .72)); R(x + 1, 49, 1, 24, shade(c, 1.15)); });
  else { const r2 = rng(17); for (let i = 0; i < 40 * (1 - p) + 14; i++) { const w = 5 + Math.floor(r2() * 9), x = 60 + Math.floor(r2() * 76), y = 84 + Math.floor(r2() * 16); R(x, y, w, 3, cols[i % 6]); R(x, y, w, 1, shade(cols[i % 6], 1.15)); } }
  R(36, 58, 2, 42, '#5E422A'); R(31, 98, 12, 2, '#5E422A'); R(30, 60, 14, 14, '#9A9EA6'); R(31, 61, 4, 12, '#B8BCC4'); R(30, 67, 14, 1, '#6E727A'); R(33, 52, 8, 8, '#868A92'); R(34, 53, 2, 3, '#B2B6BE'); R(35, 55, 5, 1, '#16181C'); R(27, 60, 3, 4, '#9A9EA6'); R(44, 60, 3, 4, '#9A9EA6');
  R(134, 88, 26, 12, '#7A5634'); R(134, 88, 26, 2, '#94704A'); R(134, 93, 26, 1, '#4A4644'); R(145, 91, 4, 4, '#C9A24A'); candlesA([[139, 80], [145, 82], [151, 79]], 88);
  R(172, 56, 6, 6, '#D8CBB0'); R(174, 62, 2, 4, '#8A7A60'); for (let i = 0; i < 30; i++) { const w = 6 + Math.floor(i / 3); R(175 - (w >> 1), 66 + i, w, 1, i % 5 === 0 ? '#7E4A6E' : '#9A5A86'); } R(173, 96, 4, 4, '#5E422A');
  for (let i = 0; i < 3; i++) { R(180, 90 - i * 8, 11, 8, ['#A8483A', '#3E5A88', '#C9A24A'][i]); R(180, 90 - i * 8, 11, 1, '#E8E0D0'); }
  chain5(186, 0, 26);
};
DYNA.armory = (t, st, p, opt) => {
  if (st !== 'restored') { outlined(() => closetBoss(t, opt, 'a')); closetBoss(t, opt, 'dust'); }
  else outlined(() => closetTamed(t, 'a'));
  if (opt.inCut && opt.cutT > 5600) { g.globalAlpha = clamp01((opt.cutT - 5600) / 900); outlined(() => closetTamed(t, 'a')); g.globalAlpha = 1; }
};
DYNE.armory = (t, st, p, opt) => {
  const lit = st === 'restored' || (opt.inCut && opt.cutT > 5400);
  rays(36, 56, 44, 18, t); rays(140, 56, 44, 18, t);
  if (lit) { flame5(140, 80, t, 2, 1); flame5(146, 82, t, 2, 2); flame5(152, 79, t, 2, 3); }
  if (st !== 'restored') closetBoss(t, opt, 'e'); else closetTamed(t, 'e');
  if (opt.inCut && opt.cutT > 6400) closetTamed(t, 'e');
  motes5(t, 40, 56, 40, 40, 9, 12, '#C9D3E2'); motes5(t, 144, 56, 40, 40, 8, 13, '#C9D3E2'); mist5(t, FY - 6, 8, .05);
};
LIGHTS.armory = (t, st) => {
  const L = [{ x: 44, y: 62, r: 74, i: .9, c: COOL }, { x: 148, y: 62, r: 74, i: .9, c: COOL }];
  if (st === 'restored') L.push({ x: 146, y: 78, r: 56, i: 1.1 * flick(t, 1), c: WARM }, { x: 100, y: 70, r: 60, i: .45, c: WARM });
  else L.push({ x: 100, y: 52, r: 36, i: .55, c: [.95, .62, 1.25] });
  return L;
};

ALB.reliquary = (st, p) => {
  const lit = st === 'restored', cleared = lit ? 5 : st === 'active' ? Math.round(p * 5) : 0;
  blocks(0, 0, W5, FY, PALS.chapel, 41);
  tapestry(3, 8, 16, 34, '#8E2F2A', '#C9A24A'); tapestry(173, 8, 16, 34, '#8E2F2A', '#C9A24A');
  disc(96, 28, 20, '#5A4E46'); disc(96, 28, 19, '#A89A8C'); discClear(96, 28, 16);
  for (let a = 0; a < 12; a++) { const an = a / 12 * Math.PI * 2; for (let rr = 3; rr < 17; rr++) R(96 + Math.round(Math.cos(an) * rr), 28 + Math.round(Math.sin(an) * rr), 1, 1, '#A89A8C'); }
  for (let a = 0; a < 44; a++) { const an = a / 44 * Math.PI * 2; R(96 + Math.round(Math.cos(an) * 9), 28 + Math.round(Math.sin(an) * 9), 1, 1, '#A89A8C'); }
  disc(96, 28, 3, '#A89A8C');
  for (const cx of [60, 132]) { for (let i = 0; i < 26; i += 2) R(cx, i, 1, 1, '#6C6864'); R(cx - 3, 26, 7, 6, '#9A8A5A'); R(cx - 2, 25, 5, 1, '#B8A870'); R(cx - 3, 29, 7, 1, '#6A5A3A'); }
  const items = [['#E0D4BA', 6, 8], ['#D4AC50', 5, 5], ['#B04A3C', 4, 9], ['#7898C0', 7, 6], ['#92AC72', 5, 6]];
  for (let i = 0; i < 5; i++) {
    const cx = 32 + i * 32;
    rArch(cx, 68, 12, 86, '#5A4E46'); rArch(cx, 68, 11, 86, '#A89A8C'); rArch(cx, 68, 9, 86, i < cleared ? '#7E5E44' : '#241C16'); R(cx - 11, 86, 23, 2, '#A89A8C');
    if (i < cleared) { const it = items[i]; R(cx - (it[1] >> 1), 86 - it[2], it[1], it[2], it[0]); R(cx - (it[1] >> 1), 86 - it[2], it[1], 1, shade(it[0], 1.2)); }
    else { R(cx - 9, 70, 18, 2, '#6A5038'); R(cx - 9, 78, 18, 2, '#6A5038'); cobweb5(cx - 9, 60, 1, 5); }
  }
  for (const sx of [48, 80, 112, 144]) statueHooded(sx, 84, 18, '#9A9088');
  R(76, 90, 40, 10, '#8E8074'); R(74, 88, 44, 2, '#A89A8C'); R(84, 88, 24, 8, '#9A3530'); R(84, 95, 24, 1, '#C9A24A'); R(95, 90, 2, 4, '#C9A24A'); R(90, 86, 8, 2, '#E0D4BA');
  candlesA([[79, 80], [83, 82], [109, 81], [113, 83]], 88);
  for (const x of [12, 180]) { R(x, 60, 2, 40, '#4A4644'); R(x - 3, 59, 8, 2, '#5A5654'); R(x - 3, FY - 1, 8, 1, '#4A4644'); R(x, 52, 2, 7, '#D8CBB0'); }
  R(0, FY, W5, H5 - FY, '#625750'); for (let y = FY; y < H5; y += 4) for (let x = ((y - FY) / 4) % 2 ? 0 : 4; x < W5; x += 8) R(x, y, 4, 4, '#74685C');
  R(0, 102, 48, H5 - 102, '#0D0A09'); R(0, 98, 44, 4, '#0D0A09'); R(146, 102, 46, H5 - 102, '#0D0A09'); R(150, 98, 42, 4, '#0D0A09');
};
DYNA.reliquary = (t, st, p, opt) => { if (st !== 'restored' || opt.cutT) outlined(() => wraith(t, opt, 'a'), '#0E0C14'); };
function glass(cx, cy, t, a) { const cols = ['#D2482E', '#4E74C8', '#F0C040', '#5E9A50']; g.globalAlpha = .85 * a; for (let rr = 4; rr < 16; rr++) for (let k = 0; k < 26; k++) { const an = k / 26 * Math.PI * 2 + .13; R(cx + Math.round(Math.cos(an) * rr), cy + Math.round(Math.sin(an) * rr), 1, 1, cols[(Math.floor(k / 2) + (rr > 9 ? 1 : 0)) % 4]); } g.globalAlpha = 1; bloom(cx, cy, 16, '#F0C040', .5 * a * flick(t, 6)); }
DYNE.reliquary = (t, st, p, opt) => {
  const lit = st === 'restored', ct = opt.cutT || 0, ramp = ct ? clamp01((ct - 5400) / 700) : 0;
  if (lit || ramp > 0) { glass(96, 28, t, lit && !ct ? 1 : ramp); [[79, 80], [83, 82], [109, 81], [113, 83]].forEach(([x, y], i) => flame5(x + 1, y, t, 2, i + 1)); flame5(13, 52, t, 3, 7); flame5(181, 52, t, 3, 8); }
  else if (st === 'active') { flame5(13, 52, t, 3, 7); flame5(80, 80, t, 2, 1); }
  for (const cx of [60, 132]) { g.globalAlpha = .25; for (let k = 0; k < 4; k++) R(cx - 1 + Math.round(Math.sin(t / 700 + k) * 2), 22 - ((REDUCED ? k * 3 : t / 120 + k * 4) % 14), 2, 1, '#C8C4D4'); g.globalAlpha = 1; }
  if (st === 'dark') { g.globalAlpha = .2; R(0, 0, W5, H5, '#08070C'); g.globalAlpha = 1; mist5(t, 50, 40, .08); }
  else { motes5(t, 40, 20, 110, 70, 10, 21, '#F4DCB4'); mist5(t, FY - 7, 10, .05); }
  if (!lit || ct) wraith(t, opt, 'e');
  if (lit && !ct) relicAt(96, 76, 'klantern', t, 1);
};
LIGHTS.reliquary = (t, st, p, opt) => {
  const lit = st === 'restored', ct = opt.cutT || 0, k = lit && !ct ? 1 : ct > 5400 ? clamp01((ct - 5400) / 700) : 0, L = [];
  if (k > 0) L.push({ x: 81, y: 78, r: 62, i: 1.05 * k * flick(t, 1), c: WARM }, { x: 111, y: 78, r: 62, i: 1.05 * k * flick(t, 2), c: WARM }, { x: 96, y: 34, r: 84, i: .75 * k, c: GOLD }, { x: 13, y: 50, r: 52, i: .9 * k, c: WARM }, { x: 181, y: 50, r: 52, i: .9 * k, c: WARM });
  else if (st === 'active') L.push({ x: 13, y: 50, r: 58, i: 1, c: WARM }, { x: 80, y: 78, r: 50, i: .95 * flick(t, 1), c: WARM });
  if (st !== 'restored' || ct) L.push({ x: 96, y: 30, r: 40, i: .4, c: COOL });
  if (ct > 5600 && ct < 8600) L.push({ x: 96, y: 60, r: 70, i: .9 * clamp01((ct - 5600) / 500), c: [1.25, 1, .7] });
  return L;
};

ALB.vault = st => {
  const open = st === 'active' || st === 'restored';
  rockFace(0, 18, W5, FY - 18, 51);
  frieze(82, 8, 72);
  rArch(118, 60, 43, FY, '#4A4440'); rArch(118, 60, 41, FY, '#A89E96'); rArch(118, 60, 37, FY, '#726A62');
  for (let k = 0; k <= 16; k++) { const an = Math.PI * k / 16; R(118 + Math.round(Math.cos(an) * 39), 60 - Math.round(Math.sin(an) * 39), 2, 2, '#C0B6A6'); }
  rArch(118, 60, 34, FY, open ? '#2A1A10' : '#7E5A3A');
  if (!open) {
    R(118, 26, 1, 74, '#4A3424');
    for (const y of [44, 62, 80]) { R(84, y, 69, 3, '#4E4A48'); R(84, y, 69, 1, '#726E6A'); for (let x = 86; x < 152; x += 6) R(x, y + 1, 1, 1, '#ACA6A0'); }
    for (const x of [96, 140]) R(x, 32, 3, 68, '#4E4A48');
    disc(118, 62, 10, '#5A2622'); disc(118, 62, 8, '#9A3530'); R(116, 56, 5, 12, '#D0A84A'); R(112, 60, 13, 4, '#D0A84A'); R(117, 57, 3, 3, '#9A3530');
    for (let k = 0; k < 70; k += 3) { R(84 + k, 30 + Math.round(k * .95), 3, 2, k % 6 ? '#8E8A86' : '#5C5854'); R(152 - k, 30 + Math.round(k * .95), 3, 2, k % 6 ? '#8E8A86' : '#5C5854'); }
    R(112, 72, 13, 10, '#8E8A86'); R(114, 68, 9, 4, '#8E8A86'); R(116, 69, 5, 3, '#2A2624'); R(117, 75, 3, 4, '#1A1614');
  } else {
    R(84, 26, 34, 74, '#7E5A3A'); for (const y of [44, 62, 80]) R(84, y, 34, 3, '#4E4A48');
    R(121, 30, 5, 70, '#5A3E26');
    for (let k = 0; k < 20; k++) R(88 + k * 3, FY - 3, 3, 2, k % 2 ? '#8E8A86' : '#5C5854');
  }
  for (let i = 0; i < 4; i++) { R(70 - i * 6, FY - 8 + i * 2, 96 + i * 12, 2, i % 2 ? '#7E746E' : '#8E847C'); moss(70 - i * 6, FY - 8 + i * 2, 96 + i * 12, 60 + i); }
  statueHooded(172, FY - 8, 34, '#8E8680'); R(164, FY - 8, 16, 8, '#7E746E');
  R(0, FY, W5, H5 - FY, '#504A48'); const r = rng(55); for (let i = 0; i < 60; i++) R(Math.floor(r() * W5), FY + Math.floor(r() * (H5 - FY)), 2 + Math.floor(r() * 3), 1, r() < .5 ? '#5E5854' : '#403A38');
  for (const cx of [48, 186]) { R(cx, FY - 22, 1, 22, '#4A4644'); R(cx - 4, FY - 22, 9, 1, '#4A4644'); for (const dx of [-4, 0, 4]) R(cx + dx, FY - 26, 1, 4, '#D8CBB0'); R(cx - 3, FY - 1, 7, 1, '#4A4644'); }
  for (let i = 0; i < 6; i++) R(0, 60 + i * 9, 4 - (i % 2), 9, '#0B0909');
};
const keeperFade = (st, opt) => opt.inCut ? (opt.cutT > 1500 ? Math.max(0, 1 - (opt.cutT - 1500) / 2600) : 1) : st === 'restored' ? 0 : 1;
DYNA.vault = (t, st, p, opt) => { const kf = keeperFade(st, opt); if (kf > 0) outlined(() => keeper(76, FY, t, st === 'active', 'a', kf), '#08070C'); };
DYNE.vault = (t, st, p, opt) => {
  const open = st === 'active' || st === 'restored', kf = keeperFade(st, opt);
  if (open) { R(118, 30, 3, 70, '#FFB060'); bloom(119, 64, 16, '#FFA552', .8 * flick(t, 7)); for (const cx of [48, 186]) for (const dx of [-4, 0, 4]) flame5(cx + dx, FY - 26, t, 2, dx + 5); }
  if (kf > 0) keeper(76, FY, t, st === 'active', 'e', kf);
  if (st === 'restored' && !opt.inCut) relicAt(118, 66, 'seal', t, 1);
  mist5(t, FY - 24, 22, .07); motes5(t, 0, 30, W5, 60, 8, 31);
};
LIGHTS.vault = (t, st) => {
  const open = st === 'active' || st === 'restored', L = [];
  if (open) L.push({ x: 119, y: 64, r: 90, i: 1.1 * flick(t, 7), c: WARM }, { x: 48, y: FY - 27, r: 46, i: .9, c: WARM }, { x: 186, y: FY - 27, r: 46, i: .9, c: WARM }, { x: 93, y: FY - 67, r: 54, i: 1 * flick(t, 8), c: WARM });
  else L.push({ x: 76, y: FY - 61, r: 20, i: .55, c: COOL });
  return L;
};

ALB.refuge = () => {
  blocks(0, 0, W5, FY, PALS.chapel, 61);
  pArch(30, 46, 12, 72, '#A89A8C'); pArch(30, 46, 10, 72, '#6E625A'); pArchClear(30, 46, 8, 70); R(30, 30, 1, 40, '#A89A8C');
  R(130, 4, 62, 2, '#5A3E26'); for (let x = 134; x < 190; x += 8) { R(x, 6, 1, 3, '#8A7A60'); R(x - 1, 9, 3, 7, x % 16 ? '#5E7E46' : '#8A6A3A'); }
  blocks(66, 34, 60, 66, PALS.gate, 62, 10, 5);
  R(60, 30, 72, 5, '#ACA090'); R(58, 28, 76, 2, '#BCB0A0');
  rArch(96, 66, 20, FY, '#4A4038'); rArch(96, 66, 18, FY, '#1A1210');
  R(80, 95, 32, 3, '#4A4644'); R(82, 92, 28, 4, '#6B4A2E'); R(86, 90, 12, 3, '#7A5634');
  candlesA([[62, 21], [128, 22]], 28);
  R(150, 40, 30, 60, '#6B4A2E'); for (let i = 0; i < 4; i++) { R(150, 52 + i * 12, 30, 2, '#5A3E26'); for (let j = 0; j < 7; j++) R(152 + j * 4, 44 + i * 12, 3, 8, ['#9A3E30', '#3E5A88', '#5E7048', '#C9A24A', '#7E6E5E'][(i + j) % 5]); }
  R(28, 80, 26, 6, '#7A3A2E'); R(26, 72, 6, 22, '#6A3026'); R(50, 74, 6, 20, '#6A3026'); R(28, 64, 24, 16, '#7A3A2E'); R(30, 94, 3, 6, '#4A2E20'); R(48, 94, 3, 6, '#4A2E20');
  R(0, FY, W5, H5 - FY, '#7E5C3C'); for (let y = FY + 3; y < H5; y += 4) R(0, y, W5, 1, '#62462E');
  R(62, 103, 68, 10, '#7A2E2A'); R(64, 105, 64, 6, '#9A3A30'); for (let x = 66; x < 126; x += 5) R(x, 107, 2, 2, '#C9A24A');
};

/* ================= actors, hero actions ================= */
const SPOT6 = { threshold: [30, 60], armory: [24, 54], chambers: [30, 62], reliquary: [22, 50], vault: [14, 40] };
function heroBaseX(rg, t) { const sp = SPOT6[rg]; if (!(S.active && rg === S.region)) return sp[0]; const since = t - activeAnim; if (REDUCED || since > 2200) return sp[1]; return Math.round(sp[0] + (sp[1] - sp[0]) * Math.max(0, since) / 2200); }
const heroHop = t => { const s = t - cheer; return !REDUCED && s >= 0 && s < 1000 ? [0, 2, 3, 2][Math.floor(s / 110) % 4] : 0; };
function heroState(rg, t) {
  let x = heroBaseX(rg, t), pose = 'idle', walking = !!(S.active && rg === S.region && !REDUCED && t - activeAnim < 2200), slash = -1;
  const tgt = SPOT6[rg][1];
  if (cut && cut.rg === rg) {
    const c = t - cut.t0;
    if (c < 0) return { x: Math.round(x), pose: 'strike', walking: false, slash: -1 };
    if (c < 200) { x = x + (tgt - x) * (c / 200); walking = true; }
    else if (c < 680) { x = tgt; pose = 'strike'; slash = clamp01((c - 200) / 320); }
    else { x = tgt; pose = c > 6000 ? 'victory' : c > 4300 && c < 6000 ? 'raise' : 'idle'; }
    return { x: Math.round(x), pose, walking, slash };
  }
  const a = t - heroAct.at, k = heroAct.kind;
  if (k === 'attack' && a < 700 && !REDUCED) {
    const from = x, to = Math.max(from + 4, tgt);
    if (a < 180) { x = from + (to - from) * (a / 180); walking = true; }
    else if (a < 470) { x = to; pose = 'strike'; slash = clamp01((a - 180) / 280); }
    else { x = to + (from - to) * ((a - 470) / 230); walking = true; }
  } else if (k === 'cast' && a < 1300) pose = 'raise';
  else if (k === 'victory' && a < 1800) pose = 'victory';
  else if (!REDUCED && !walking) { const cyc = t % 15000, which = Math.floor(t / 15000) % 3; if (cyc < 2400) pose = which === 0 ? 'raise' : which === 1 ? 'strike' : 'idle'; }
  return { x: Math.round(x), pose, walking, slash };
}
const catPos6 = (rg, t) => catState(t, Math.max(3, SPOT6[rg][0] - 14), FY);
function actorsA(rg, t) { drawCatA(catPos6(rg, t), t); const hs = heroState(rg, t); outlined(() => heroRig(hs.x, FY - heroHop(t), t, curGear(), 'albedo', { pose: hs.pose, walking: hs.walking })); }
function actorsE(rg, t) { drawCatE(catPos6(rg, t), t); const hs = heroState(rg, t); heroRig(hs.x, FY - heroHop(t), t, curGear(), 'emissive', { pose: hs.pose, slash: hs.slash }); }
function actorLights(rg, t) { const hs = heroState(rg, t), castBoost = heroAct.kind === 'cast' && t - heroAct.at < 1300 ? 1.3 : 1; return [lanternLight(hs.x, FY - heroHop(t), hs.pose, curGear(), t, castBoost)]; }
function cutOverlay(t, rg) {
  if (!cut || cut.rg !== rg) return;
  const c = t - cut.t0, x = { chambers: 126, threshold: 104, armory: 100, vault: 118 }[rg] || 96;
  if ((c > 260 && c < 360) || (c > 1500 && c < 1600)) { g.globalAlpha = .55; R(0, 0, W5, H5, '#FFF6E8'); g.globalAlpha = 1; }
  if (c > 5600 && c < 8600) {
    const a = clamp01((c - 5600) / 500) * (c > 8000 ? clamp01((8600 - c) / 600) : 1), op = g.globalCompositeOperation;
    g.globalCompositeOperation = 'lighter';
    for (let y = 0; y < FY; y++) { g.globalAlpha = a * (.1 + .08 * Math.sin(y / 5 + c / 140)); R(x - 4, y, 9, 1, '#BFD8FF'); g.globalAlpha = a * .2; R(x - 1, y, 3, 1, '#FFFFFF'); }
    g.globalAlpha = 1; g.globalCompositeOperation = op;
    const ry = Math.round(86 - clamp01((c - 5700) / 1200) * 26); relicAt(x, ry, REGIONS[rg].relic[1], t, clamp01((c - 5700) / 400));
    for (let k = 0; k < 14; k++) { const an = k / 14 * Math.PI * 2 + c / 500, rr = 12 + 4 * Math.sin(c / 300 + k); g.globalAlpha = a * .9; R(x + Math.round(Math.cos(an) * rr), ry + 4 + Math.round(Math.sin(an) * rr * .7), 1, 1, '#FFE6B8'); }
    g.globalAlpha = 1;
  }
}
function cutLights(rg, t, opt) {
  const ct = opt.cutT, dim = ct < 4300 ? 1 : ct < 4800 ? 1 - .75 * (ct - 4300) / 500 : .25, k = clamp01((ct - 5000) / 900), x = { threshold: 104, armory: 100, vault: 118 }[rg];
  const L = LIGHTS[rg](t, 'active', 1, opt).map(l => Object.assign({}, l, { i: l.i * dim * (1 - k) })).concat(LIGHTS[rg](t, 'restored', 1, opt).map(l => Object.assign({}, l, { i: l.i * k })));
  if (ct > 5600 && ct < 8600) L.push({ x, y: 60, r: 70, i: .9 * clamp01((ct - 5600) / 500), c: [.8, .95, 1.25] });
  return L;
}
function drawRegion(ctx, rg, t) {
  let st = S.status[rg], p = progressOf(rg); const opt = {};
  if (cut && cut.rg === rg) { opt.cutT = t - cut.t0; opt.inCut = true; opt.relive = cut.relive; st = 'active'; p = 1; }
  const ct = opt.cutT || 0, ambK = !ct ? 1 : ct < 4300 ? 1 : ct < 4800 ? 1 - .55 * (ct - 4300) / 500 : ct < 5800 ? .45 + .55 * (ct - 4800) / 1000 : 1;
  const o = { sky: SKY5[rg] ? ['sky|' + rg, SKY5[rg]] : null, alb: ['alb6|' + rg + '|' + st + '|' + p, () => ALB[rg](st, p)], amb: AMB[rg].map(v => v * ambK), shake: shakeOff(t) };
  if (ct > 5000) o.blend = ['alb6|' + rg + '|restored|1', () => ALB[rg]('restored', 1), clamp01((ct - 5000) / 1000)];
  o.dynA = () => { if (DYNA[rg]) DYNA[rg](t, st, p, opt); actorsA(rg, t); parts('a', rg); };
  o.lights = (opt.inCut && (rg === 'threshold' || rg === 'armory' || rg === 'vault') ? cutLights(rg, t, opt) : LIGHTS[rg](t, st, p, opt)).concat(actorLights(rg, t));
  o.dynE = () => {
    if (DYNE[rg]) DYNE[rg](t, st, p, opt); actorsE(rg, t); parts('e', rg); cutOverlay(t, rg);
    if (t - flashAt < 150) { g.globalAlpha = .45 * (1 - (t - flashAt) / 150); R(0, 0, W5, H5, '#FFF6E8'); g.globalAlpha = 1; }
  };
  renderLit(ctx, W5, H5, SC5, o);
}
function drawRefuge(ctx, t) {
  const HS = S.hearth, lit = HS.done, base = lit ? 11 : 3 + HS.step * 2;
  renderLit(ctx, W5, H5, SC5, {
    sky: ['sky|refuge', SKY5.refuge], alb: ['alb6|refuge', ALB.refuge], amb: AMB.refuge,
    dynA: () => { ORDER.filter(beaten).forEach((r, i) => sprite(RELIC[REGIONS[r].relic[1]], 68 + i * 12, 20, SPAL)); drawCatA({ pose: 'sleep', x: 112, bottom: 110, flip: false }, t); outlined(() => heroRig(128, FY + 4, t, curGear(), 'albedo', { pose: 'idle' })); },
    lights: [{ x: 96, y: 86, r: 104, i: (lit ? 1.4 : .6 + HS.step * .2) * flick(t, 9), c: WARM }, { x: 63, y: 18, r: 30, i: .7, c: WARM }, { x: 129, y: 19, r: 30, i: .7, c: WARM }, lanternLight(128, FY + 4, 'idle', curGear(), t)],
    dynE: () => {
      for (let i = 0; i < 12; i++) { const fx = 85 + i * 2, fh = Math.max(1, Math.round(base + (REDUCED ? 0 : Math.sin(t / 120 + i * 1.6) * 2) - Math.abs(i - 5.5) * (lit ? .9 : .5))); R(fx, 91 - fh, 2, fh, '#D2541E'); if (fh > 2) R(fx, 92 - fh, 2, fh - 1, '#E8772E'); if (fh > 5) R(fx, 94 - fh, 2, fh - 3, '#FFA552'); }
      bloom(96, 84, lit ? 16 : 9, '#FF9A45', .9 * flick(t, 9)); embers5(96, 84, t, lit ? 8 : 3, 8); flame5(63, 21, t, 2, 1); flame5(129, 22, t, 2, 2);
      heroRig(128, FY + 4, t, curGear(), 'emissive', { pose: 'idle' }); drawCatE({ pose: 'sleep', x: 112, bottom: 110, flip: false }, t); motes5(t, 60, 40, 80, 50, 8, 44, '#FFC890');
    }
  });
}
const POSES = [['idle', 'Idle'], ['ready', 'Ready'], ['strike', 'Strike'], ['raise', 'Lantern'], ['victory', 'Victory']];
function previewAlb() {
  blocks(0, 0, 80, 46, PALS.chapel, 91, 10, 5);
  pArch(40, 30, 21, 46, '#A89A8C'); pArch(40, 30, 18, 46, '#4E443E');
  banner5(8, 4, 8, 22, '#9A3530'); banner5(64, 4, 8, 22, '#3E5A88');
  torchA(4, 18); torchA(76, 18);
  R(0, 46, 80, 10, '#625750'); for (let x = 2; x < 80; x += 9) R(x, 46, 1, 10, '#52483F'); R(0, 46, 80, 1, '#74685C'); R(18, 50, 44, 3, '#7A2E2A'); R(19, 51, 42, 1, '#C9A24A');
}
function drawPreview(ctx, t) {
  const G = curGear(), pp = previewPose, hx = 32, base = 51;
  let pose = pp === 'ready' ? 'strike' : pp, slash = -1;
  if (pp === 'strike') { const a = t % 1600; pose = a < 650 ? 'strike' : 'idle'; slash = a < 560 ? clamp01((a - 60) / 380) : -1; }
  renderLit(ctx, 80, 56, 5, {
    sky: null, alb: ['alb6|preview', previewAlb], amb: [.62, .58, .64],
    dynA: () => outlined(() => heroRig(hx, base, t, G, 'albedo', { pose })),
    lights: [{ x: 4, y: 16, r: 40, i: 1.1 * flick(t, 1), c: WARM }, { x: 76, y: 16, r: 40, i: 1.1 * flick(t, 2), c: WARM }, lanternLight(hx, base, pose, G, t), { x: 40, y: 0, r: 46, i: .55, c: [1, .92, .85] }],
    dynE: () => { flame5(4, 17, t, 3, 1); flame5(76, 17, t, 3, 2); heroRig(hx, base, t, G, 'emissive', { pose, slash }); if (pp === 'victory') for (let k = 0; k < 10; k++) { const an = k / 10 * Math.PI * 2 + t / 600; R(hx + 8 + Math.round(Math.cos(an) * 16), base - 18 + Math.round(Math.sin(an) * 12), 1, 1, '#FFE6B8'); } }
  });
}

/* ================= the keep (map): a tall lit night landscape and the long road to the Vault ================= */
const MW = 192, MH = 300, MSC = 6;
const MAPHIT = { threshold: [70, 206, 52, 62], chambers: [8, 236, 60, 56], armory: [8, 80, 38, 138], reliquary: [128, 92, 54, 124], vault: [138, 48, 52, 74], hearth: [56, 122, 76, 92] };
const MAPORDER = ['threshold', 'chambers', 'armory', 'reliquary', 'vault', 'hearth'];
const MAPSPOT = { threshold: [62, 272], armory: [27, 206], chambers: [39, 290], reliquary: [124, 222], vault: [163, 117] };
const MAPLABEL = { armory: [27, 88, 'up'], reliquary: [156, 218, 'down'], hearth: [86, 140, 'up'], vault: [166, 54, 'up'], chambers: [40, 242, 'up'], threshold: [96, 266, 'down'] };
const MAPNAME = { threshold: 'Threshold', armory: 'Armory', chambers: 'Chambers', reliquary: 'Reliquary', vault: 'Vault' };
const ROAD = [[96, 264], [96, 278], [104, 288], [140, 294], [176, 288], [186, 270], [186, 246], [184, 224], [176, 206], [170, 192], [168, 180], [164, 166], [154, 152], [166, 140], [156, 128], [166, 118], [163, 111]];
const ROADLEN = (() => { let s = 0; for (let i = 0; i < ROAD.length - 1; i++) s += Math.hypot(ROAD[i + 1][0] - ROAD[i][0], ROAD[i + 1][1] - ROAD[i][1]); return s; })();
function roadAt(f) {
  let d = f * ROADLEN;
  for (let i = 0; i < ROAD.length - 1; i++) { const l = Math.hypot(ROAD[i + 1][0] - ROAD[i][0], ROAD[i + 1][1] - ROAD[i][1]); if (d <= l) { const k = l ? d / l : 0; return [Math.round(ROAD[i][0] + (ROAD[i + 1][0] - ROAD[i][0]) * k), Math.round(ROAD[i][1] + (ROAD[i + 1][1] - ROAD[i][1]) * k)]; } d -= l; }
  return ROAD[ROAD.length - 1].slice();
}
const ROADPTS = Array.from({ length: 170 }, (_, i) => roadAt(i / 170));
const LAMPS = [.07, .19, .31, .43, .55, .67, .79, .91].map(roadAt);
const litLamps = () => ['threshold', 'armory', 'chambers', 'reliquary'].filter(beaten).length * 2;
const undercroftLit = () => S.status.chambers === 'restored' ? 3 : S.status.chambers === 'active' ? 1 : 0;
const riverY = x => Math.round(186 + 6 * Math.sin(x / 21) - x * .06);
function pine(x, y, h, c) { for (let i = 0; i < h; i++) { const w = 1 + Math.floor(i / 2.2); R(x - (w >> 1), y - h + i, w, 1, c); } R(x, y, 1, 2, '#2A2018'); }
function mistBand(t, w, y, h, a) { g.fillStyle = '#8C98AE'; for (let k = 0; k < 3; k++) { const span = w + 60, x = ((REDUCED ? k * 40 : t / (230 + k * 80)) + k * 53) % span - 50, yy = y + k * Math.max(1, Math.floor(h / 3)); g.globalAlpha = a; g.fillRect(Math.round(x), yy, 50, 2); g.fillRect(Math.round(x) + 9, yy - 1, 28, 1); } g.globalAlpha = 1; }
function mapSky() {
  const B = ['#0B0B16', '#0E0E1C', '#111122', '#151528', '#19192E', '#1E1C34', '#23203A', '#28243F', '#2E2944', '#332D48'];
  const bh = Math.ceil(172 / B.length); B.forEach((c, i) => R(0, i * bh, MW, bh, c));
  const r = rng(404); for (let i = 0; i < 130; i++) { const x = Math.floor(r() * MW), y = Math.floor(r() * 130), v = r(); R(x, y, 1, 1, v < .2 ? '#F4F0FF' : v < .55 ? '#A8A4C8' : '#6A668A'); }
  for (let k = 24; k > 9; k -= 2) A(.05, () => disc(34, 34, k, '#E0DAC6'));
  disc(34, 34, 9, '#F2ECD8'); R(29, 31, 3, 2, '#D6CFBA'); R(35, 37, 3, 2, '#D6CFBA'); R(37, 29, 2, 2, '#D6CFBA'); R(30, 38, 2, 1, '#D6CFBA');
  for (let x = 0; x < MW; x++) { const h = 44 + Math.round(16 * Math.sin(x / 23 + 1) + 9 * Math.sin(x / 9.3) + 5 * Math.sin(x / 4.1)); R(x, 160 - h, 1, h + 12, '#2A2A46'); if (h > 58) R(x, 160 - h, 1, 2, '#58587A'); }
  for (let x = 0; x < MW; x++) { const h = 28 + Math.round(12 * Math.sin(x / 17 + 3) + 6 * Math.sin(x / 6.9 + 1)); R(x, 170 - h, 1, h + 12, '#20203A'); }
}
function mapAlb() {
  const L = S.status, rr = rng(505);
  for (let y = 150; y < 218; y++) R(0, y, MW, 1, y < 168 ? '#2A302E' : y < 190 ? '#2E3430' : '#323632');
  for (let i = 0; i < 160; i++) R(Math.floor(rr() * MW), 152 + Math.floor(rr() * 64), 1 + Math.floor(rr() * 3), 1, rr() < .5 ? '#262C2A' : '#3A403A');
  for (let x = 0; x < MW; x++) { const y = riverY(x); R(x, y, 1, 5, '#34465A'); R(x, y, 1, 1, '#5A7290'); R(x, y + 5, 1, 1, '#1E2826'); }
  for (let i = 0; i < 70; i++) { const x = Math.floor(rr() * 74), y = 158 + Math.floor(rr() * 24); pine(x, y, 7 + Math.floor(rr() * 6), rr() < .5 ? '#1E2A24' : '#26342C'); }
  for (let i = 0; i < 44; i++) { const x = 112 + Math.floor(rr() * 80), y = 170 + Math.floor(rr() * 26); if (Math.abs(x - 168) < 7 || Math.abs(y - riverY(x) - 2) < 4) continue; pine(x, y, 6 + Math.floor(rr() * 6), rr() < .5 ? '#1E2A24' : '#26342C'); }
  R(78, 158, 3, 14, '#4E4A54'); R(92, 160, 3, 12, '#4E4A54'); for (let i = 0; i <= 14; i++) R(79 + i, 158 - Math.round(Math.sin(i / 14 * Math.PI) * 6), 1, 2, '#4E4A54'); R(100, 166, 2, 6, '#4A4650'); R(104, 168, 5, 4, '#423E48'); R(62, 170, 4, 3, '#4A4650');
  for (let x = 128; x < MW; x++) { const top = Math.round(56 + Math.pow(Math.abs(x - 166) / 26, 1.6) * 34 + 3 * Math.sin(x / 3)); R(x, top, 1, 172 - top, '#30324A'); R(x, top, 1, 1, '#4E5070'); }
  for (let i = 0; i < 90; i++) R(130 + Math.floor(rr() * 62), 66 + Math.floor(rr() * 100), 1 + Math.floor(rr() * 3), 1, rr() < .5 ? '#282A40' : '#3C3E5A');
  R(150, 80, 27, 30, '#40425C'); R(148, 78, 31, 3, '#5E607E'); for (let i = 0; i < 7; i++) R(163 - i * 2 - 1, 71 + i, i * 4 + 3, 1, i === 6 ? '#5E607E' : '#4C4E6A');
  for (const px of [152, 157, 168, 173]) { R(px, 81, 2, 28, '#5C5E7A'); R(px, 81, 1, 28, '#70728E'); }
  rArch(163, 100, 5, 109, '#16141E'); if (vaultOpen()) rArch(163, 100, 4, 109, '#7A4A24'); else { R(162, 96, 3, 13, '#2A2434'); disc(163, 103, 2, '#8E2F23'); }
  R(146, 109, 35, 2, '#4E5070'); for (let i = 0; i < 4; i++) R(148 - i * 2, 111 + i * 2, 31 + i * 4, 2, i % 2 ? '#3E4058' : '#46486A');
  for (let x = 0; x < MW; x++) { const top = Math.round(204 - 5 * Math.sin(x / 14) - 4 * Math.sin(x / 5.1) + (x < 10 || x > 182 ? 8 : 0)); R(x, top, 1, MH - top, '#4A4240'); R(x, top, 1, 1, '#6A605A'); }
  for (let i = 0; i < 340; i++) { const x = Math.floor(rr() * MW), y = 210 + Math.floor(rr() * 90), v = rr(); R(x, y, 1 + Math.floor(v * 4), 1, v < .5 ? '#3A3432' : '#5A524E'); }
  for (let i = 0; i < 16; i++) { let px = Math.floor(rr() * MW), py = 214 + Math.floor(rr() * 60); for (let k = 0; k < 10; k++) { R(px, py, 1, 2, '#2E2826'); px += Math.floor(rr() * 3) - 1; py += 2; } }
  moss(0, 205, MW, 708);
  blocks(10, 196, 172, 20, PALS.gate, 606, 8, 4); for (let x = 10; x < 182; x += 6) { R(x, 192, 4, 4, PALS.gate.b); R(x, 192, 4, 1, PALS.gate.l); }
  for (let i = 0; i < ROAD.length - 1; i++) { const [x0, y0] = ROAD[i], [x1, y1] = ROAD[i + 1], n = Math.ceil(Math.hypot(x1 - x0, y1 - y0)); for (let k = 0; k <= n; k++) { const x = Math.round(x0 + (x1 - x0) * k / n), y = Math.round(y0 + (y1 - y0) * k / n), far = y < 205; R(x - (far ? 1 : 2), y - 1, far ? 3 : 5, 3, '#3E3632'); R(x - (far ? 0 : 1), y - 1, far ? 1 : 3, 2, far ? '#6A6058' : '#7E7062'); } }
  R(163, 177, 1, 13, '#9A8E84'); R(173, 177, 1, 13, '#9A8E84'); R(163, 177, 11, 1, '#9A8E84'); R(163, 189, 11, 2, '#3A3432');
  const lit = litLamps(); LAMPS.forEach(([x, y], i) => { R(x + 3, y - 7, 1, 7, '#2A2624'); R(x + 2, y - 10, 3, 3, i < lit ? '#FFC27A' : '#2E2826'); R(x + 2, y - 11, 3, 1, '#4A4644'); });
  blocks(14, 118, 26, 98, PALS.tower, 611, 6, 4); R(14, 118, 1, 98, PALS.tower.l); R(39, 118, 1, 98, PALS.tower.m);
  R(12, 116, 30, 3, '#8E8894'); for (let x = 12; x < 42; x += 5) { R(x, 113, 3, 4, '#8E8894'); R(x, 113, 3, 1, '#A8A2AE'); }
  for (let i = 0; i < 23; i++) { const w = Math.max(1, Math.round(i * 1.25)); R(27 - (w >> 1), 90 + i, w, 1, i % 3 === 0 ? '#3A3448' : '#4A4258'); R(27 - (w >> 1), 90 + i, 1, 1, '#6A6280'); }
  R(27, 83, 1, 7, '#6C6864');
  const aLit = L.armory === 'restored';
  for (const wy of [132, 150, 168, 186]) { R(24, wy - 1, 6, 1, '#A8A2AE'); R(25, wy, 4, 6, aLit ? '#E8A050' : '#141018'); R(26, wy, 1, 6, aLit ? '#B87030' : '#0A080C'); }
  R(112, 128, 7, 32, '#6E625A'); R(112, 128, 1, 32, '#8A7E74'); R(111, 126, 9, 3, '#8A7E74');
  blocks(60, 166, 68, 50, PALS.chapel, 612, 7, 4);
  for (let y = 138; y < 168; y++) { const hw = Math.round((y - 138) * 1.2); R(94 - hw, y, hw * 2 + 1, 1, y % 4 === 0 ? '#3A3448' : '#4A4258'); R(94 - hw, y, 1, 1, '#6A6280'); R(94 + hw, y, 1, 1, '#2A2436'); }
  R(94, 132, 1, 6, '#6C6864');
  const hLit = S.hearth.done;
  for (const wx of [73, 91, 109]) { pArch(wx, 184, 3, 202, '#A89A8C'); pArch(wx, 184, 2, 202, hLit ? '#F0B050' : '#C8803A'); R(wx, 180, 1, 22, '#2A2018'); }
  for (const bx of [134, 175]) R(bx, 168, 3, 48, '#7A6E66');
  blocks(136, 156, 40, 60, PALS.chapel, 613, 7, 4);
  for (let y = 134; y < 158; y++) { const hw = y - 134; R(156 - hw, y, hw * 2 + 1, 1, y % 4 === 0 ? '#3A3448' : '#4A4258'); R(156 - hw, y, 1, 1, '#6A6280'); }
  for (let i = 0; i < 34; i++) { const w = 1 + Math.floor(i / 5); R(156 - (w >> 1), 101 + i, w, 1, i % 4 === 0 ? '#5A5470' : '#6A6480'); }
  R(156, 96, 1, 5, '#9A8A5A'); disc(156, 95, 1, '#C9A24A');
  const rLit = L.reliquary === 'restored';
  disc(156, 176, 8, '#A89A8C'); disc(156, 176, 6, rLit ? '#C8A050' : '#141220');
  if (rLit) for (let a = 0; a < 8; a++) { const an = a / 8 * Math.PI * 2; R(156 + Math.round(Math.cos(an) * 4), 176 + Math.round(Math.sin(an) * 4), 1, 1, ['#D2482E', '#4E74C8', '#F0C040', '#5E9A50'][a % 4]); }
  for (let a = 0; a < 4; a++) { const an = a / 4 * Math.PI; for (let k = -5; k <= 5; k++) R(156 + Math.round(Math.cos(an) * k), 176 + Math.round(Math.sin(an) * k), 1, 1, '#A89A8C'); }
  for (const wx of [143, 169]) { pArch(wx, 196, 2, 210, '#A89A8C'); pArch(wx, 196, 1, 210, rLit ? '#E8A050' : '#141018'); }
  for (const tx of [74, 106]) { blocks(tx, 214, 13, 50, PALS.gate, 614 + tx, 6, 4); for (let x = tx; x < tx + 13; x += 4) { R(x, 210, 3, 4, PALS.gate.b); R(x, 210, 3, 1, PALS.gate.l); } R(tx + 5, 226, 2, 5, '#120E0C'); R(tx + 1, 207, 11, 3, '#4A4644'); }
  blocks(87, 222, 19, 42, PALS.gate, 620, 6, 4); for (let x = 87; x < 106; x += 4) { R(x, 218, 3, 4, PALS.gate.b); R(x, 218, 3, 1, PALS.gate.l); }
  const tLit = L.threshold === 'restored';
  rArch(96, 248, 8, 264, '#4A4038'); rArch(96, 248, 7, 264, '#A89A8C'); rArch(96, 248, 6, 264, tLit ? '#8A6440' : '#0E0A08');
  if (!tLit) for (let x = 91; x < 102; x += 2) R(x, 242, 1, 22, '#4A4644'); else { R(90, 240, 13, 2, '#4A4644'); for (let x = 91; x < 102; x += 2) R(x, 242, 1, 3, '#4A4644'); }
  if (tLit) { banner5(77, 236, 6, 14, '#9A3530'); banner5(109, 236, 6, 14, '#9A3530'); }
  const cl = undercroftLit();
  R(12, 244, 56, 36, '#5A524C'); R(12, 244, 56, 1, '#7A706A'); R(12, 279, 56, 1, '#3A3432');
  for (let i = 0; i < 6; i++) R(14 + i * 9, 246, 1, 33, '#4E4642');
  [22, 39, 56].forEach((cx, i) => { pArch(cx, 262, 6, 279, '#6E665E'); pArch(cx, 262, 4, 279, i < cl ? '#D88A3A' : '#0A0808'); });
  for (let i = 0; i < 9; i++) R(62 + (i % 2), 217 + i * 3, 7, 2, '#7A6E66');
  pine(5, MH, 28, '#0C100E'); pine(13, MH, 18, '#101612'); pine(187, MH, 26, '#0C100E'); pine(178, MH, 16, '#101612');
}
function mapA(t) {
  for (let i = 0; i < 8; i++) R(28 + i, 84 + (REDUCED ? 0 : Math.round(Math.sin(t / 240 + i / 2))), 1, i > 5 ? 2 : 3, i % 3 === 0 ? '#7A2A26' : '#9A3530');
  for (let i = 0; i < 6; i++) R(157 + i, 97 + (REDUCED ? 0 : Math.round(Math.sin(t / 260 + i / 2))), 1, 2, '#3E5A88');
}
function mapLights(t) {
  const L = S.status, cl = undercroftLit(), lit = litLamps(), sp = MAPSPOT[S.region], Ls = [{ x: 34, y: 34, r: 240, i: .3, c: COOL }];
  if (L.armory === 'restored') Ls.push({ x: 27, y: 160, r: 40, i: .9 * flick(t, 2), c: WARM });
  Ls.push({ x: 91, y: 192, r: 44, i: (S.hearth.done ? 1.2 : .65) * flick(t, 9), c: WARM });
  if (L.reliquary === 'restored') Ls.push({ x: 156, y: 180, r: 36, i: .9, c: GOLD });
  if (L.threshold === 'restored') Ls.push({ x: 96, y: 236, r: 40, i: flick(t, 1), c: WARM }, { x: 80, y: 206, r: 18, i: .8 * flick(t, 3), c: WARM }, { x: 112, y: 206, r: 18, i: .8 * flick(t, 4), c: WARM });
  if (cl) Ls.push({ x: 39, y: 270, r: 16 + cl * 8, i: .95 * flick(t, 3), c: WARM });
  if (vaultOpen()) Ls.push({ x: 163, y: 104, r: 30, i: flick(t, 5), c: WARM });
  LAMPS.forEach(([x, y], i) => { if (i < lit) Ls.push({ x: x + 3, y: y - 9, r: 14, i: .85 * flick(t, i), c: WARM }); });
  Ls.push({ x: sp[0], y: sp[1] - 8, r: 22, i: .95 * flick(t, 6), c: WARM });
  return Ls;
}
function mapE(t) {
  const L = S.status, cl = undercroftLit(), lit = litLamps();
  g.fillStyle = '#B8BCD8';
  for (let k = 0; k < 5; k++) { const span = MW + 90, x = ((REDUCED ? k * 45 : t / (900 + k * 260)) + k * 61) % span - 70, y = 14 + k * 16; g.globalAlpha = .09 + .03 * (k % 2); g.fillRect(Math.round(x), y, 48, 2); g.fillRect(Math.round(x) + 8, y - 1, 26, 1); g.fillRect(Math.round(x) + 14, y + 2, 30, 1); }
  g.globalAlpha = 1;
  if (!REDUCED) for (let k = 0; k < 5; k++) { const cxB = k < 3 ? 156 : 27, cyB = k < 3 ? 112 : 98, an = t / (700 + k * 130) + k * 2, bx = Math.round(cxB + Math.cos(an) * (9 + k * 3)), by = Math.round(cyB + Math.sin(an) * 5), f = Math.floor(t / 120 + k) % 2; R(bx - 1, by - f, 1, 1, '#08080E'); R(bx + 1, by - f, 1, 1, '#08080E'); R(bx, by, 1, 1, '#08080E'); }
  if (L.armory === 'restored') for (const wy of [132, 150, 168, 186]) bloom(27, wy + 3, 3, '#FFB060', .55 * flick(t, wy));
  for (const wx of [73, 91, 109]) bloom(wx, 192, 4, '#FF9A45', (S.hearth.done ? .7 : .35) * flick(t, wx));
  if (L.reliquary === 'restored') bloom(156, 176, 7, '#F0C040', .6 * flick(t, 4));
  if (L.threshold === 'restored') { flame5(80, 207, t, 2, 1); flame5(112, 207, t, 2, 2); bloom(96, 252, 6, '#FF9A45', .4); }
  [22, 39, 56].forEach((cx, i) => { if (i < cl) bloom(cx, 270, 5, '#FF9A45', .6 * flick(t, i + 3)); });
  if (vaultOpen()) bloom(163, 104, 6, '#FFA552', .7 * flick(t, 5));
  else if (REDUCED || t % 5200 > 160) { R(161, 100, 1, 1, '#B4CCE6'); R(164, 100, 1, 1, '#B4CCE6'); bloom(162, 100, 3, '#9FB4C8', .5); }
  if (S.hearth.done && !REDUCED) { for (let k = 0; k < 7; k++) { const a = ((t / 1600) + k / 7) % 1, x = 115 + Math.round(a * 14 + Math.sin(a * 6 + k) * 2), y = 124 - Math.round(a * 34); g.globalAlpha = .4 * (1 - a); R(x, y, 2 + Math.round(a * 3), 2, '#9AA0B0'); } g.globalAlpha = 1; }
  if (!REDUCED) { for (let k = 0; k < 12; k++) { const x = (Math.floor(t / 90) * 7 + k * 23) % MW, y = riverY(x) + 1 + (k % 3); g.globalAlpha = .5; R(x, y, 2, 1, '#C8D8F0'); } g.globalAlpha = 1; }
  if (!REDUCED) { for (let k = 0; k < 8; k++) { const ph = (t / 1000 + k * .37) % 3; if (ph < 1.2) { g.globalAlpha = Math.sin(ph / 1.2 * Math.PI) * .9; R(6 + ((k * 37) % 66), 162 + ((k * 13) % 20), 1, 1, '#E8F0A0'); } } g.globalAlpha = 1; }
  LAMPS.forEach(([x, y], i) => { if (i < lit) { R(x + 2, y - 10, 3, 3, '#FFD890'); bloom(x + 3, y - 9, 4, '#FFB060', .7 * flick(t, i)); } });
  const n = Math.round(ROADPTS.length * lit / 8 * .96);
  for (let i = 0; i < n; i += 2) { const [x, y] = ROADPTS[i], ph = REDUCED ? 1 : .5 + .5 * Math.sin(t / 260 - i / 4); g.globalAlpha = .3 + .45 * ph; R(x, y, 1, 1, '#FFB060'); }
  g.globalAlpha = 1;
  if (L.reliquary === 'dark') { for (let k = 0; k < 4; k++) A(.14, () => disc(156, 168, 40 - k * 8, '#07060C')); mistBand(t, MW, 150, 30, .1); }
  if (!vaultOpen()) for (let k = 0; k < 3; k++) A(.1, () => disc(163, 92, 30 - k * 8, '#07060C'));
  mistBand(t, MW, 150, 14, .08); mistBand(t + 7000, MW, 198, 10, .07); mistBand(t + 3000, MW, 284, 12, .1);
  const sp = MAPSPOT[S.region], bob = REDUCED ? 0 : Math.floor(t / 400) % 2, pulse = REDUCED ? .6 : .45 + .35 * Math.sin(t / 300);
  g.globalAlpha = pulse; for (let a = 0; a < 24; a++) { const an = a / 24 * Math.PI * 2; R(sp[0] + Math.round(Math.cos(an) * 8), sp[1] + Math.round(Math.sin(an) * 3), 1, 1, '#FFA552'); } g.globalAlpha = 1;
  sprite(MINIHERO, sp[0] - 5, sp[1] - 13, miniPal(), false);
  R(sp[0] - 1, sp[1] - 20 - bob, 3, 3, '#FFA552'); R(sp[0], sp[1] - 21 - bob, 1, 5, '#FFA552'); R(sp[0] - 2, sp[1] - 19 - bob, 5, 1, '#FFA552'); bloom(sp[0], sp[1] - 19 - bob, 4, '#FFA552', .7);
}
function drawMap(ctx, t) {
  const key = 'map7|' + JSON.stringify(S.status) + vaultOpen() + S.hearth.done + litLamps();
  renderLit(ctx, MW, MH, MSC, { sky: ['map7sky', mapSky], alb: [key, mapAlb], amb: [.6, .64, .84], lights: mapLights(t), dynA: () => mapA(t), dynE: () => mapE(t) });
}
