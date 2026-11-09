'use strict';
/* ================= the Ledger of Release: what has left the house, rank seals and treats =================
   Counts come from departures marked gone. Each departure has a quantity, and a sold one can carry its sale price.
   Each destination has a rank seal that levels up at 1, 10, 25, 50, 100 and 250 things. A seal once earned stays
   earned, even if a count is corrected later. Treats unlock by beating a boss, reaching a level or earning a seal. */
const DEST_INFO = {
  Donate: { label: 'Donated', rank: 'Almsgiver', verb: 'donated', icon: 'donate', line: 'The almoners ring the gate bell for you.' },
  Sell: { label: 'Sold', rank: 'Merchant', verb: 'sold', icon: 'sell', line: 'Coin clinks into the keep’s coffers.' },
  'Pass along': { label: 'Passed along', rank: 'Messenger', verb: 'passed along', icon: 'pass', line: 'Your things found new hands down the long road.' },
  Recycle: { label: 'Recycled', rank: 'Smith', verb: 'recycled', icon: 'recycle', line: 'The forge takes it back and makes it new.' },
  Trash: { label: 'Thrown away', rank: 'Pyrekeeper', verb: 'thrown away', icon: 'trash', line: 'The pyre burns higher. Less to carry.' }
};
const SEAL_AT = [1, 10, 25, 50, 100, 250];
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];
/* a wax seal (12x12) and the emblems pressed into it (8x8, drawn in one colour) */
const SEAL_RING = ['...RRRRR....', '..RRRRRRRR..', '.RRrRRRRRRR.', '.RrRRRRRRRRR', 'RRRRRRRRRRRR', 'RRRRRRRRRRRR', 'RRRRRRRRRRRR', 'RRRRRRRRRRRR', '.RRRRRRRRRRR', '.RRRRRRRRRR.', '..RRRRRRRR..', '...RRRR.R...'];
const DEST_ICON = {
  donate: ['.YY.YY..', 'YYYYYYY.', '.YYYYY..', '..YYY...', '...Y....', 'Y.....Y.', 'YYYYYYY.', '.YYYYY..'],
  sell: ['..Y..Y..', '...YY...', '..YYYY..', '.YYYYYY.', 'YYY..YYY', 'YYYYYYYY', 'YYYYYYYY', '.YYYYYY.'],
  pass: ['........', 'YYYYYYYY', 'YY....YY', 'Y.Y..Y.Y', 'Y..YY..Y', 'Y......Y', 'YYYYYYYY', '........'],
  recycle: ['........', 'YYYYYYY.', '.YYYYYYY', '..YYYY..', '...YY...', '..YYYY..', '.YYYYYY.', '........'],
  trash: ['...Y....', '...YY...', '..YYY.Y.', '.YYYYYY.', '.YY.YYY.', 'YY...YYY', 'YY...YY.', '.YYYYY..']
};
function sealArt(dest, scale, dim) {
  const s = 12 * scale;
  return '<span class="waxseal" style="width:' + s + 'px;height:' + s + 'px" aria-hidden="true">' + img(SEAL_RING, scale, { mono: dim ? '#3A332F' : null }) +
    '<span class="emb" style="left:' + 2 * scale + 'px;top:' + 2 * scale + 'px">' + img(DEST_ICON[DEST_INFO[dest].icon], scale, { mono: dim ? '#5A4E45' : '#F0DDA0' }) + '</span></span>';
}

