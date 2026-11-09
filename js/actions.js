'use strict';
/* ================= actions ================= */
function toSanctuary() { if (tab !== 'sanctuary' || sub) { tab = 'sanctuary'; sub = null; mapRegion = null; } }
function act(a, el) {
  const d = el.dataset;
  switch (a) {
    case 'nav': if (talkStep >= 0) endTalk(); tab = d.tab; sub = null; mapRegion = null; closeSheet(); render(); window.scrollTo(0, 0); return;
    case 'cut-skip': endCut(); return;
    case 'sound': S.sound = !S.sound; save(); render(); if (S.sound) sfx('blip'); return;
    case 'guide': startTalk(); return;
    case 'talk-next': if (typer) { clearInterval(typer); typer = null; $('#talk-text').textContent = TALK[talkStep].text(); return; } talkStep++; if (talkStep >= TALK.length) endTalk(); else showTalk(); return;
    case 'talk-skip': endTalk(); return;
    case 'move-tab': { moveTab = d.tab; render(); const qb = $('#movecard .q-body'); if (qb && !REDUCED) qb.classList.add('enter'); return; }
    case 'move-next': { const L = moveLists(), rec = L.finish.length ? 'finish' : L.quest.length ? 'quest' : 'upkeep', sel = moveTab && L[moveTab].length ? moveTab : rec; moveIdx[sel] = ((moveIdx[sel] || 0) + 1) % Math.max(1, L[sel].length); moveTab = sel; render(); const qb = $('#movecard .q-body'); if (qb && !REDUCED) qb.classList.add('enter'); return; }
    case 'begin': S.active = { id: d.id, start: Date.now(), small: null }; activeAnim = performance.now(); moveTab = 'quest'; save(); if (talkStep >= 0) endTalk(); tab = 'sanctuary'; sub = null; mapRegion = null; render(); window.scrollTo(0, 0); fxBegin(S.region); toast('The lamp is lit. Return when it is done.'); return;
    case 'quest-smaller': { const q = findQ(d.id); optSheet('Make it smaller', esc(q.title) + '. Pick a size you can do right now.', SMALLER_QUEST, 'smaller-pick', { q: q.id }); return; }
    case 'smaller-pick': S.active = { id: sheetCtx.q, start: Date.now(), small: d.label }; activeAnim = performance.now(); moveTab = 'quest'; save(); closeSheet(); render(); withScene(() => fxBegin(S.region)); toast('Smaller goal: ' + d.label); return;
    case 'active-done': { const q = findQ(S.active.id); S.active = null; save(); if (q.kind === 'sort') outboxPrompt(q); else completeQuest(q); return; }
    case 'active-stop': S.active = null; addXP(5, 'effort counts. The quest stays open'); celebrate(); render(); return;
    case 'active-small-done': S.active = null; addXP(5, 'smaller goal done'); render(); withScene(() => fxQuest(S.region)); return;
    case 'active-cancel': S.active = null; save(); render(); return;
    case 'sort-to-outbox': { const q = findQ(sheetCtx.q), dest = chosenDest(), name = ($('#bname').value || '').trim() || 'Unnamed batch'; const now = Date.now(); S.batches.unshift({ id: newId('b'), name: name === 'Unnamed batch' ? 'From: ' + q.title : name, qty: readQty(), value: null, dest, state: 'sorted', boss: q.region, steps: steps(dest), pre: null, sortedAt: now, touchedAt: now }); logEvent('sorted', { name, dest }); closeSheet(); completeQuest(q, 'sorted, now a departure'); return; }
    case 'sort-later': { const q = findQ(sheetCtx.q), now = Date.now(), name = ($('#bname').value || '').trim() || 'From: ' + q.title; S.reviewLater.push({ id: newId('r'), item: name, note: 'Set aside while doing: ' + q.title + '.', due: now + 14 * DAY, outcome: null, createdAt: now }); logEvent('later', { name }); closeSheet(); completeQuest(q, 'set aside to decide later'); return; }
    case 'sort-nothing': { const q = findQ(sheetCtx.q); closeSheet(); completeQuest(q); return; }
    case 'pick-dest': $('#sheet').querySelectorAll('.pchip').forEach(b => b.setAttribute('aria-pressed', b === el)); return;
    case 'batch-smaller': { const b = findB(d.id); optSheet('Make it smaller', 'The step was: ' + esc(b.steps[0] ? b.steps[0].d : 'mark it gone') + ' Pick a smaller first move.', SMALLER_BATCH[b.dest] || SMALLER_BATCH.Donate, 'batch-smaller-pick', { b: b.id }); return; }
    case 'batch-smaller-pick': { const b = findB(sheetCtx.b); b.steps.unshift({ t: 'A smaller step', d: d.label + '.' }); save(); closeSheet(); toast('Next: ' + d.label); render(); return; }
    case 'stage-smaller': { const b = findB(d.id); optSheet('Make it smaller', 'Getting ' + esc(b.name) + ' to the door. Pick a smaller first move.', STAGE_SMALLER, 'stage-smaller-pick', { b: b.id }); return; }
    case 'stage-smaller-pick': { const b = findB(sheetCtx.b); b.pre = d.label; save(); closeSheet(); toast('Next: ' + d.label); render(); return; }
    case 'pre-done': { const b = findB(d.id); b.pre = null; b.touchedAt = Date.now(); addXP(5, 'one step closer'); toSanctuary(); render(); withScene(() => fxDeparture(S.region)); return; }
    case 'batch-stage': { const b = findB(d.id); b.state = 'staged'; b.stagedAt = b.touchedAt = Date.now(); b.pre = null; logEvent('staged', { name: b.name }); addXP(5, 'set by the door'); toSanctuary(); render(); withScene(() => fxDeparture(S.region)); return; }
    case 'batch-step': { const b = findB(d.id); b.steps.shift(); if (!b.steps.length) { finishDeparture(b); return; } b.touchedAt = Date.now(); addXP(5, 'next: ' + b.steps[0].t.toLowerCase()); toSanctuary(); render(); withScene(() => fxDeparture(S.region)); return; }
    case 'batch-gone': finishDeparture(findB(d.id)); return;
    case 'sale-save': { const b = findB(sheetCtx.b); if (!b) { closeSheet(); return; } b.value = priceOf($('#bval')); closeSheet(); gone(b); return; }
    case 'sale-skip': { const b = findB(sheetCtx.b); closeSheet(); if (b) gone(b); return; }
    case 'add-batch': openSheet('<h2 id="sheet-title" class="display h-sm">Add a departure</h2><label class="field" for="bname">What is it<input id="bname" placeholder="Box of old DVDs" autocomplete="off"></label>' + qtyField(1) + destChips('Donate') + '<div class="row"><button class="btn primary" data-act="add-batch-save">Add as sorted</button><button class="btn" data-act="close">Cancel</button></div>'); return;
    case 'add-batch-save': { const dest = chosenDest(), name = ($('#bname').value || '').trim() || 'Unnamed batch'; const now = Date.now(); S.batches.unshift({ id: newId('b'), name, qty: readQty(), value: null, dest, state: 'sorted', boss: S.region, steps: steps(dest), pre: null, sortedAt: now, touchedAt: now }); logEvent('sorted', { name, dest }); save(); closeSheet(); toast('Added to sorted departures'); render(); return; }
    case 'qty': stepQty(+d.d); return;
    case 'b-edit': batchSheet(d.id); return;
    case 'b-save': batchSave(); return;
    case 'b-del': batchDelete(); return;
    case 'b-del-yes': batchDeleteYes(); return;
    case 'b-del-no': batchSheet(sheetCtx.b); return;
    case 'task-add': addTask(d.rg); return;
    case 'chore-add': addTask(S.region, 'chore'); return;
    case 'q-edit': editQuest(d.id); return;
    case 'u-edit': editChore(d.id); return;
    case 'tk-kind': taskSheet(Object.assign({}, sheetCtx, taskForm(), { kind: d.k })); return;
    case 'tk-save': taskSave(); return;
    case 'tk-del': taskDelete(); return;
    case 'tk-del-yes': taskDeleteYes(); return;
    case 'tk-del-no': taskSheet(sheetCtx); return;
    case 'ledger-open': tab = 'character'; sub = null; mapRegion = null; render(); { const l = $('#ledger'); if (l) l.scrollIntoView({ behavior: SMOOTH, block: 'start' }); } return;
    case 'ms-toggle': { const rg = d.rg, m = msOf(rg).find(x => x.id === d.id); if (!m || m.auto || S.status[rg] !== 'active') return; m.done = !m.done; m.doneAt = m.done ? Date.now() : null; if (m.done) logEvent('milestone', { rg, text: m.text }); save(); render(); if (m.done) { withScene(() => fxMilestone(rg)); if (msOf(rg).every(x => msDone(x, rg))) later(1400, checkBoss); } return; }
    case 'wait-answered': completeQuest(findQ(d.id), 'answer received'); return;
    case 'wait-nudge': findQ(d.id).waitingSince = Date.now(); save(); toast('Noted. Still waiting, and that is fine.'); render(); return;
    case 'upkeep-done': { const u = S.upkeep.find(x => x.id === d.id); u.lastDone = Date.now(); logEvent('upkeep', { title: u.title }); addXP(3, REGIONS[u.region].name + ' brightens'); toSanctuary(); render(); withScene(() => fxUpkeep(S.region)); return; }
    case 'open-region': openRegion(d.id); return;
    case 'map-back': mapRegion = null; mapAnim = REDUCED ? '' : 'zoomout'; render(); window.scrollTo(0, 0); return;
    case 'map-hearth': openHearth(); return;
    case 'relive': startDefeat(d.id, true); return;
    case 'hearth-open': sub = 'hearth'; render(); window.scrollTo(0, 0); return;
    case 'hearth-close': sub = null; render(); window.scrollTo(0, 0); return;
    case 'hearth-next': S.hearth.step = Math.min(3, S.hearth.step + 1); save(); render(); return;
    case 'hearth-back': S.hearth.step = Math.max(0, S.hearth.step - 1); save(); render(); return;
    case 'hearth-plan': S.hearth.plans[d.id] = d.day; save(); render(); return;
    case 'hearth-pick': { const p = S.hearth.picks, i = p.indexOf(d.id); if (i >= 0) p.splice(i, 1); else if (p.length < 3) p.push(d.id); save(); render(); return; }
    case 'review': { const r = S.reviewLater.find(x => x.id === d.id), now = Date.now(); r.lastChoice = d.c; r.decidedAt = now; if (d.c === 'keep') r.outcome = 'keep'; else if (d.c === 'go') { r.outcome = 'go'; S.batches.unshift({ id: newId('b'), name: r.item, qty: 1, value: null, dest: 'Donate', state: 'sorted', boss: S.region, steps: steps('Donate'), pre: null, sortedAt: now, touchedAt: now }); } else { r.outcome = null; r.due = now + 14 * DAY; } logEvent('review', { item: r.item, c: d.c }); addXP(5, 'decision made'); render(); return; }
    case 'hearth-finish': S.hearth.done = true; S.hearth.lastDoneAt = Date.now(); logEvent('hearth'); addXP(20, 'the hearth is lit'); sfx('light'); render(); window.scrollTo(0, 0); return;
    case 'gear-slot': gearSlot = d.slot; render(); return;
    case 'equip': S.gear[d.slot] = d.id; save(); sfx('step'); render(); return;
    case 'pose': previewPose = d.pose; render(); return;
    case 'wear-new': d.ids.split(',').forEach(k => { const [s, id] = k.split(':'); S.gear[s] = id; }); save(); toast('New gear equipped'); closeMoment(); return;
    case 'font': S.font[d.kind] = d.k; save(); render(); return;
    case 'cat-coat': S.cat.coat = d.coat; save(); sfx('meow'); render(); return;
    case 'add-treat': addTreat(); return;
    case 'tr-edit': editTreat(d.id); return;
    case 'tr-kind': treatSheet(Object.assign({}, sheetCtx, treatForm(), { kind: d.k })); return;
    case 'tr-save': treatSave(); return;
    case 'tr-del': treatDelete(); return;
    case 'tr-del-yes': treatDeleteYes(); return;
    case 'tr-del-no': treatSheet(sheetCtx); return;
    case 'claim': { const t = S.treats.find(x => x.id === d.id); t.claimed = true; save(); moment({ relic: 'coaster', eyebrow: 'Treat claimed', title: 'Enjoy it', body: t.text + '. You earned this.', lines: [], sound: 'level' }); render(); return; }
    case 'start-over': openSheet('<h2 id="sheet-title" class="display h-sm">Start over?</h2><p class="small">This erases your progress on this device and starts your campaign again from the first region. Your quests, chores and treats stay; your cat, sound and typeface stay too.</p><p class="small muted">Back up first if you might want this progress.</p><div class="row"><button class="btn" data-act="backup">Back up first</button><button class="btn primary" data-act="start-over-yes">Start over</button><button class="btn" data-act="close">Cancel</button></div>'); return;
    case 'start-over-yes': { const keep = { sound: S.sound, cat: S.cat, font: S.font, lastBackupAt: S.lastBackupAt }; S = newGame(campaignOf(S)); Object.assign(S, keep); applyNames(); save(); closeSheet(); tab = 'sanctuary'; sub = null; mapRegion = null; moveTab = null; render(); window.scrollTo(0, 0); toast('A fresh start'); setTimeout(startTalk, 500); return; }
    case 'backup': exportBackup(); return;
    case 'import-file': pickFile(); return;
    case 'import-yes': { const dd = sheetCtx && sheetCtx.data; if (!dd || !applyImport(dd)) return; closeSheet(); render(); window.scrollTo(0, 0); toast(dd.kind === 'backup' ? 'Backup restored' : 'Campaign started'); if (!S.tutorialDone) setTimeout(startTalk, 500); return; }
    case 'start-starter': delete S.firstRun; save(); askPersist(); closeSheet(); render(); setTimeout(startTalk, 400); return;
    case 'welcome': welcome(); return;
    case 'reload': location.reload(); return;
    case 'moment-close': closeMoment(); return;
    case 'close': closeSheet(); return;
  }
}

