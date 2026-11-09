'use strict';
/* ================= views ================= */
function topbar() {
  const pct = Math.round(S.xp / need() * 100);
  return '<div class="top-row"><div class="brand">Hearth <span>&amp;</span> Hoard</div><div class="tb-btns"><button class="mini" data-act="sound" aria-pressed="' + S.sound + '" aria-label="Sound effects">' + (S.sound ? 'Sound' : 'Muted') + '</button><button class="mini" data-act="guide">Guide</button></div></div>' +
    '<div class="lvl"><span><b>Lv ' + S.level + '</b> · ' + esc(titleFor(S.level)) + '</span><div class="xpbar" role="progressbar" aria-label="Experience toward next level" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + pct + '%"></span></div><span class="nums">' + S.xp + '/' + need() + '</span></div>';
}
function bossBar(rg) {
  const tot = msTotal(rg), met = metOf(rg), live = S.status[rg] === 'active' || (cut && cut.rg === rg);
  if (rg === 'vault' && !live) return '<div class="bossbar"><div class="bb-top"><span class="bb-name">' + esc(REGIONS.vault.boss) + '</span><span class="bb-tag">' + (S.status.vault === 'restored' ? 'At rest' : 'Sealed') + '</span></div></div>';
  if (!live) return '';
  const rem = tot - met, wd = warded(rg), now = performance.now(), just = lastHit && lastHit.rg === rg && now - lastHit.at < 1500 ? lastHit.idx : -1;
  const tag = wd ? 'Warded' : rg === 'vault' ? 'Phase ' + Math.min(tot, met + 1) + ' of ' + tot : rem + ' of ' + tot + ' remain';
  return '<div class="bossbar"><div class="bb-top"><span class="bb-name">' + esc(REGIONS[rg].boss) + '</span><span class="bb-tag">' + tag + '</span></div><div class="bb-bar' + (wd ? ' warded' : '') + (just >= 0 ? ' hit' : '') + '" style="grid-template-columns:repeat(' + tot + ',1fr)">' +
    Array.from({ length: tot }, (_, i) => '<i class="' + (i < rem ? 'on' : '') + (i === just ? ' just' : '') + '"></i>').join('') + '</div></div>';
}
function sceneBlock(rg, kind) {
  const ref = kind === 'refuge', cap = ref ? ['The Sanctuary', 'Your refuge · weekly review'] : [REGIONS[rg].name, (REGIONS[rg].place.length > 34 && REGIONS[rg].short ? REGIONS[rg].short : REGIONS[rg].place) + ' · ' + statusWord(rg)];
  let extra = ref ? '' : bossBar(rg);
  if (!ref && floatMsg && performance.now() - floatMsg.at < 1500) extra += '<div class="floatmsg" style="animation-delay:-' + Math.round(performance.now() - floatMsg.at) + 'ms">' + esc(floatMsg.text) + '</div>';
  const arr = arriveAnim && !ref; if (arr) arriveAnim = false;
  return '<div class="scene bleed' + (cut ? ' cine' : '') + (arr ? ' arrive' : '') + '" id="scenewrap"><canvas id="scene" class="px" width="' + W5 * SC5 + '" height="' + H5 * SC5 + '" style="aspect-ratio:' + W5 + ' / ' + H5 + '" role="img" aria-label="' + esc(cap[0]) + ' scene"></canvas><div class="cap"><div class="display">' + esc(cap[0]) + '</div><div class="where">' + esc(cap[1]) + '</div></div>' + extra + '</div>';
}