const qtyOf = b => Math.max(1, (b && b.qty) | 0 || 1);
const money = v => '$' + (+v).toLocaleString(undefined, { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
const things = n => n + (n === 1 ? ' thing' : ' things');
/* totals of everything gone, optionally only since a time */
function tallyOf(batches, since) {
  const by = {}; DESTS.forEach(d => { by[d] = 0; });
  let total = 0, departures = 0, coin = 0;
  (batches || []).forEach(b => {
    if (!b || b.state !== 'gone' || (since && (b.goneAt || 0) < since)) return;
    const n = qtyOf(b), d = by[b.dest] !== undefined ? b.dest : 'Donate';
    by[d] += n; total += n; departures++;
    if (b.dest === 'Sell' && b.value > 0) coin += +b.value;
  });
  return { by, total, departures, coin: Math.round(coin * 100) / 100 };
}
const tierFor = n => SEAL_AT.filter(x => n >= x).length;
const sealName = (dest, tier) => DEST_INFO[dest].rank + ' ' + ROMAN[tier];
const sealTier = (dest, t) => Math.max((S.seals && S.seals[dest]) || 0, tierFor((t || tallyOf(S.batches)).by[dest]));
function sealsFrom(batches) { const t = tallyOf(batches), s = {}; DESTS.forEach(d => { s[d] = tierFor(t.by[d]); }); return s; }
/* the seal closest to being earned */
function nextSeal(t) {
  let best = null;
  DESTS.forEach(d => {
    const tier = sealTier(d, t); if (tier >= SEAL_AT.length) return;
    const at = SEAL_AT[tier], n = t.by[d], left = at - n, from = tier ? SEAL_AT[tier - 1] : 0;
    if (left <= 0) return;
    if (!best || left < best.left) best = { dest: d, tier: tier + 1, at, n, left, pct: Math.max(0, Math.min(100, Math.round((n - from) / (at - from) * 100))) };
  });
  return best;
}
/* record seals newly earned and return their reward moments (one per destination that ranked up) */
function awardSeals() {
  const t = tallyOf(S.batches), up = [];
  if (!S.seals) S.seals = {};
  DESTS.forEach(d => {
    const was = S.seals[d] || 0, now = tierFor(t.by[d]);
    if (now <= was) return;
    S.seals[d] = now; up.push({ d, was, now });
    logEvent('seal', { dest: d, tier: now });
  });
  if (!up.length) return [];
  const tr = unlockTreats();
  save();
  return up.map((s, i) => ({ sealArt: s.d, eyebrow: s.now - s.was > 1 ? (s.now - s.was) + ' seals at once' : 'Seal earned', title: sealName(s.d, s.now),
    body: things(t.by[s.d]) + ' ' + DEST_INFO[s.d].verb + '. ' + DEST_INFO[s.d].line,
    lines: (s.now < SEAL_AT.length ? ['<span class="t">Next: ' + esc(sealName(s.d, s.now + 1)) + ' at ' + SEAL_AT[s.now] + '</span>'] : ['<span class="t">The highest seal of all</span>']).concat(i === 0 ? tr.map(treatLine) : []),
    sound: 'level' }));
}

/* ---- treats ---- */
function treatUnlockOf(t) {   // reads either the old form {boss} or {unlock: {kind, ...}}
  const u = t && t.unlock;
  if (u && u.kind === 'level' && u.level >= 1) return { kind: 'level', level: Math.round(u.level) };
  if (u && u.kind === 'seal' && DESTS.includes(u.dest)) return { kind: 'seal', dest: u.dest, tier: Math.min(SEAL_AT.length, Math.max(1, u.tier | 0)) };
  const boss = u && u.kind === 'boss' ? u.boss : t && t.boss;
  return ORDER.includes(boss) ? { kind: 'boss', boss } : null;
}
function treatMetIn(t, st) {
  const u = t.unlock || {};
  if (u.kind === 'level') return st.level >= u.level;
  if (u.kind === 'seal') return ((st.seals && st.seals[u.dest]) || 0) >= u.tier;
  return !!(st.status && st.status[u.boss] === 'restored');
}
const treatMet = t => treatMetIn(t, S);
/* mark treats whose condition just came true; returns them so the reward moment can list them */
function unlockTreats() { const fresh = []; S.treats.forEach(t => { if (!t.unlockedAt && treatMet(t)) { t.unlockedAt = Date.now(); fresh.push(t); } }); return fresh; }
const treatLine = t => '<span class="r">Treat unlocked: ' + esc(t.text) + '</span>';
function treatNeed(t) {
  const u = t.unlock || {}, met = treatMet(t);
  if (u.kind === 'level') return met ? 'Earned at level ' + u.level : 'Reach level ' + u.level + ' · you are level ' + S.level;
  if (u.kind === 'seal') { const n = tallyOf(S.batches).by[u.dest]; return met ? 'Earned with ' + sealName(u.dest, u.tier) : 'Earn ' + sealName(u.dest, u.tier) + ' · ' + SEAL_AT[u.tier - 1] + ' ' + DEST_INFO[u.dest].verb + ' (' + n + ' so far)'; }
  return (met ? 'Earned: defeated ' : 'Defeat ') + REGIONS[u.boss].boss;
}

/* ---- the panel on the Character tab ---- */
function ledgerPanel() {
  const t = tallyOf(S.batches), wk = tallyOf(S.batches, weekStart(Date.now())), nx = nextSeal(t);
  let h = '<section class="panel ember ledger" id="ledger" aria-label="The Ledger of Release"><div class="eyebrow ember">The Ledger of Release</div>' +
    '<h2 class="display h-sm">' + (t.total ? things(t.total) + ' gone' : 'Nothing gone yet') + '</h2>' +
    '<p class="small muted">' + (t.total ? wk.total + ' this week · ' + t.departures + (t.departures === 1 ? ' departure' : ' departures') + (t.coin ? ' · ' + money(t.coin) + ' from sales' : '') : 'Everything that leaves the house is written here. The first of each kind earns a seal.') + '</p><ul class="lrows">';
  DESTS.forEach(d => {
    const n = t.by[d], tier = sealTier(d, t);
    h += '<li class="lrow' + (tier ? ' on' : '') + '">' + sealArt(d, 3, !tier) + '<div class="lname"><b>' + DEST_INFO[d].label + '</b><small>' + (tier ? esc(sealName(d, tier)) : 'No seal yet') + '</small></div><span class="lcount">' + n + '</span></li>';
  });
  h += '</ul>';
  if (nx) h += '<div class="lnext"><div class="small"><span class="muted">Next seal:</span> <b>' + esc(sealName(nx.dest, nx.tier)) + '</b> · ' + nx.left + ' more ' + DEST_INFO[nx.dest].verb + ' <span class="muted">(' + nx.n + ' of ' + nx.at + ')</span></div><div class="xpbar" role="progressbar" aria-label="Progress to the next seal" aria-valuenow="' + nx.pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + nx.pct + '%"></span></div></div>';
  else h += '<p class="small">Every seal is yours. The keep remembers.</p>';
  return h + '</section>';
}
/* a sold departure asks what it went for before it is marked gone */
function finishDeparture(b) { if (!b) return; if (b.dest === 'Sell') salePrompt(b); else gone(b); }
function salePrompt(b) {
  openSheet('<h2 id="sheet-title" class="display h-sm">Sold! What did it go for?</h2><p class="small muted">' + esc(b.name) + '. Optional: the coin goes in the Ledger of Release.</p>' +
    '<label class="field" for="bval">Sale price ($)<input id="bval" type="number" inputmode="decimal" min="0" step="0.01" placeholder="0" autocomplete="off"></label>' +
    '<div class="row"><button class="btn primary" data-act="sale-save">Save and mark gone</button><button class="btn" data-act="sale-skip">Skip</button></div>', { b: b.id });
}
const priceOf = el => { const v = parseFloat(el && el.value); return v >= 0 ? Math.round(v * 100) / 100 : null; };
