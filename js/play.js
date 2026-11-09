'use strict';
/* ================= reactions: the boss answers everything you do ================= */
const heroDo = kind => { heroAct = { kind, at: performance.now() }; };
const bossDo = kind => { bossAct = { kind, at: performance.now() }; };
const bossXY = rg => ({ chambers: [124, FY - 44], reliquary: [96, 50], threshold: [104, FY - 18], armory: [100, FY - 40] })[rg] || [76, FY - 50];
function later(ms, fn) { setTimeout(fn, REDUCED ? 0 : ms); }
function say(text) {
  floatMsg = { text, at: performance.now() };
  const w = $('#scenewrap'); if (!w) return;
  w.querySelectorAll('.floatmsg').forEach(e => e.remove());
  const d = document.createElement('div'); d.className = 'floatmsg'; d.textContent = text; w.appendChild(d);
}
function fxMilestone(rg) {
  heroDo('attack'); sfx('whoosh');
  later(240, () => {
    const [x, y] = bossXY(rg);
    bossDo('stagger'); lastHit = { rg, idx: msTotal(rg) - metOf(rg), at: performance.now() }; flashAt = performance.now();
    debris(rg, x, y, 14, rg === 'reliquary' ? '#B0ACC2' : null); sparks(rg, x - 18, y + 8, 14); shake(3.5, 520);
    render(); say('Milestone met!'); sfx('hit'); later(120, () => sfx('crack')); hitStop(110);
  });
}
function fxQuest(rg) {
  heroDo('attack'); say('Quest complete'); sfx('whoosh');
  if (bossLive(rg)) later(240, () => { const [x, y] = bossXY(rg); bossDo('flinch'); sparks(rg, x - 20, y + 10, 8); debris(rg, x, y, 4, rg === 'reliquary' ? '#B0ACC2' : null); shake(1.6, 260); sfx('hit'); hitStop(60); });
}
function fxBegin(rg) { if (!bossLive(rg)) return; bossDo('roar'); shake(1.2, 700); say((REGIONS[rg].bossShort || 'The boss') + ' stirs'); sfx('roar'); }
function fxDeparture(rg) {
  if (warded(rg)) { heroDo('cast'); say('The ward cracks'); sfx('light'); later(300, () => { const [x, y] = bossXY(rg); bossDo('wardcrack'); shards(rg, x, y + 12, 10); shake(1, 240); sfx('crack'); }); }
  else if (bossLive(rg)) { heroDo('attack'); say('Departure!'); sfx('whoosh'); later(240, () => { const [x, y] = bossXY(rg); bossDo('flinch'); sparks(rg, x - 20, y + 10, 8); shake(1.4, 240); sfx('hit'); }); }
  else { heroDo('cast'); say('One step closer'); sfx('light'); }
}
function fxUpkeep(rg) { heroDo('cast'); say('The light grows'); sfx('light'); if (bossLive(rg)) later(260, () => bossDo('recoil')); }
function wardBreak(rg) { const [wx, wy] = bossXY(rg); shards(rg, wx, wy + 12, 28); flashAt = performance.now(); shake(2.5, 400); render(); say('The ward breaks!'); sfx('shatter'); hitStop(90); }