const qTitle = q => q.title + (q.repeat ? ' (' + Math.min(q.repeat, (q.count || 0) + 1) + ' of ' + q.repeat + ')' : '');
const upkeepLine = u => { const d = uDays(u), late = uLate(u); return d == null ? 'Not done yet.' : 'Last done ' + ago(d) + '.' + (late > 1 ? ' Dust is settling.' : late >= 0 ? ' Due now.' : ''); };
const BOSS_BLURB = {
  threshold: 'A table creature buried under everyday clutter. Each milestone you meet knocks a layer off it.',
  armory: 'A wardrobe bursting with clothes it cannot hold. Each milestone you meet tears something loose.',
  chambers: 'A titan of hoarded crates. Each milestone you meet breaks a piece off it.',
  reliquary: 'A veiled mourner holding a shroud over the keepsake niches. Each preparation you finish lifts it.'
};
const REVIEW_TEXT = { keep: 'Kept. Give it a place this week.', go: 'Added to departures', later: 'Back in two weeks, on purpose' };
function moveLists() {
  const finish = S.batches.filter(b => b.state === 'staged').sort((a, b) => bDays(b) - bDays(a)).concat(S.batches.filter(b => b.state === 'sorted')).map(b => ({ kind: b.state === 'staged' ? 'step' : 'stage', b }));
  const quest = [], rg = S.region, rank = q => S.hearth.picks.includes(q.id) ? 0 : q.region === rg ? 1 : 2;
  /* quests from every open region: hearth picks first, then this region, then reclaimed ones */
  S.quests.filter(q => q.status === 'open' && regionOpen(q.region)).sort((a, b) => rank(a) - rank(b)).forEach(q => quest.push({ kind: 'quest', q }));
  if (S.status[rg] === 'active') {
    const ms = msOf(rg).filter(m => !m.auto && !m.done);
    (rg === 'vault' ? ms.slice(0, 1) : ms).forEach(m => quest.push({ kind: 'ms', rg, m }));
  }
  const upkeep = S.upkeep.slice().sort((a, b) => uLate(b) - uLate(a)).map(u => ({ kind: 'upkeep', u }));
  return { finish, quest, upkeep };
}
const HAND = [['finish', 'Departure', ICON6.depart], ['quest', 'Quest', ICON6.quest], ['upkeep', 'Upkeep', ICON6.upkeep]];
const xpb = (cls, a, attrs, label, xp) => '<button class="btn ' + cls + '" data-act="' + a + '"' + attrs + (xp !== undefined ? ' data-xp="' + xp + '"' : '') + '><span class="lbl">' + label + '</span>' + (xp ? '<b class="xp">+' + xp + '</b>' : '') + '</button>';
function cardContent(m) {
  if (!m) return { eb: 'All quiet', title: 'Nothing waiting', desc: 'Tend the hearth, or step into a region on the map.' };
  if (m.kind === 'step') {
    const b = m.b, s = b.steps[0] || { t: 'See it gone', d: 'Mark it gone once it has left the house.' }, xp = b.steps.length > 1 ? 5 : 40, id = ' data-id="' + b.id + '"';
    return { eb: esc(b.name) + ' → ' + esc(b.dest), ember: true, title: s.t, desc: esc(s.d) + (bDays(b) >= 3 ? ' <span class="chip ash">' + age(bDays(b)) + ' by the door</span>' : ''),
      btns: xpb('primary', b.steps.length ? 'batch-step' : 'batch-gone', id, b.steps.length ? 'Mark done' : 'It’s gone', xp) + xpb('ghost', 'batch-smaller', id, 'Make smaller') };
  }
  if (m.kind === 'stage') {
    const b = m.b, id = ' data-id="' + b.id + '"';
    if (b.pre) return { eb: esc(b.name) + ' · smaller step', ember: true, title: b.pre, desc: 'Just this. Then set it by the door.', btns: xpb('primary', 'pre-done', id, 'Mark done', 5) };
    return { eb: esc(b.name) + ' → ' + esc(b.dest), ember: true, title: 'Ready it at the door', desc: 'Bag or box it and set it by the front door.', btns: xpb('primary', 'batch-stage', id, 'Mark done', 5) + xpb('ghost', 'stage-smaller', id, 'Make smaller') };
  }
  if (m.kind === 'quest') {
    const q = m.q, rgn = REGIONS[q.region], a = S.active && S.active.id === q.id ? S.active : null;
    if (a) {
      const mins = Math.max(0, Math.round((Date.now() - a.start) / 60000));
      if (a.small) return { eb: 'Underway · ' + mins + ' min · smaller goal', ember: true, title: qTitle(q), desc: esc(a.small) + '. Stop there; the quest stays open.', btns: xpb('primary', 'active-small-done', '', 'I did that', 5) + xpb('ghost', 'active-cancel', '', 'Cancel') };
      return { eb: 'Underway · ' + mins + ' min', ember: true, title: qTitle(q), desc: esc(q.desc), btns: xpb('primary', 'active-done', '', 'Quest complete', 10) + xpb('ghost', 'active-stop', '', 'Stop for now') };
    }
    return { eb: esc(rgn.name) + (S.hearth.picks.includes(q.id) ? ' · hearth pick' : ''), title: qTitle(q), desc: esc(q.desc) + (q.waitsOn ? ' Then it waits on ' + esc(q.waitsOn) + '.' : ''),
      btns: xpb('primary', 'begin', ' data-id="' + q.id + '"', 'Begin quest') + xpb('ghost', 'quest-smaller', ' data-id="' + q.id + '"', 'Make smaller') };
  }
  if (m.kind === 'ms') {
    const attr = ' data-rg="' + m.rg + '" data-id="' + m.m.id + '"';
    if (m.rg === 'vault') return { eb: 'Final boss · phase ' + (msOf('vault').indexOf(m.m) + 1) + ' of ' + msTotal('vault'), ember: true, title: m.m.text, desc: esc(m.m.note || 'Tap once this phase is done in real life.'), btns: xpb('primary', 'ms-toggle', attr, 'Phase complete', 0) };
    return { eb: 'Milestone · heavy blow', ember: true, title: 'Strike the boss', desc: esc(m.m.text) + '. Tap once it is true.', btns: xpb('primary', 'ms-toggle', attr, 'It is true now', 0) };
  }
  if (m.kind === 'upkeep') {
    const u = m.u;
    return { eb: esc(REGIONS[u.region].name) + ' · ' + everyText(u.every), title: u.title, desc: upkeepLine(u), btns: xpb('primary', 'upkeep-done', ' data-id="' + u.id + '"', 'Mark done', 3) };
  }
  return { eb: 'Final boss · phase 1 of 4', ember: true, title: 'Open the vault', desc: 'Agree on scope with your parents and bring the first batch home. One batch at a time.' };
}
function moveCard(enter) {
  const L = moveLists(), rec = L.finish.length ? 'finish' : L.quest.length ? 'quest' : 'upkeep';
  let sel = moveTab && L[moveTab].length ? moveTab : rec, idx;
  const act = S.active && findQ(S.active.id);
  if (act && act.status === 'open' && regionOpen(act.region)) { sel = 'quest'; idx = Math.max(0, L.quest.findIndex(m => m.q && m.q.id === act.id)); }
  else { if (S.active) { S.active = null; save(); } idx = (moveIdx[sel] || 0) % Math.max(1, L[sel].length); }
  const list = L[sel], c = cardContent(list[idx]), since = performance.now() - nextUpAt, nu = since < 15000, pulse = since < 2600;
  const hand = HAND.map(([id, label, ic]) => { const n = L[id].length; return '<button role="tab" aria-selected="' + (id === sel) + '" data-act="move-tab" data-tab="' + id + '"' + (n ? '' : ' disabled') + ' aria-label="' + label + ', ' + n + (id === rec ? ', best pick' : '') + '">' + img(ic, 2) + '<span>' + label + '</span>' + (n ? '<i class="ct">' + n + '</i>' : '') + (id === rec && n ? '<i class="best" aria-hidden="true"></i>' : '') + '</button>'; }).join('');
  const shuffle = list.length > 1 && !(act && act.status === 'open') ? '<button class="q-shuffle" data-act="move-next" aria-label="Show another task, ' + (idx + 1) + ' of ' + list.length + '">' + (idx + 1) + '/' + list.length + ' ↻</button>' : '';
  return '<section class="card" id="movecard" aria-label="Your next quest"><div class="hand" role="tablist" aria-label="Choose your quest">' + hand + '</div>' +
    '<div class="q-body' + (enter ? ' enter' : '') + '"><div class="q-top"><span class="q-kicker' + (c.ember || nu ? ' ember' : '') + '">' + (nu ? 'Next up · ' : '') + c.eb + '</span>' + shuffle + '</div>' +
    '<h2 class="q-title">' + esc(c.title) + '</h2><p class="q-desc">' + c.desc + '</p>' + (c.btns ? '<div class="q-actions' + (pulse ? ' nudge' : '') + '">' + c.btns + '</div>' : '') + '</div></section>';
}
function sigils(n, total) { let h = '<div class="sigils" aria-label="' + n + ' of ' + total + ' milestones complete">'; for (let i = 0; i < total; i++) h += '<i class="sigil' + (i < n ? ' on' : '') + '"></i>'; return h + '<span>' + n + ' of ' + total + ' milestones</span></div>'; }
function bossPanel(rg) {
  if (rg === 'vault') return finalPanel();
  const n = metOf(rg), tot = msTotal(rg), won = S.status[rg] === 'restored';
  let h = '<section class="panel ember" id="bosspanel" aria-label="Area boss"><div class="eyebrow ember">Area boss · ' + esc(REGIONS[rg].name) + '</div><h2 class="display h-boss">' + esc(REGIONS[rg].boss) + '</h2>' + sigils(n, tot) + '<p class="muted small">' + esc(BOSS_BLURB[rg] || '') + (REGIONS[rg].target ? ' Target: ' + esc(REGIONS[rg].target) + '.' : '') + '</p><ul class="conds">';
  msOf(rg).forEach(m => {
    const d = msDone(m, rg);
    if (m.auto) { const b = blockers(rg).length; h += '<li><div class="cond auto' + (d ? ' done' : '') + '"><span class="tick" aria-hidden="true"></span><span class="ctext">' + esc(m.text) + (d ? '' : m.auto === 'allgone' ? (b ? '<span class="sub">Warded by ' + b + (b === 1 ? ' departure' : ' departures') + ' still waiting to leave. <button class="linkbtn" data-act="nav" data-tab="quests">See departures</button></span>' : '<span class="sub">Ticks itself once what is leaving from here has left, or with the last milestone if nothing needs to leave.</span>') : '<span class="sub">Ticks itself when the first departure from here leaves the house.</span>') + '</span></div></li>'; }
    else h += '<li><button class="cond' + (d ? ' done' : '') + '" data-act="ms-toggle" data-rg="' + rg + '" data-id="' + m.id + '" aria-pressed="' + d + '"' + (d || won ? '' : ' data-xp="0"') + (won ? ' disabled' : '') + '><span class="tick" aria-hidden="true"></span><span class="ctext">' + esc(m.text) + '</span></button></li>';
  });
  return h + '</ul></section>';
}
function finalPanel() {
  const ms = msOf('vault'), open = vaultOpen(), won = S.status.vault === 'restored', cur = ms.findIndex(m => !msDone(m, 'vault'));
  return '<section class="panel ember" id="bosspanel" aria-label="Final boss"><div class="eyebrow ember">Final boss · ' + esc(REGIONS.vault.name) + '</div><h2 class="display h-boss">' + esc(REGIONS.vault.boss) + '</h2><div class="muted small" style="margin-top:-4px">Guardian of the Old Family Vault</div>' +
    (won ? '<p class="small">At rest. Everything in scope is home or gone.</p>' : open ? '<p class="small">The Keeper waits at the vault door. One phase at a time; nothing here asks you to carry everything home at once.</p>' : '<p class="small">The vault is sealed until ' + esc(REGIONS.reliquary.boss) + ' is done. Preparation: <span class="nums">' + metOf('reliquary') + ' of ' + msTotal('reliquary') + '</span>.</p>') +
    '<ol class="phases">' + ms.map((m, i) => { const d = msDone(m, 'vault'), now = open && !won && i === cur; return '<li class="' + (d ? 'done' : now ? 'now' : '') + '"><span class="pn">' + (d ? '✓' : i + 1) + '</span><div><b>' + esc(m.text) + '</b>' + (m.note ? '<div class="muted small">' + esc(m.note) + '</div>' : '') + (now ? '<div style="margin-top:6px"><button class="btn small primary" data-act="ms-toggle" data-rg="vault" data-id="' + m.id + '" data-xp="0">Phase complete</button></div>' : '') + '</div></li>'; }).join('') + '</ol>' +
    '<div class="relic">' + img(RELIC.seal, 5, { mono: won ? null : '#4A423D' }) + '<div class="muted small">' + (won ? 'Relic: Family Seal' : 'Relic waiting inside: Family Seal') + '</div></div></section>';
}
function hearthPanel() {
  const done = S.hearth.done;
  return '<section class="panel" id="hearthpanel" aria-label="The hearth"><div class="split"><div><div class="eyebrow">The Hearth · weekly</div><h3 class="display h-sm">' + (done ? 'The hearth burns bright' : 'The hearth burns low') + '</h3></div>' + img(ICON.sanctuary, 4) + '</div>' +
    '<p class="small">' + (done ? 'Reviewed this week. Smoke rises over the keep.' : 'Five minutes, once a week: what left, what is stuck, what is due, and what comes next.') + '</p><div><button class="btn' + (done ? '' : ' primary') + '" data-act="hearth-open">' + (done ? 'Visit the hearth' : 'Tend the hearth') + '</button></div></section>';
}