document.addEventListener('click', e => {
  if (AC && AC.state === 'suspended') { try { AC.resume(); } catch (er) {} }
  if (e.target.id === 'sheetwrap') { if (!(sheetCtx && sheetCtx.lock)) closeSheet(); return; }
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled || el.hasAttribute('data-busy')) return;
  if (el.hasAttribute('data-xp')) { nextUpAt = performance.now(); if (!REDUCED) { juice(el, () => act(el.dataset.act, el)); return; } }
  act(el.dataset.act, el);
});
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.btn, .hand button, .opt, .pick, .gearitem, .pchip, .swatch, .q-shuffle, .maplabel, .nav button, .cond, .mini, .linkbtn, .stp');
  if (!b || b.disabled) return;
  sfx('tap');
  if (REDUCED || !b.matches('.btn, .hand button, .opt, .pick, .gearitem')) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2, s = document.createElement('span');
  s.className = 'ripple'; s.style.width = s.style.height = d + 'px'; s.style.left = (e.clientX - r.left - d / 2) + 'px'; s.style.top = (e.clientY - r.top - d / 2) + 'px';
  b.appendChild(s); setTimeout(() => s.remove(), 520);
});
document.addEventListener('input', e => { if (e.target.id !== 'catname') return; S.cat.name = e.target.value.trim().slice(0, 16) || 'Cinder'; save(); $('#talk-who').textContent = S.cat.name; });
document.addEventListener('change', e => { if (e.target.id === 'catname') render(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (cut) endCut(); else if (!$('#sheetwrap').hidden) { if (!(sheetCtx && sheetCtx.lock)) closeSheet(); } else if (talkStep >= 0) endTalk(); } });

