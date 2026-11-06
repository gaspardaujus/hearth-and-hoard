'use strict';
/* ================= game state and rules ================= */
let S, tab = 'sanctuary', sub = null, mapRegion = null, sheetCtx = null, moments = [], toastT, talkStep = -1, typer = null, gearSlot = 'head', previewPose = 'idle';
let moveTab = null; const moveIdx = { finish: 0, quest: 0, upkeep: 0 };
let cardHold = 0, nextUpAt = -1e9, mapAnim = '', arriveAnim = false, quietXP = false;
let cheer = -1e9, petAt = -1e9, activeAnim = -1e9, floatMsg = null, lastHit = null, cut = null;
let heroAct = { kind: null, at: -1e9 }, bossAct = { kind: null, at: -1e9 }, wardAt = -1e9, flashAt = -1e9, shakeUntil = 0, shakeAmp = 0, hitStopUntil = 0;

function applyFonts() {
  const st = document.documentElement.style, h = FONTS_H[S.font.h] || FONTS_H.grenze, b = FONTS_B[S.font.b] || FONTS_B.barlow;
  st.setProperty('--f-display', h[1]); st.setProperty('--w-display', h[2]); st.setProperty('--f-ui', b[1]);
}

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const age = d => d === 0 ? 'today' : d === 1 ? '1 day' : d + ' days';
const ago = d => d === 0 ? 'today' : d === 1 ? 'yesterday' : d + ' days ago';

/* real dates: progress stores timestamps; days are worked out from today */
const DAY = 864e5;
const dayStart = ts => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
const daysSince = ts => ts == null ? 0 : Math.max(0, Math.round((dayStart(Date.now()) - dayStart(ts)) / DAY));
function weekStart(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return d.getTime(); }
const bDays = b => daysSince(b.state === 'gone' ? b.goneAt : b.touchedAt || (b.state === 'staged' ? b.stagedAt : b.sortedAt));
const uDays = u => u.lastDone ? daysSince(u.lastDone) : null;
const uLate = u => { const d = uDays(u); return d == null ? 1e3 : d - (u.every || 1); };
const everyText = n => n <= 1 ? 'daily' : n === 7 ? 'weekly' : n === 14 ? 'every two weeks' : 'every ' + n + ' days';

const need = () => S.level * 30;
const findQ = id => S.quests.find(q => q.id === id);
const findB = id => S.batches.find(b => b.id === id);

/* bosses: every region has milestones. "allgone" ticks itself once departures for the region have left and none
   are waiting; when nothing from the region needs to leave, it ticks along with the last hand-ticked milestone, so a
   fresh boss never starts with a free milestone. "onegone" ticks once at least one departure for the region has left. */
const msOf = rg => (S.bosses[rg] && S.bosses[rg].ms) || [];
const blockers = rg => S.batches.filter(b => b.boss === rg && b.state !== 'gone');
const anyGone = rg => S.batches.some(b => b.boss === rg && b.state === 'gone');
const msDone = (m, rg) => m.auto === 'allgone' ? blockers(rg).length === 0 && (anyGone(rg) || msOf(rg).every(x => x.auto || x.done)) : m.auto === 'onegone' ? anyGone(rg) : !!m.done;
const metOf = rg => msOf(rg).filter(m => msDone(m, rg)).length;
const msTotal = rg => Math.max(1, msOf(rg).length);
const met4 = rg => Math.min(4, Math.round(metOf(rg) * 4 / msTotal(rg)));
const warded = rg => S.status[rg] === 'active' && msOf(rg).some(m => m.auto === 'allgone') && blockers(rg).length > 0;
const titleFor = lv => TITLES.filter(t => t[0] <= lv).pop()[1];
const beaten = r => S.status[r] === 'restored';
const vaultOpen = () => S.status.vault === 'active' || S.status.vault === 'restored';
const progressOf = rg => S.status[rg] === 'restored' ? 1 : S.status[rg] === 'active' ? metOf(rg) / msTotal(rg) : 0;
const statusWord = rg => ({ restored: 'Reclaimed', active: 'In progress', dark: 'Sealed', locked: 'Sealed' }[S.status[rg]] || 'Sealed');
const bossLive = rg => S.status[rg] === 'active';
const nextRegion = rg => ORDER[ORDER.indexOf(rg) + 1] || null;

/* campaign names come from the player's campaign; art, relics and short boss names stay in code */
function applyNames() {
  ORDER.forEach(k => {
    const d = REGION_DEFAULTS[k], r = (S.regions && S.regions[k]) || {};
    Object.assign(REGIONS[k], { name: r.name || d.name, place: r.place || d.place, short: r.short || d.short, boss: r.boss || d.boss, target: r.target || '' });
    if (r.boss && r.boss !== d.boss) delete REGIONS[k].bossShort; else if (d.bossShort) REGIONS[k].bossShort = d.bossShort;
  });
}

function unlocked(it) { const r = it.req; if (!r) return true; if (r.lvl) return S.level >= r.lvl; return beaten(r.boss); }
function reqText(it) { const r = it.req; if (!r) return 'Starting gear'; if (r.lvl) return 'Reach level ' + r.lvl; return 'Defeat ' + REGIONS[r.boss].boss; }
function curGear() { const o = {}; SLOTS.forEach(s => { let it = GEAR[s].find(i => i.id === S.gear[s]); if (!it || !unlocked(it)) it = GEAR[s][0]; o[s] = it; }); return o; }
function gearWith(slot, id) { const o = curGear(); o[slot] = GEAR[slot].find(i => i.id === id); return o; }
function unlockedIds() { const a = []; SLOTS.forEach(s => GEAR[s].forEach(i => { if (unlocked(i)) a.push(s + ':' + i.id); })); return a; }
function gearItem(key) { const [s, id] = key.split(':'); return { s, it: GEAR[s].find(i => i.id === id) }; }
function activeSet(G) { for (const id in SETS) { const sl = SETS[id].slots; if (Object.keys(sl).every(k => G[k].id === sl[k])) return id; } return null; }
function nextUnlock() {
  const L = [], here = ORDER.indexOf(S.region);
  SLOTS.forEach(s => GEAR[s].forEach(it => { if (!unlocked(it)) L.push({ s, it, o: it.req.lvl ? it.req.lvl : S.level + .5 + Math.max(0, ORDER.indexOf(it.req.boss) - here) * 2 }); }));
  L.sort((a, b) => a.o - b.o); return L[0];
}
const catImg = (scale, coat, alt) => img(CATFACE, scale, { pal: coatPal(coat || S.cat.coat), pid: 'cat-' + (coat || S.cat.coat), alt: alt || '' });