/* ================= defeat cutscene ================= */
function checkBoss() {
  if (cut) return;
  const rg = S.region;
  if (S.status[rg] === 'active' && msOf(rg).length && msOf(rg).every(m => msDone(m, rg))) startDefeat(rg);
}
function startDefeat(rg, relive) {
  if (REDUCED) { if (relive) toast('Replays are off while Reduce Motion is on.'); else applyDefeat(rg); return; }
  if (talkStep >= 0) endTalk();
  if (!relive) { tab = 'sanctuary'; sub = null; mapRegion = null; }
  floatMsg = null; render(); window.scrollTo(0, 0);
  const intro = relive ? 1600 : 0;
  cut = { rg, t0: performance.now() + intro, relive: !!relive, timers: [] };
  const w = $('#scenewrap'); if (w) w.classList.add('cine');
  $('#cutblock').hidden = false;
  const at = (ms, fn) => cut.timers.push(setTimeout(fn, ms + intro));
  if (relive) { bossDo('roar'); sfx('roar'); shake(1.4, 900); say((REGIONS[rg].bossShort || REGIONS[rg].boss) + ' rises'); }
  at(0, () => sfx('whoosh'));
  at(9300, () => { if (cut) endCut(); });
  at(260, () => { hitStop(140); shake(4, 600); sparks(rg, ...bossXY(rg), 18); sfx('hit'); sfx('crack'); });
  at(760, () => { shake(2, 800); sfx('roar'); });
  at(1500, () => { shake(3, 900); sfx('crack'); });
  at(2000, () => { shake(4, 1600); sfx('collapse'); const [x, y] = bossXY(rg); debris(rg, x, y, 20, rg === 'reliquary' ? '#B0ACC2' : null); });
  at(4900, () => sfx('ignite'));
  at(5150, () => sfx('ignite'));
  at(6100, () => { const w2 = $('#scenewrap'); if (w2) { const d = document.createElement('div'); d.className = 'reclaim'; d.innerHTML = rg === 'vault' ? '<div class="display">The Vault Is at Rest</div><small>' + esc(REGIONS[rg].boss) + ' lays down the lantern</small>' : '<div class="display">Region Reclaimed</div><small>' + esc(REGIONS[rg].boss) + ' has fallen</small>'; w2.appendChild(d); } sfx('boss'); });
}
function tickCut(t) { if (cut && t - cut.t0 > 8800) endCut(); }
function endCut() { if (!cut) return; const rg = cut.rg, relive = cut.relive; cut.timers.forEach(clearTimeout); cut = null; $('#cutblock').hidden = true; if (relive) { render(); toast(REGIONS[rg].boss + ' rests again.'); return; } applyDefeat(rg); }
function applyDefeat(rg) {
  const before = unlockedIds(), oldLv = S.level, nx = nextRegion(rg);
  S.status[rg] = 'restored'; S.bosses[rg].defeatedAt = Date.now();
  if (nx) { S.status[nx] = 'active'; S.region = nx; }
  logEvent('boss', { rg, boss: REGIONS[rg].boss });
  S.xp += 100; while (S.xp >= need()) { S.xp -= need(); S.level++; }
  const tr = unlockTreats();
  save();
  const fresh = unlockedIds().filter(i => !before.includes(i));
  const lines = ['<span class="x">+100 XP</span>', '<span class="t">Relic: ' + esc(REGIONS[rg].relic[0]) + '</span>'].concat(tr.filter(t => !t.claimed).map(treatLine));
  Object.keys(SETS).forEach(id => { const s = SETS[id]; if (Object.keys(s.slots).every(sl => fresh.includes(sl + ':' + s.slots[sl]) || before.includes(sl + ':' + s.slots[sl])) && Object.keys(s.slots).some(sl => fresh.includes(sl + ':' + s.slots[sl]))) lines.push('<span class="t">Full set unlocked: ' + esc(s.name) + ' · wear all four for ' + esc(s.aura) + '</span>'); });
  if (S.level > oldLv) lines.push('<span class="t">Level ' + S.level + ' · ' + esc(titleFor(S.level)) + '</span>');
  const body = rg === 'vault' ? 'Everything in scope is home or gone, and every keepsake has its place. The campaign is won.' : REGIONS[rg].name + ' is reclaimed.' + (nx === 'vault' ? ' The Keeper of All That Was waits at the vault door.' : nx ? ' The way to ' + REGIONS[nx].name + ' is open.' : '');
  moment({ relic: REGIONS[rg].relic[1], eyebrow: rg === 'vault' ? 'Final boss defeated' : 'Area boss defeated', title: REGIONS[rg].boss + (rg === 'vault' ? ' is at rest' : ' falls'), body, lines, gear: fresh, sound: 'boss' });
  render();
}

/* ================= xp, toasts, moments ================= */
function addXP(n, why, quiet, hold) {
  const old = S.level, before = unlockedIds();
  S.xp += n; while (S.xp >= need()) { S.xp -= need(); S.level++; }
  const tr = S.level > old ? unlockTreats() : [];
  save();
  if (!quiet && !quietXP) toast('+' + n + ' XP' + (why ? ' · ' + why : ''));
  if (S.level > old) {
    const fresh = unlockedIds().filter(i => !before.includes(i)), m = { hero: true, eyebrow: 'Your hero grows', title: 'Level ' + S.level, body: fresh.length ? 'A new title, and new gear for the armory.' : 'A new title is yours.', lines: ['<span class="t">' + esc(titleFor(S.level)) + '</span>'].concat(tr.map(treatLine)), gear: fresh, sound: 'level' };
    if (hold) return m; later(900, () => moment(m));
  }
  return null;
}
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3200); }