function batchCard(b) {
  const n = qtyOf(b), ed = editLink('b-edit', b.id, b.name);
  let h = '<article class="batch ' + b.state + '"><div class="split"><span class="name">' + esc(b.name) + (n > 1 ? ' <span class="qty">×' + n + '</span>' : '') + '</span><span class="chip ' + (b.state === 'gone' ? 'sage' : b.state === 'staged' ? 'ember' : 'ash') + '">' + esc(b.dest) + '</span></div>';
  if (b.state === 'sorted') h += '<p class="small muted">Sorted ' + ago(bDays(b)) + '. Next: ' + esc(b.pre || 'bag it and set it by the front door') + '.</p><div class="row"><button class="btn small primary" data-act="' + (b.pre ? 'pre-done' : 'batch-stage') + '" data-id="' + b.id + '" data-xp="5">Mark done</button>' + ed + '</div>';
  else if (b.state === 'staged') { const s = b.steps[0]; h += '<p class="small muted">By the door ' + age(bDays(b)) + '. Next: <span style="color:var(--bone)">' + esc(s ? s.d : 'mark it gone') + '</span></p><div class="row">' + (s ? '<button class="btn small primary" data-act="batch-step" data-id="' + b.id + '" data-xp="' + (b.steps.length > 1 ? 5 : 40) + '">Mark done</button><button class="btn small" data-act="batch-smaller" data-id="' + b.id + '">Make smaller</button>' : '') + '<button class="btn small" data-act="batch-gone" data-id="' + b.id + '" data-xp="40">It’s gone</button>' + ed + '</div>'; }
  else h += '<div class="split"><p class="small muted">Left the house ' + ago(bDays(b)) + (b.value > 0 ? ' · sold for ' + money(b.value) : '') + '.</p>' + ed + '</div>';
  return h + '</article>';
}
function questRow(q) {
  const sub = [q.desc, q.waitsOn ? 'Then it waits on ' + q.waitsOn + '.' : ''].filter(Boolean).join(' ');
  return '<li class="item"><div class="txt"><span class="name">' + esc(qTitle(q)) + '</span>' + (sub ? '<span class="small muted">' + esc(sub) + '</span>' : '') + editLink('q-edit', q.id, q.title) + '</div>' +
    (regionOpen(q.region) ? '<button class="btn small" data-act="begin" data-id="' + q.id + '">Begin</button>' : '<span class="chip ash">Sealed</span>') + '</li>';
}
function choreRow(u, where) {
  return '<li class="item"><div class="txt"><span class="name">' + esc(u.title) + '</span><span class="small muted">' + (where ? esc(REGIONS[u.region].name) + ' · ' : '') + everyText(u.every) + ' · ' + upkeepLine(u) + '</span>' + editLink('u-edit', u.id, u.title) + '</div><button class="btn small" data-act="upkeep-done" data-id="' + u.id + '" data-xp="3">Mark done</button></li>';
}
function questsHere(rg) {
  const open = S.quests.filter(q => q.region === rg && q.status === 'open'), on = regionOpen(rg);
  return '<section class="panel" aria-label="Quests here"><div class="split"><div class="eyebrow">' + (on ? 'Quests here · 10 XP each' : 'Quests waiting here') + '</div><button class="btn small" data-act="task-add" data-rg="' + rg + '">Add a task</button></div>' +
    (open.length ? '<ul class="list">' + open.map(questRow).join('') + '</ul>' : '<p class="small muted">' + (on ? 'No open quests here. Add one.' : 'Nothing planned here yet. Tasks you add wait until this region opens.') + '</p>') + '</section>';
}
function questsView() {
  const by = st => S.batches.filter(b => b.state === st), so = by('sorted'), st = by('staged'), gn = by('gone').sort((a, b) => (b.goneAt || 0) - (a.goneAt || 0));
  let h = '<h1 class="pagetitle">Quest log</h1><p class="lede">Everything in motion, in one place. Add your own tasks, chores and departures.</p>';
  h += '<section class="panel" aria-label="Departures"><div class="split"><div><div class="eyebrow">Departures</div><h2 class="display h-sm">Things leaving the house</h2></div><button class="btn small" data-act="add-batch">Add a departure</button></div><p class="small muted">Sorting earns a little. Leaving earns 40 XP, goes in the Ledger of Release and can break a boss’s ward.</p><div class="flow"><div><b>' + so.length + '</b><span>Sorted</span></div><div class="st"><b>' + st.length + '</b><span>By the door</span></div><div class="gn"><b>' + gn.length + '</b><span>Gone</span></div></div>' +
    (st.length ? '<div class="lane">By the door</div>' + st.map(batchCard).join('') : '') + (so.length ? '<div class="lane">Sorted</div>' + so.map(batchCard).join('') : '') +
    (gn.length ? '<div class="lane">Gone</div>' + gn.slice(0, 5).map(batchCard).join('') + (gn.length > 5 ? '<p class="small muted">' + (gn.length - 5) + ' more in <button class="linkbtn" data-act="ledger-open">the Ledger of Release</button>.</p>' : '') : '') + '</section>';
  const openQ = S.quests.filter(q => q.status === 'open'), mine = [S.region].concat(ORDER.filter(r => r !== S.region && regionOpen(r))), sealed = ORDER.filter(r => !mine.includes(r));
  h += '<section class="panel" aria-label="Quests"><div class="split"><div><div class="eyebrow">Quests · 10 XP each</div><h2 class="display h-sm">Your quests</h2></div><button class="btn small" data-act="task-add">Add a task</button></div>';
  let shown = 0;
  mine.forEach(r => { const L = openQ.filter(q => q.region === r); if (!L.length) return; shown += L.length; h += '<div class="lane">' + esc(REGIONS[r].name) + (r === S.region ? ' · you are here' : '') + '</div><ul class="list">' + L.map(questRow).join('') + '</ul>'; });
  if (!shown) h += '<p class="small muted">No open quests. Add one: name it, pick the room, and it joins your quest card.</p>';
  const sq = openQ.filter(q => sealed.includes(q.region));
  if (sq.length) h += '<details class="sealedq"><summary>Waiting in sealed regions · ' + sq.length + '</summary>' + sealed.map(r => { const L = sq.filter(q => q.region === r); return L.length ? '<div class="lane">' + esc(REGIONS[r].name) + '</div><ul class="list">' + L.map(questRow).join('') + '</ul>' : ''; }).join('') + '</details>';
  h += '</section>';
  h += '<section class="panel" aria-label="Upkeep"><div class="split"><div class="eyebrow">Upkeep · keeps reclaimed regions bright</div><button class="btn small" data-act="chore-add">Add a chore</button></div>' + (S.upkeep.length ? '<ul class="list">' + S.upkeep.slice().sort((a, b) => uLate(b) - uLate(a)).map(u => choreRow(u, true)).join('') + '</ul>' : '<p class="small muted">No chores yet. A chore repeats on a schedule you pick.</p>') + '</section>';
  const waits = S.quests.filter(q => q.status === 'waiting');
  if (waits.length) h += '<section class="panel" aria-label="Waiting on others"><div class="eyebrow">Waiting on others</div>' + waits.map(w => '<div><div class="name">' + esc(w.title) + '</div><p class="small muted">' + esc(w.desc) + ' Waiting on ' + esc(w.waitingOn || 'someone') + '. Asked ' + ago(daysSince(w.waitingSince)) + '. It is in their hands, so it does not count against you.</p><div class="row" style="margin-top:8px"><button class="btn small" data-act="wait-answered" data-id="' + w.id + '">They answered</button><button class="btn small" data-act="wait-nudge" data-id="' + w.id + '">I asked again</button></div></div>').join('') + '</section>';
  return h;
}
function mapView() {
  if (mapRegion) return locationView(mapRegion);
  const pos = (x, y) => 'left:' + (x / MW * 100).toFixed(2) + '%;top:' + (y / MH * 100).toFixed(2) + '%';
  const lab = r => {
    const st = S.status[r], done = st === 'restored', sealed = st === 'dark' || st === 'locked', here = r === S.region, a = MAPLABEL[r];
    const sub = here ? 'You are here' + (st === 'active' ? ' · ' + metOf(r) + '/' + msTotal(r) : '') : done ? 'Reclaimed ✓' : sealed ? 'Sealed' : 'In progress';
    return '<button class="maplabel' + (a[2] !== 'up' ? ' ' + a[2] : '') + (here ? ' here' : done ? ' done' : sealed ? ' sealed' : '') + '" style="' + pos(a[0], a[1]) + '" data-act="open-region" data-id="' + r + '" aria-label="' + esc(REGIONS[r].name) + ', ' + sub + '"><b>' + esc(MAPNAME[r]) + '</b><small>' + sub + '</small></button>';
  };
  const hl = MAPLABEL.hearth, hearthLab = '<button class="maplabel' + (S.hearth.done ? ' done' : '') + '" style="' + pos(hl[0], hl[1]) + '" data-act="map-hearth" aria-label="The Hearth, your weekly review"><b>Hearth</b><small>' + (S.hearth.done ? 'Burns bright' : 'Burns low') + '</small></button>';
  const anim = mapAnim; mapAnim = '';
  return '<div class="scene bleed" id="mapframe"><div id="mapwrap"' + (anim ? ' class="' + anim + '"' : '') + '><canvas id="map" class="px" width="' + MW * MSC + '" height="' + MH * MSC + '" style="aspect-ratio:' + MW + ' / ' + MH + '" role="img" aria-label="The keep on its crag and the long road to the Old Family Vault. Lit windows are reclaimed."></canvas>' +
    '<div class="maptitle"><div class="display">The Keep</div><small>Reclaimed region by region</small></div><div class="maplabels">' + ORDER.map(lab).join('') + hearthLab + '</div></div></div>' +
    '<section class="panel" aria-label="Regions"><div class="eyebrow">The journey</div><ul class="list">' + ORDER.map(r => '<li class="item"><div class="txt"><span class="name">' + esc(REGIONS[r].name) + '</span><span class="small muted">' + esc(REGIONS[r].place) + ' · ' + statusWord(r) + (r === S.region ? ' · you are here' : '') + '</span></div><button class="btn small" data-act="open-region" data-id="' + r + '">Enter</button></li>').join('') + '</ul></section>';
}
function locationView(rg) {
  const st = S.status[rg];
  let h = '<div class="row"><button class="btn small" data-act="map-back">← The Keep</button></div>' + sceneBlock(rg, 'region');
  if (rg === 'vault') return h + finalPanel() + questsHere(rg);
  if (st === 'active') h += bossPanel(rg) + questsHere(rg);
  else if (st === 'restored') {
    const rel = REGIONS[rg].relic, ups = S.upkeep.filter(u => u.region === rg);
    h += '<section class="panel sage" aria-label="Reclaimed"><div class="eyebrow sage">Reclaimed</div><div class="relic">' + img(RELIC[rel[1]], 5) + '<div><div class="name">' + esc(REGIONS[rg].boss) + ' defeated</div><div class="small muted">Relic: ' + esc(rel[0]) + '. The boss rests here now.</div></div></div><div class="row"><button class="btn small" data-act="relive" data-id="' + rg + '">Relive the fight</button></div></section>' + questsHere(rg);
    if (ups.length) h += '<section class="panel" aria-label="Upkeep"><div class="eyebrow">Upkeep keeps this region bright · 3 XP</div><ul class="list">' + ups.map(u => choreRow(u, false)).join('') + '</ul></section>';
  } else h += '<section class="panel" aria-label="Sealed"><div class="eyebrow">Sealed</div><p class="small">Mist hides this place for now. It opens when you defeat ' + esc(REGIONS[S.region].boss) + '.</p><p class="small muted">Boss waiting here: ' + esc(REGIONS[rg].boss) + '</p></section>' + questsHere(rg);
  const waits = S.quests.filter(q => q.region === rg && q.status === 'waiting');
  if (waits.length) h += '<section class="panel" aria-label="Waiting on others"><div class="eyebrow">Waiting on others</div>' + waits.map(w => '<div><div class="name">' + esc(w.title) + '</div><p class="small muted">Asked ' + ago(daysSince(w.waitingSince)) + '. It is in their hands.</p></div>').join('') + '</section>';
  return h;
}