/* ================= juice: satisfying presses, a wax-seal stamp, sparks and XP that flies to your bar ================= */
function burst(x, y, n) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i'); s.className = 'spark'; s.style.left = x + 'px'; s.style.top = y + 'px';
    if (i % 3 === 0) s.style.background = '#FFF0D0'; else if (i % 3 === 1) s.style.background = '#FF8A3D';
    document.body.appendChild(s);
    const an = Math.random() * Math.PI * 2, dist = 28 + Math.random() * 52, dx = Math.cos(an) * dist, dy = Math.sin(an) * dist - 18;
    const anim = s.animate([{ transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + dx.toFixed(1) + 'px), calc(-50% + ' + (dy + 26).toFixed(1) + 'px)) scale(.3)', opacity: 0 }], { duration: 520 + Math.random() * 280, easing: 'cubic-bezier(.2, .7, .4, 1)' });
    anim.onfinish = () => s.remove();
  }
}
function xpFly(x, y, n) {
  const d = document.createElement('div'); d.className = 'xpfly'; d.textContent = '+' + n + ' XP'; d.style.left = x + 'px'; d.style.top = y + 'px'; document.body.appendChild(d);
  const bar = $('.xpbar'), br = bar && bar.getBoundingClientRect(), vis = br && br.bottom > 0, tx = vis ? br.left + br.width * .6 - x : 0, ty = vis ? br.top - y : -y - 30;
  const anim = d.animate([{ transform: 'translate(-50%, 0) scale(.8)', opacity: 0 }, { transform: 'translate(-50%, -24px) scale(1.15)', opacity: 1, offset: .25 }, { transform: 'translate(-50%, -30px) scale(1)', opacity: 1, offset: .45 }, { transform: 'translate(calc(-50% + ' + tx.toFixed(1) + 'px), ' + ty.toFixed(1) + 'px) scale(.55)', opacity: .15 }], { duration: 1000, easing: 'cubic-bezier(.4, 0, .3, 1)' });
  anim.onfinish = () => { d.remove(); const b2 = $('.xpbar'); if (b2) { b2.classList.add('gain'); sfx('blip'); setTimeout(() => b2.classList.remove('gain'), 700); } };
}
function juice(el, run) {
  const r = el.getBoundingClientRect(), card = el.closest('#movecard'), xp = +el.dataset.xp || 0, lbl = el.querySelector('.lbl');
  el.classList.add('done'); el.setAttribute('data-busy', '1'); if (lbl) lbl.textContent = 'Done!';
  sfx('done'); burst(r.left + r.width / 2, r.top + r.height / 2, 18);
  if (xp) xpFly(r.left + r.width / 2, r.top - 6, xp);
  if (card) { const s = document.createElement('div'); s.className = 'seal'; s.innerHTML = img(SEAL, 7); card.appendChild(s); cardHold = performance.now() + 950; }
  setTimeout(() => { quietXP = !!xp; try { run(); } finally { quietXP = false; } }, 130);
  if (card) setTimeout(() => {
    cardHold = 0;
    const v = $('#v-card'); if (!v || tab !== 'sanctuary' || sub) return;
    const swap = () => { const vv = $('#v-card'); if (vv && tab === 'sanctuary' && !sub && !(cardHold > performance.now())) { vv.innerHTML = moveCard(true); if (talkStep >= 0) applySpot(); } };
    const b = v.querySelector('.q-body'); if (b) { b.classList.add('leave'); setTimeout(swap, 250); } else swap();
  }, 950);
}
function moment(m) { moments.push(m); if (moments.length === 1) showMoment(); }
function showMoment() {
  const m = moments[0];
  let gh = '';
  if (m.gear && m.gear.length) {
    const wear = '<button class="btn" data-act="wear-new" data-ids="' + m.gear.join(',') + '">Wear new gear</button>';
    if (m.gear.length >= 3) { const G = curGear(); m.gear.forEach(k => { const { s, it } = gearItem(k); G[s] = it; }); gh = '<div class="eyebrow ember">New gear</div><img class="px" src="' + heroThumb(G, 3) + '" alt="Your hero wearing the new gear" style="width:120px;height:162px"><div class="small muted">' + m.gear.map(k => esc(gearItem(k).it.name)).join(' · ') + '</div>' + wear; }
    else gh = '<div class="eyebrow ember">New gear</div><div class="newgear">' + m.gear.map(k => { const { s, it } = gearItem(k); return '<div class="ng"><img class="px" src="' + heroThumb(gearWith(s, it.id), 2) + '" alt="">' + esc(it.name) + '</div>'; }).join('') + '</div>' + wear;
  }
  $('#moment').innerHTML = (m.relic ? img(RELIC[m.relic], 9) : m.sealArt ? sealArt(m.sealArt, 6) : m.hero ? '<img class="px" src="' + heroThumb(curGear(), 2) + '" alt="" style="width:80px;height:108px">' : '') +
    '<div class="eyebrow ember">' + esc(m.eyebrow) + '</div><h2 class="display" id="moment-title">' + esc(m.title) + '</h2>' + (m.body ? '<p class="muted">' + esc(m.body) + '</p>' : '') +
    (m.lines && m.lines.length ? '<div class="lines">' + m.lines.join('') + '</div>' : '') + gh + '<button class="btn primary" data-act="moment-close">Continue</button>';
  $('#momentwrap').hidden = false; $('#moment').querySelector('button.primary').focus(); sfx(m.sound || 'gone');
}
function closeMoment() { moments.shift(); if (moments.length) { showMoment(); return; } $('#momentwrap').hidden = true; render(); checkBoss(); }
function celebrate() { cheer = performance.now(); }
function gone(b) {
  const rg = b.boss, live = bossLive(rg), before = live ? metOf(rg) : 0, wasWarded = warded(rg) && blockers(rg).length === 1 && blockers(rg)[0] === b;
  b.state = 'gone'; b.goneAt = b.touchedAt = Date.now(); b.steps = []; b.pre = null;
  const n = qtyOf(b);
  logEvent('gone', { name: b.name, dest: b.dest, rg, qty: n, value: b.value || null });
  const hit = !wasWarded && live && metOf(rg) > before, seals = awardSeals(), total = tallyOf(S.batches).total;
  const show = () => moment({ eyebrow: 'Departure complete', title: 'It’s gone.', body: b.name + (n > 1 ? ' (' + things(n) + ')' : '') + ' → ' + b.dest + (b.value > 0 ? ' for ' + money(b.value) : '') + '. Not sorted, not waiting by the door. Gone.' + (wasWarded ? ' The ward on ' + REGIONS[rg].boss + ' is broken.' : hit ? ' ' + REGIONS[rg].boss + ' takes the blow.' : ''), lines: ['<span class="x">+40 XP</span>', '<span class="t">The Ledger of Release: ' + things(total) + ' gone</span>'], sound: 'gone' });
  const lvm = addXP(40, '', true, true);
  toSanctuary(); render();
  withScene(() => {
    if (wasWarded) { heroDo('cast'); sfx('light'); later(300, () => { wardBreak(rg); later(450, () => fxMilestone(rg)); }); }
    else if (hit) fxMilestone(rg);
    else fxDeparture(S.region);
    later(wasWarded || hit ? 2000 : 1200, () => { show(); seals.forEach(moment); if (lvm) moment(lvm); });
  });
}
function withScene(fn) {
  const w = $('#scenewrap'), r = w && w.getBoundingClientRect();
  if (!r || (r.top > -40 && r.top < innerHeight * .5)) { fn(); return; }
  window.scrollTo({ top: 0, behavior: SMOOTH }); later(420, fn);
}
function completeQuest(q, why) {
  if (q.waitsOn && q.status === 'open') {
    q.status = 'waiting'; q.waitingOn = q.waitsOn; q.waitingSince = Date.now();
    logEvent('asked', { title: q.title, rg: q.region }); addXP(10, 'now waiting on ' + q.waitsOn); render(); withScene(() => fxQuest(q.region)); return;
  }
  q.count = (q.count || 0) + 1;
  const more = q.repeat && q.count < q.repeat && q.status === 'open';
  if (!more) { q.status = 'done'; q.doneAt = Date.now(); }
  logEvent('quest', { title: q.title, rg: q.region });
  addXP(10, why || (more ? q.count + ' of ' + q.repeat + ' done' : 'quest complete')); render(); withScene(() => fxQuest(q.region));
}