function characterView() {
  const next = TITLES.find(t => t[0] > S.level), cur = curGear(), nu = nextUnlock(), set = activeSet(cur);
  let h = '<h1 class="pagetitle">Character</h1>';
  h += '<section class="panel ember" aria-label="Your hero"><div><div class="eyebrow ember">Level ' + S.level + (set ? ' · ' + esc(SETS[set].name) + ' set' : '') + '</div><h2 class="display h-boss">' + esc(titleFor(S.level)) + '</h2>' + (next ? '<p class="small muted">Next title at level ' + next[0] + ': ' + esc(next[1]) + '</p>' : '') + '</div>' +
    '<div class="preview"><canvas id="herocv" class="px" width="' + 80 * 5 + '" height="' + 56 * 5 + '" style="aspect-ratio:80 / 56" role="img" aria-label="Your hero wearing ' + esc(SLOTS.map(s => cur[s].name).join(', ')) + '"></canvas></div>' +
    '<div class="chips" role="group" aria-label="Pose">' + POSES.map(([id, label]) => '<button class="pchip" data-act="pose" data-pose="' + id + '" aria-pressed="' + (previewPose === id) + '">' + label + '</button>').join('') + '</div>' +
    '<div class="setline">' + Object.keys(SETS).map(id => { const s = SETS[id], sl = Object.keys(s.slots), worn = sl.filter(k => cur[k].id === s.slots[k]).length, got = sl.filter(k => unlocked(GEAR[k].find(i => i.id === s.slots[k]))).length; return '<span class="setchip' + (worn === 4 ? ' full' : '') + '">' + esc(s.name) + ' · ' + worn + '/4 worn' + (got < 4 ? ' · ' + got + '/4 found' : '') + '</span>'; }).join('') + '</div>' +
    '<p class="small muted">Wear all four pieces of a set for its aura: rising embers, golden motes or silver glints.</p></section>';
  h += ledgerPanel();
  h += '<section class="panel" aria-label="Armory"><div class="eyebrow">Armory · gear earned as you progress</div><div class="hand slots" role="tablist" aria-label="Gear slot">' +
    SLOTS.map(s => '<button role="tab" aria-selected="' + (s === gearSlot) + '" data-act="gear-slot" data-slot="' + s + '">' + SLOT_LABEL[s] + '<small>' + esc(cur[s].name) + '</small></button>').join('') + '</div><div class="geargrid">' +
    GEAR[gearSlot].map(it => { const on = unlocked(it), worn = cur[gearSlot].id === it.id, th = heroThumb(gearWith(gearSlot, it.id), 2, on ? null : '#2A2422');
      return (on ? '<button class="gearitem' + (worn ? ' worn' : '') + '" data-act="equip" data-slot="' + gearSlot + '" data-id="' + it.id + '" aria-pressed="' + worn + '">' : '<div class="gearitem locked">') + '<img class="px" src="' + th + '" alt="">' + (it.set ? '<span class="tag">' + esc(SETS[it.set].name) + '</span>' : '') + '<b>' + (on ? esc(it.name) : 'Locked') + '</b><small>' + (worn ? 'Equipped' : on ? 'Tap to wear' : esc(reqText(it))) + '</small>' + (on ? '</button>' : '</div>'); }).join('') + '</div>' +
    (nu ? '<p class="small muted">Next unlock: <b style="color:var(--bone)">' + esc(nu.it.name) + '</b> · ' + esc(reqText(nu.it)) + '</p>' : '') + '</section>';
  h += '<section class="panel" aria-label="Relics"><div class="eyebrow">Relics · kept on the hearth mantel</div><div class="grid3">' + ORDER.map(r => { const on = beaten(r), rel = REGIONS[r].relic; return '<div class="slot' + (on ? ' on' : '') + '">' + img(RELIC[rel[1]], 4, { mono: on ? null : '#3A332F' }) + '<b>' + (on ? esc(rel[0]) : '???') + '</b><span>' + esc(REGIONS[r].name) + '</span></div>'; }).join('') + '</div></section>';
  h += '<section class="panel" aria-label="Real-life treats"><div class="split"><div class="eyebrow">Real-life treats</div><button class="btn small" data-act="add-treat">Add a treat</button></div>' +
    (S.treats.length ? '<ul class="list">' + S.treats.map(t => '<li class="item"><div class="txt"><span class="name">' + esc(t.text) + '</span><span class="small muted">' + esc(treatNeed(t)) + '</span>' + editLink('tr-edit', t.id, t.text) + '</div>' +
      (t.claimed ? '<span class="chip sage">Enjoyed</span>' : treatMet(t) ? '<button class="btn small primary" data-act="claim" data-id="' + t.id + '">Claim</button>' : '<span class="chip ash">Locked</span>') + '</li>').join('') + '</ul>' : '<p class="small muted">No treats yet. Add something real you will enjoy, and choose what earns it: a boss, a level or a seal.</p>') + '</section>';
  h += '<section class="panel" aria-label="Your house cat"><div class="eyebrow">Your house cat</div><div class="catrow"><div class="face">' + catImg(6) + '</div><label class="field" for="catname">Name<input id="catname" maxlength="16" autocomplete="off" value="' + esc(S.cat.name) + '"></label></div>' +
    '<div class="swatches" role="group" aria-label="Coat">' + Object.keys(COATS).map(id => '<button class="swatch" data-act="cat-coat" data-coat="' + id + '" aria-pressed="' + (S.cat.coat === id) + '">' + catImg(4, id) + esc(COATS[id].label) + '</button>').join('') + '</div><p class="small muted">' + esc(S.cat.name) + ' keeps you company in every region. Tap the cat in a scene to say hello.</p></section>';
  const fchip = (set2, kind) => Object.keys(set2).map(k => '<button class="pchip" data-act="font" data-kind="' + kind + '" data-k="' + k + '" aria-pressed="' + (S.font[kind] === k) + '" style="font-family:' + set2[k][1].replace(/"/g, '&quot;') + ';' + (kind === 'h' ? 'font-size:19px;font-weight:' + set2[k][2] : '') + '">' + set2[k][0] + '</button>').join('');
  h += '<section class="panel" aria-label="Typeface"><div class="eyebrow">Typeface</div><div class="small muted">Headings</div><div class="chips">' + fchip(FONTS_H, 'h') + '</div><div class="small muted">Everything else</div><div class="chips">' + fchip(FONTS_B, 'b') + '</div></section>';
  h += '<section class="panel" aria-label="Your data"><div class="eyebrow">Your data · saved on this device</div><p class="small muted">Campaign: ' + esc(S.campaignName) + '. ' + (S.lastBackupAt ? 'Last backup ' + ago(daysSince(S.lastBackupAt)) + '.' : 'No backup yet.') + '</p><div class="row"><button class="btn small primary" data-act="backup">Back up now</button><button class="btn small" data-act="import-file">Restore or import</button></div><div class="row"><button class="btn small" data-act="guide">Replay the guide</button><button class="btn small" data-act="start-over">Start over</button></div></section>';
  return h;
}

function hearthView() {
  const HS = S.hearth;
  let h = '<div class="row"><button class="btn small" data-act="hearth-close">← Back</button></div>' + sceneBlock(null, 'refuge');
  const cal = '<section class="panel"><div class="eyebrow">Weekly reminder</div><p class="small muted">Coming in a later update: a repeating hearth night in your phone’s calendar, with a link back here.</p></section>', fresh = S.lastBackupAt && daysSince(S.lastBackupAt) < 7;
  if (HS.done) {
    const picks = HS.picks.map(findQ).filter(Boolean), plans = Object.keys(HS.plans).map(id => { const b = findB(id); return b ? esc(b.name) + ' → ' + HS.plans[id] : ''; }).filter(Boolean);
    return h + '<section class="panel sage"><div class="eyebrow sage">This week</div><h2 class="display h-sm">The hearth burns bright</h2><p class="small">Your picks come first on the quest card. Smoke rises over the keep.</p>' +
      (picks.length ? '<ul class="list">' + picks.map(q => '<li class="item"><span class="name">' + esc(q.title) + '</span><span class="chip ' + (q.status === 'done' ? 'sage' : 'ash') + '">' + (q.status === 'done' ? 'Done' : 'Open') + '</span></li>').join('') + '</ul>' : '') +
      (plans.length ? '<p class="small muted">Departure days:<br>' + plans.join('<br>') + '</p>' : '') + '<p class="small muted">' + (fresh ? 'Backed up ' + ago(daysSince(S.lastBackupAt)) + '.' : 'Save a backup so this week is safe.') + '</p><div class="row"><button class="btn small' + (fresh ? '' : ' primary') + '" data-act="backup">Back up now</button></div><p class="small muted">A new hearth opens next week.</p></section>' + cal;
  }
  const titles = ['What left this week', 'What is stuck', 'Decisions that are due', 'Choose this week'];
  h += '<section class="panel ember"><div class="eyebrow ember">The hearth · step ' + (HS.step + 1) + ' of 4 · each step feeds the fire</div><div class="steps" aria-hidden="true">' + [0, 1, 2, 3].map(i => '<span class="' + (i <= HS.step ? 'on' : '') + '"></span>').join('') + '</div><h2 class="display h-sm">' + titles[HS.step] + '</h2>';
  if (HS.step === 0) { const gn = S.batches.filter(b => b.state === 'gone' && b.goneAt && daysSince(b.goneAt) <= 7), wk = tallyOf(gn); h += gn.length ? '<p class="small"><b>' + things(wk.total) + '</b> left in the last 7 days: ' + DESTS.filter(d => wk.by[d]).map(d => wk.by[d] + ' ' + DEST_INFO[d].verb).join(', ') + (wk.coin ? ', and ' + money(wk.coin) + ' from sales' : '') + '.</p><ul class="list">' + gn.map(b => '<li class="item"><div class="txt"><span class="name">' + esc(b.name) + (qtyOf(b) > 1 ? ' ×' + qtyOf(b) : '') + '</span><span class="small muted">' + esc(b.dest) + ' · left ' + ago(bDays(b)) + '</span></div><span class="chip sage">Gone</span></li>').join('') + '</ul>' : '<p class="small muted">Nothing left the house this week. The next steps fix that.</p>'; }
  else if (HS.step === 1) { const open = S.batches.filter(b => b.state !== 'gone'); h += '<p class="small muted">Give each one a day. A day turns a pile into a plan.</p>' + (open.length ? open.map(b => '<div class="batch ' + b.state + '"><div class="split"><span class="name">' + esc(b.name) + '</span><span class="chip ash">' + esc(b.dest) + '</span></div><div class="chips" role="group" aria-label="Day for ' + esc(b.name) + '">' + ['Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map(d => '<button class="pchip" data-act="hearth-plan" data-id="' + b.id + '" data-day="' + d + '" aria-pressed="' + (HS.plans[b.id] === d) + '">' + d + '</button>').join('') + '</div></div>').join('') : '<p class="small muted">Nothing is stuck.</p>'); }
  else if (HS.step === 2) { const now = Date.now(), list = S.reviewLater.filter(r => r.decidedAt >= HS.weekOf || (!r.outcome && (r.due || 0) <= now)); if (!list.length) h += '<p class="small muted">Nothing is waiting for a decision this week.</p>'; list.forEach(r => { const chip = r.decidedAt >= HS.weekOf ? REVIEW_TEXT[r.lastChoice] : ''; h += '<div class="batch"><span class="name">' + esc(r.item) + '</span><p class="small muted">' + esc(r.note || '') + '</p>' + (chip ? '<span class="chip sage">' + esc(chip) + '</span>' : '<div class="row"><button class="btn small" data-act="review" data-id="' + r.id + '" data-c="keep">Keep it</button><button class="btn small" data-act="review" data-id="' + r.id + '" data-c="go">Let it go</button><button class="btn small" data-act="review" data-id="' + r.id + '" data-c="later">Two more weeks</button></div>') + '</div>'; }); }
  else { const open = S.quests.filter(q => q.status === 'open' && regionOpen(q.region)); h += '<p class="small muted">Choose up to three. Small on purpose.</p><div class="picks">' + open.map(q => { const on = HS.picks.includes(q.id); return '<button class="pick" data-act="hearth-pick" data-id="' + q.id + '" aria-pressed="' + on + '"' + (!on && HS.picks.length >= 3 ? ' disabled' : '') + '>' + esc(q.title) + '<small>' + esc(REGIONS[q.region].name) + '</small></button>'; }).join('') + '</div>'; }
  h += '<div class="row">' + (HS.step > 0 ? '<button class="btn" data-act="hearth-back">Back</button>' : '') + (HS.step < 3 ? '<button class="btn primary" data-act="hearth-next">Next</button>' : '<button class="btn primary" data-act="hearth-finish">Light the hearth</button>') + '</div></section>';
  return h + cal;
}

const NAV = [['sanctuary', 'Sanctuary', ICON.sanctuary], ['quests', 'Quests', ICON.quests], ['map', 'Map', ICON.map], ['character', 'Character', ICON.character]];
function render() {
  applyFonts();
  $('#top').innerHTML = topbar();
  if (tab === 'sanctuary' && !sub) {
    if (!$('#v-card')) $('#view').innerHTML = '<div id="v-scene" class="vpart"></div><div id="v-card" class="vpart"></div><div id="v-rest" class="vpart"></div>';
    $('#v-scene').innerHTML = sceneBlock(S.region, 'region');
    if (!(cardHold > performance.now())) $('#v-card').innerHTML = moveCard(false);
    $('#v-rest').innerHTML = bossPanel(S.region) + hearthPanel();
  } else $('#view').innerHTML = tab === 'sanctuary' ? hearthView() : tab === 'quests' ? questsView() : tab === 'map' ? mapView() : characterView();
  const n = S.batches.filter(b => b.state === 'staged').length;
  $('#nav').innerHTML = NAV.map(([id, label, pat]) => '<button data-act="nav" data-tab="' + id + '" aria-current="' + (tab === id ? 'page' : 'false') + '">' + img(pat, 3) + label + (id === 'quests' && n ? '<span class="badge">' + n + '</span>' : '') + '</button>').join('');
  $('#talk-face').innerHTML = catImg(6, null, 'Your house cat'); $('#talk-who').textContent = S.cat.name;
  const sc = $('#scene'), mp = $('#map'), hv = $('#herocv');
  target = sc ? { el: sc, ctx: sc.getContext('2d'), kind: tab === 'sanctuary' && sub === 'hearth' ? 'refuge' : 'region', rg: tab === 'map' ? mapRegion : S.region } : mp ? { el: mp, ctx: mp.getContext('2d'), kind: 'map' } : hv ? { el: hv, ctx: hv.getContext('2d'), kind: 'hero' } : null;
  if (sc) sc.addEventListener('click', sceneTap);
  if (mp) mp.addEventListener('click', mapTap);
  drawTarget(performance.now());
  if (talkStep >= 0) applySpot();
}
function drawTarget(t) { if (!target) return; if (target.kind === 'map') drawMap(target.ctx, t); else if (target.kind === 'refuge') drawRefuge(target.ctx, t); else if (target.kind === 'hero') drawPreview(target.ctx, t); else drawRegion(target.ctx, target.rg, t); }
function loop(t) { requestAnimationFrame(loop); if (document.hidden || t - lastT < 80 || t < hitStopUntil) return; lastT = t; drawTarget(t); tickCut(t); }
function toLogical(e, el, w, h) { const r = el.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * w, (e.clientY - r.top) / r.height * h]; }
function sceneTap(e) {
  if (!target || cut) return;
  const [x, y] = toLogical(e, target.el, W5, H5), now = performance.now();
  const c = target.kind === 'refuge' ? { pose: 'sleep', x: 112, bottom: 110 } : catPos6(target.rg, now), dims = { sleep: [10, 5], walk: [11, 6], sit: [8, 9] }[c.pose];
  if (x >= c.x - 3 && x <= c.x + dims[0] + 3 && y >= c.bottom - dims[1] - 4 && y <= c.bottom + 2) { petAt = now; sfx('meow'); toast(S.cat.name + (c.pose === 'sleep' ? ' purrs, still half asleep.' : ' leans into your hand.')); return; }
  if (target.kind === 'region') { const hs = heroState(target.rg, now); if (x >= hs.x - 4 && x <= hs.x + 20 && y >= FY - 38 && y <= FY + 2) { heroDo(bossLive(target.rg) ? 'attack' : 'victory'); sfx('whoosh'); if (bossLive(target.rg)) later(240, () => { bossDo('flinch'); sfx('hit'); }); } }
}
function mapTap(e) { const [x, y] = toLogical(e, target.el, MW, MH), hit = MAPORDER.find(r => { const b = MAPHIT[r]; return x >= b[0] && x <= b[0] + b[2] && y >= b[1] && y <= b[1] + b[3]; }); if (hit === 'hearth') openHearth(); else if (hit) openRegion(hit); }
function openHearth() { if (talkStep >= 0) endTalk(); tab = 'sanctuary'; sub = 'hearth'; mapRegion = null; render(); window.scrollTo(0, 0); }
function openRegion(r) {
  if (talkStep >= 0) endTalk();
  const wrap = $('#mapwrap');
  if (wrap && !REDUCED && tab === 'map' && !mapRegion) {
    if (wrap.classList.contains('zoomin')) return;
    const sp = MAPSPOT[r]; wrap.style.transformOrigin = (sp[0] / MW * 100).toFixed(1) + '% ' + (sp[1] / MH * 100).toFixed(1) + '%';
    wrap.classList.add('zoomin'); sfx('whoosh');
    setTimeout(() => { mapRegion = r; arriveAnim = true; render(); window.scrollTo(0, 0); }, 430);
    return;
  }
  tab = 'map'; mapRegion = r; render(); window.scrollTo(0, 0);
}

/* ================= guide: the house cat ================= */
const TALK = [
  { target: '#scenewrap', pos: 'bottom', text: () => 'Hello. I am ' + S.cat.name + ', keeper of this hearth. You are in ' + REGIONS[S.region].name + ', held by ' + REGIONS[S.region].boss + '. It answers everything you do.' },
  { target: '#movecard', pos: 'top', text: () => 'This is your quest card. Pick Departure, Quest or Upkeep, do it in real life, then tap the big button. The boss takes the hit and your next task slides in. Too big? Make smaller.' },
  { target: '#bosspanel', pos: 'top', text: () => 'Milestones are the heavy blows. Each one breaks a piece off the boss. Things still waiting by the door keep it warded until they actually leave.' },
  { target: '.nav', pos: 'top', text: () => 'Quests lists everything in motion. Map shows the whole keep and the long road to the Vault. Character is your armory, with seven gear slots and three full sets. You can rename me there.' }
];
function applySpot() { document.querySelectorAll('.spot').forEach(e => e.classList.remove('spot')); if (talkStep < 0) return; const el = $(TALK[talkStep].target); if (el) el.classList.add('spot'); }
function typeText(text) { const p = $('#talk-text'); clearInterval(typer); typer = null; if (REDUCED) { p.textContent = text; return; } let i = 0; p.textContent = ''; typer = setInterval(() => { i += 2; p.textContent = text.slice(0, i); if (i >= text.length) { clearInterval(typer); typer = null; } }, 24); }
function showTalk() {
  const box = $('#talk');
  if (talkStep < 0) { box.hidden = true; applySpot(); return; }
  const s = TALK[talkStep];
  box.classList.toggle('top', s.pos === 'top'); box.hidden = false;
  $('#talk-step').textContent = (talkStep + 1) + ' / ' + TALK.length; $('#talk-next').textContent = talkStep === TALK.length - 1 ? 'Begin' : 'Next';
  applySpot();
  const el = $(s.target);
  if (s.target === '#bosspanel' && el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 210, behavior: SMOOTH });
  else if (s.target !== '.nav') window.scrollTo({ top: 0, behavior: SMOOTH });
  typeText(s.text()); $('#talk-next').focus({ preventScroll: true });
}
function startTalk() { tab = 'sanctuary'; sub = null; mapRegion = null; talkStep = 0; render(); showTalk(); }
function endTalk() { clearInterval(typer); typer = null; talkStep = -1; S.tutorialDone = true; save(); showTalk(); }

/* ================= sheets ================= */
function openSheet(html, ctx2) { sheetCtx = ctx2 || null; $('#sheet').innerHTML = html; $('#sheetwrap').hidden = false; const f = $('#sheet').querySelector('input, button'); if (f) f.focus(); }
function closeSheet() { $('#sheetwrap').hidden = true; sheetCtx = null; }
function destChips(sel) { return '<div class="chips" role="group" aria-label="Where is it going?">' + DESTS.map(d => '<button class="pchip" data-act="pick-dest" data-dest="' + d + '" aria-pressed="' + (d === sel) + '">' + d + '</button>').join('') + '</div>'; }
function chosenDest() { const b = $('#sheet').querySelector('.pchip[aria-pressed="true"]'); return b ? b.dataset.dest : 'Donate'; }
function optSheet(title, intro, opts, act, ctx2) { openSheet('<h2 id="sheet-title" class="display h-sm">' + esc(title) + '</h2><p class="small muted">' + intro + '</p><div class="optlist">' + opts.map(o => { const t = Array.isArray(o) ? o : [o, '']; return '<button class="opt" data-act="' + act + '" data-label="' + esc(t[0]) + '">' + esc(t[0]) + (t[1] ? '<small>' + esc(t[1]) + '</small>' : '') + '</button>'; }).join('') + '</div><button class="linkbtn" data-act="close">Cancel</button>', ctx2); }
function outboxPrompt(q) { openSheet('<h2 id="sheet-title" class="display h-sm">Anything leaving the house?</h2><p class="small muted">Give it a destination now so it does not become a new pile.</p><label class="field" for="bname">What is it<input id="bname" placeholder="Bag of clothes, old cables" autocomplete="off"></label>' + qtyField(1) + destChips('Donate') + '<div class="row"><button class="btn primary" data-act="sort-to-outbox">Add to departures</button><button class="btn" data-act="sort-nothing">Nothing is leaving</button></div><button class="linkbtn" data-act="sort-later">Not sure yet: decide at the hearth in two weeks</button>', { q: q.id }); }
function welcome() {
  openSheet('<h2 id="sheet-title" class="display h-sm">Welcome to Hearth &amp; Hoard</h2><p class="small">Your home is a ruined keep. Finish real tasks, big and small, and the light comes back room by room.</p><div class="optlist"><button class="opt" data-act="start-starter">Start “A Home of Your Own”<small>A ready-made campaign you can change as you go</small></button><button class="opt" data-act="import-file">Import my campaign file<small>A Hearth &amp; Hoard .json file from Files, iCloud Drive or OneDrive</small></button></div><p class="small muted">Everything stays on this device. Back up from the hearth or the Character tab.</p>', { lock: true });
}
function confirmImport(d) {
  const isB = d.kind === 'backup', when = d.exportedAt ? new Date(d.exportedAt).toLocaleDateString() : '', first = !!S.firstRun, c = d.campaign || {};
  const body = isB ? 'Backup' + (when ? ' from ' + when : '') + (typeof d.campaign === 'string' ? ' of “' + esc(d.campaign) + '”' : '') + '. It replaces the progress on this device.'
    : '“' + esc(c.name || 'Campaign') + '”: ' + ORDER.filter(k => c.regions && c.regions[k]).length + ' regions and ' + (c.quests || []).length + ' starting quests.' + (first ? '' : ' Starting it replaces the progress on this device.');
  openSheet('<h2 id="sheet-title" class="display h-sm">' + (isB ? 'Restore this backup?' : 'Start this campaign?') + '</h2><p class="small">' + body + '</p>' + (first ? '' : '<p class="small muted">Back up first if you might want your current progress.</p>') +
    '<div class="row"><button class="btn primary" data-act="import-yes">' + (isB ? 'Restore' : 'Start campaign') + '</button>' + (first ? '' : '<button class="btn" data-act="backup">Back up first</button>') + '<button class="btn" data-act="' + (first ? 'welcome' : 'close') + '">Cancel</button></div>', { data: d, lock: first });
}
function updateReady() { if (cut) return; openSheet('<h2 id="sheet-title" class="display h-sm">An update is ready</h2><p class="small">Reload to use the newest Hearth &amp; Hoard. Your progress is saved.</p><div class="row"><button class="btn primary" data-act="reload">Reload now</button><button class="btn" data-act="close">Later</button></div>'); }
