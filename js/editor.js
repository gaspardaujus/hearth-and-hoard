'use strict';
/* ================= making the campaign your own =================
   Add, rename and delete quests, chores, departures and treats. The rooms (regions) and bosses stay as designed. */
const EVERY_OPTS = [[1, 'Daily'], [2, 'Every 2 days'], [3, 'Every 3 days'], [7, 'Weekly'], [14, 'Every 2 weeks'], [30, 'Monthly']];
const regionOpen = rg => S.status[rg] === 'active' || S.status[rg] === 'restored';
const editLink = (a, id, name) => '<button class="linkbtn edit" data-act="' + a + '" data-id="' + id + '" aria-label="Edit ' + esc(name) + '">Edit</button>';
const roomOpts = sel => ORDER.map(k => '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + esc(REGIONS[k].name) + ' · ' + esc(REGIONS[k].short || REGIONS[k].place) + (regionOpen(k) ? '' : ' (sealed for now)') + '</option>').join('');
const qtyField = v => '<div class="field">How many things<div class="stepper"><button class="stp" type="button" data-act="qty" data-d="-1" aria-label="One fewer">−</button><input id="bqty" type="number" inputmode="numeric" min="1" max="999" value="' + (v || 1) + '" aria-label="How many things"><button class="stp" type="button" data-act="qty" data-d="1" aria-label="One more">+</button></div></div>';
const readQty = () => { const n = parseInt($('#bqty') && $('#bqty').value, 10); return n >= 1 ? Math.min(999, n) : 1; };
function stepQty(d) { const i = $('#bqty'); if (i) i.value = Math.max(1, Math.min(999, (parseInt(i.value, 10) || 1) + d)); }
const confirmSheet = (title, body, yes, no, ctx) => openSheet('<h2 id="sheet-title" class="display h-sm">' + title + '</h2><p class="small">' + body + '</p><div class="row"><button class="btn primary" data-act="' + yes + '">Delete</button><button class="btn" data-act="' + no + '">Keep it</button></div>', ctx);

/* ---- quests and chores ---- */
const KIND_HINT = { task: 'Done once. +10 XP.', sort: 'Done once. When it is done, it asks what is leaving the house. +10 XP.', chore: 'Repeats on a schedule and keeps reclaimed rooms bright. +3 XP each time.' };
function taskSheet(o) {
  const chore = o.kind === 'chore', edit = o.mode === 'edit';
  const kinds = edit ? (chore ? [] : [['task', 'Quest'], ['sort', 'Sorting quest']]) : [['task', 'Quest'], ['sort', 'Sorting quest'], ['chore', 'Chore']];
  let h = '<h2 id="sheet-title" class="display h-sm">' + (edit ? (chore ? 'Edit chore' : 'Edit quest') : 'Add a task') + '</h2>' +
    '<label class="field" for="tk-name">Name<input id="tk-name" maxlength="80" autocomplete="off" placeholder="' + (chore ? 'Wipe the bathroom sink' : 'Clear the hallway shelf') + '" value="' + esc(o.name || '') + '"></label>';
  if (kinds.length) h += '<div class="field">Type</div><div class="chips" role="group" aria-label="Type">' + kinds.map(([k, l]) => '<button class="pchip" data-act="tk-kind" data-k="' + k + '" aria-pressed="' + (o.kind === k) + '">' + l + '</button>').join('') + '</div>';
  h += '<p class="small muted">' + KIND_HINT[o.kind] + '</p><label class="field" for="tk-room">Room<select id="tk-room">' + roomOpts(o.region) + '</select></label>';
  if (chore) h += '<label class="field" for="tk-every">How often<select id="tk-every">' + EVERY_OPTS.map(([n, l]) => '<option value="' + n + '"' + (n === o.every ? ' selected' : '') + '>' + l + '</option>').join('') + (EVERY_OPTS.some(e => e[0] === o.every) ? '' : '<option value="' + o.every + '" selected>Every ' + o.every + ' days</option>') + '</select></label>';
  else h += '<label class="field" for="tk-desc">Notes (optional)<input id="tk-desc" maxlength="160" autocomplete="off" placeholder="Where to start, or what done looks like" value="' + esc(o.desc || '') + '"></label>' +
    '<label class="field" for="tk-rep">How many times<select id="tk-rep">' + [0, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => '<option value="' + n + '"' + (n === (o.repeat || 0) ? ' selected' : '') + '>' + (n ? n + ' times' : 'Once') + '</option>').join('') + '</select></label>' +
    '<label class="field" for="tk-wait">Then wait on someone (optional)<input id="tk-wait" maxlength="40" autocomplete="off" placeholder="e.g. your parents" value="' + esc(o.waitsOn || '') + '"></label>';
  h += '<div class="row"><button class="btn primary" data-act="tk-save">' + (edit ? 'Save' : 'Add task') + '</button><button class="btn" data-act="close">Cancel</button></div>';
  if (edit) h += '<button class="linkbtn danger" data-act="tk-del">' + (chore ? 'Delete this chore' : 'Delete this quest') + '</button>';
  openSheet(h, Object.assign({}, o));
  if (!edit) { const n = $('#tk-name'); if (n) n.focus(); }
}
function taskForm() {
  const f = { name: ($('#tk-name').value || '').trim().slice(0, 80), region: $('#tk-room').value };
  if ($('#tk-every')) f.every = +$('#tk-every').value || 7;
  if ($('#tk-desc')) { f.desc = $('#tk-desc').value.trim(); f.repeat = +$('#tk-rep').value || 0; f.waitsOn = $('#tk-wait').value.trim(); }
  return f;
}
function addTask(region, kind) { taskSheet({ mode: 'add', kind: kind || 'task', region: ORDER.includes(region) ? region : S.region, every: 7, repeat: 0 }); }
function editQuest(id) { const q = findQ(id); if (q) taskSheet({ mode: 'edit', kind: q.kind === 'sort' ? 'sort' : 'task', id: q.id, name: q.title, region: q.region, desc: q.desc, repeat: q.repeat || 0, waitsOn: q.waitsOn || '' }); }
function editChore(id) { const u = S.upkeep.find(x => x.id === id); if (u) taskSheet({ mode: 'edit', kind: 'chore', id: u.id, name: u.title, region: u.region, every: u.every }); }
function taskSave() {
  const o = sheetCtx, f = taskForm();
  if (!f.name) { toast('Name the task first'); $('#tk-name').focus(); return; }
  if (o.kind === 'chore') {
    if (o.mode === 'edit') { const u = S.upkeep.find(x => x.id === o.id); if (u) Object.assign(u, { title: f.name, region: f.region, every: f.every }); }
    else S.upkeep.unshift({ id: newId('u'), title: f.name, region: f.region, every: f.every, lastDone: null });
  } else {
    const kind = o.kind === 'sort' ? 'sort' : 'task', wait = f.waitsOn || null;
    if (o.mode === 'edit') { const q = findQ(o.id); if (q) Object.assign(q, { title: f.name, region: f.region, desc: f.desc, kind, repeat: f.repeat, waitsOn: wait }); }
    else S.quests.unshift({ id: newId('q'), region: f.region, title: f.name, desc: f.desc, kind, status: 'open', waitsOn: wait, waitingOn: null, waitingSince: null, repeat: f.repeat, count: 0, createdAt: Date.now(), doneAt: null });
  }
  if (o.mode !== 'edit') logEvent('added', { what: o.kind, title: f.name, rg: f.region });
  save(); closeSheet(); render();
  toast(o.mode === 'edit' ? 'Saved' : o.kind === 'chore' || regionOpen(f.region) ? 'Added: ' + f.name : 'Added. It waits until ' + REGIONS[f.region].name + ' opens.');
}
function taskDelete() {
  const o = sheetCtx, item = o.kind === 'chore' ? S.upkeep.find(x => x.id === o.id) : findQ(o.id);
  if (!item) { closeSheet(); return; }
  confirmSheet('Delete “' + esc(item.title) + '”?', 'It leaves your ' + (o.kind === 'chore' ? 'chores' : 'quests') + ' for good. XP you already earned from it stays.', 'tk-del-yes', 'tk-del-no', o);
}
function taskDeleteYes() {
  const o = sheetCtx;
  if (o.kind === 'chore') S.upkeep = S.upkeep.filter(x => x.id !== o.id);
  else { S.quests = S.quests.filter(x => x.id !== o.id); if (S.active && S.active.id === o.id) S.active = null; S.hearth.picks = S.hearth.picks.filter(x => x !== o.id); }
  save(); closeSheet(); render(); toast('Deleted');
}

/* ---- departures ---- */
function batchSheet(id) {
  const b = findB(id); if (!b) return;
  const gone = b.state === 'gone';
  let h = '<h2 id="sheet-title" class="display h-sm">Edit departure</h2><label class="field" for="bname">What is it<input id="bname" maxlength="80" autocomplete="off" value="' + esc(b.name) + '"></label>' + qtyField(qtyOf(b)) + '<div class="field">Where it goes</div>' + destChips(b.dest);
  if (gone) h += '<label class="field" for="bval">Sale price, if sold ($)<input id="bval" type="number" inputmode="decimal" min="0" step="0.01" autocomplete="off" value="' + (b.value != null ? b.value : '') + '"></label><p class="small muted">Left the house ' + ago(bDays(b)) + '. Corrections update the Ledger; seals you have earned stay.</p>';
  h += '<div class="row"><button class="btn primary" data-act="b-save">Save</button><button class="btn" data-act="close">Cancel</button></div>' + (gone ? '' : '<button class="linkbtn danger" data-act="b-del">Delete this departure</button>');
  openSheet(h, { b: b.id });
}
function batchSave() {
  const b = findB(sheetCtx.b); if (!b) { closeSheet(); return; }
  const name = ($('#bname').value || '').trim().slice(0, 80), dest = chosenDest();
  if (name) b.name = name;
  b.qty = readQty();
  if (dest !== b.dest) { b.dest = dest; if (b.state !== 'gone') { b.steps = steps(dest); b.pre = null; } }
  if ($('#bval')) b.value = b.dest === 'Sell' ? priceOf($('#bval')) : null;
  save(); closeSheet(); render(); toast('Saved');
  if (b.state === 'gone') awardSeals().forEach(moment);
}
function batchDelete() { const b = findB(sheetCtx.b); if (!b) { closeSheet(); return; } confirmSheet('Delete “' + esc(b.name) + '”?', 'It leaves your departures for good. Use this for something you decided to keep.', 'b-del-yes', 'b-del-no', { b: b.id }); }
function batchDeleteYes() { const id = sheetCtx.b; S.batches = S.batches.filter(x => x.id !== id); delete S.hearth.plans[id]; save(); closeSheet(); render(); toast('Deleted'); later(500, checkBoss); }

/* ---- treats ---- */
function treatSheet(o) {
  const edit = o.mode === 'edit';
  let h = '<h2 id="sheet-title" class="display h-sm">' + (edit ? 'Edit treat' : 'Add a real-life treat') + '</h2><label class="field" for="tr-name">The treat<input id="tr-name" maxlength="60" autocomplete="off" placeholder="Pizza night" value="' + esc(o.name || '') + '"></label>' +
    '<div class="field">Earned by</div><div class="chips" role="group" aria-label="Earned by">' + [['boss', 'Beating a boss'], ['level', 'Reaching a level'], ['seal', 'Earning a seal']].map(([k, l]) => '<button class="pchip" data-act="tr-kind" data-k="' + k + '" aria-pressed="' + (o.kind === k) + '">' + l + '</button>').join('') + '</div>';
  if (o.kind === 'level') h += '<label class="field" for="tr-level">Level<select id="tr-level">' + Array.from({ length: 39 }, (_, i) => i + 2).map(n => '<option value="' + n + '"' + (n === o.level ? ' selected' : '') + '>Level ' + n + (n <= S.level ? ' (reached)' : '') + '</option>').join('') + '</select></label><p class="small muted">You are level ' + S.level + ', ' + (need() - S.xp) + ' XP from the next.</p>';
  else if (o.kind === 'seal') h += '<label class="field" for="tr-dest">Seal<select id="tr-dest">' + DESTS.map(d => '<option value="' + d + '"' + (d === o.dest ? ' selected' : '') + '>' + DEST_INFO[d].rank + ' · things ' + DEST_INFO[d].verb + '</option>').join('') + '</select></label>' +
    '<label class="field" for="tr-tier">Rank<select id="tr-tier">' + SEAL_AT.map((n, i) => '<option value="' + (i + 1) + '"' + (i + 1 === o.tier ? ' selected' : '') + '>' + ROMAN[i + 1] + ' · ' + things(n) + '</option>').join('') + '</select></label>';
  else h += '<label class="field" for="tr-boss">Boss<select id="tr-boss">' + ORDER.map(k => '<option value="' + k + '"' + (k === o.boss ? ' selected' : '') + '>' + esc(REGIONS[k].boss) + (beaten(k) ? ' (defeated)' : '') + '</option>').join('') + '</select></label>';
  h += '<div class="row"><button class="btn primary" data-act="tr-save">' + (edit ? 'Save' : 'Add treat') + '</button><button class="btn" data-act="close">Cancel</button></div>' + (edit ? '<button class="linkbtn danger" data-act="tr-del">Delete this treat</button>' : '');
  openSheet(h, Object.assign({}, o));
}
function treatForm() {
  const f = { name: ($('#tr-name').value || '').trim().slice(0, 60) };
  if ($('#tr-level')) f.level = +$('#tr-level').value;
  if ($('#tr-dest')) { f.dest = $('#tr-dest').value; f.tier = +$('#tr-tier').value; }
  if ($('#tr-boss')) f.boss = $('#tr-boss').value;
  return f;
}
function addTreat() { treatSheet({ mode: 'add', kind: 'boss', boss: ORDER.find(k => !beaten(k)) || S.region, level: S.level + 1, dest: 'Donate', tier: 1 }); }
function editTreat(id) { const t = S.treats.find(x => x.id === id), u = t && t.unlock; if (t) treatSheet({ mode: 'edit', id: t.id, name: t.text, kind: u.kind, boss: u.boss || S.region, level: u.level || S.level + 1, dest: u.dest || 'Donate', tier: u.tier || 1 }); }
function treatSave() {
  const o = Object.assign({}, sheetCtx, treatForm());
  if (!o.name) { toast('Name the treat first'); $('#tr-name').focus(); return; }
  const unlock = o.kind === 'level' ? { kind: 'level', level: o.level } : o.kind === 'seal' ? { kind: 'seal', dest: o.dest, tier: o.tier } : { kind: 'boss', boss: o.boss };
  let t = o.mode === 'edit' ? S.treats.find(x => x.id === o.id) : null;
  if (o.mode === 'edit' && !t) { closeSheet(); return; }
  if (!t) { t = { id: newId('t'), text: o.name, unlock, claimed: false, unlockedAt: null }; S.treats.push(t); }
  else { t.text = o.name; t.unlock = unlock; }
  const met = treatMet(t); t.unlockedAt = met ? (t.unlockedAt || Date.now()) : null;
  save(); closeSheet(); render();
  toast(met && !t.claimed ? 'Already earned. Claim it whenever you like.' : o.mode === 'edit' ? 'Saved' : 'Treat added');
}
function treatDelete() { const t = S.treats.find(x => x.id === sheetCtx.id); if (!t) { closeSheet(); return; } confirmSheet('Delete “' + esc(t.text) + '”?', 'It leaves your treats for good.', 'tr-del-yes', 'tr-del-no', sheetCtx); }
function treatDeleteYes() { S.treats = S.treats.filter(x => x.id !== sheetCtx.id); save(); closeSheet(); render(); toast('Deleted'); }

/* ---- hearth night: the weekly calendar reminder ----
   The calendar files are made ahead of time by tools/make-calendar.mjs (cal/hearth-<day>-<hhmm>.ics), because an
   iPhone adds an event from a real file that Safari opens, not from one a page builds on the fly. The event tells you
   to open the app from the home screen; a link would open Safari, whose storage is separate from the installed app. */
const HN_DAYS = [['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'], ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday']];
const HN_TIMES = ['1700', '1730', '1800', '1830', '1900', '1930', '2000', '2030', '2100', '2130', '2200'];
const HN_DEFAULT = { day: 'thu', time: '1930' };
const hnOf = () => S.hearthNight || HN_DEFAULT;
const hnTimeText = t => { const h = +t.slice(0, 2); return ((h + 11) % 12 + 1) + ':' + t.slice(2) + (h < 12 ? ' AM' : ' PM'); };
const hnDayName = d => (HN_DAYS.find(x => x[0] === d) || HN_DAYS[3])[1];
const hnFile = () => { const n = hnOf(); return 'cal/hearth-' + n.day + '-' + n.time + '.ics'; };
const hnTonight = () => (new Date().getDay() + 6) % 7 === HN_DAYS.findIndex(x => x[0] === hnOf().day);
function hearthNightPanel() {
  const n = hnOf();
  return '<section class="panel" id="hearthnight" aria-label="Hearth night"><div class="eyebrow">Hearth night · weekly reminder</div>' +
    '<p class="small">Your hearth night is <b>' + hnDayName(n.day) + 's at ' + hnTimeText(n.time) + '</b>. Put it in your phone’s calendar with an alert at the start time.</p>' +
    '<div class="pair"><label class="field" for="hn-day">Night<select id="hn-day">' + HN_DAYS.map(([k, l]) => '<option value="' + k + '"' + (k === n.day ? ' selected' : '') + '>' + l + '</option>').join('') + '</select></label>' +
    '<label class="field" for="hn-time">Time<select id="hn-time">' + HN_TIMES.map(t => '<option value="' + t + '"' + (t === n.time ? ' selected' : '') + '>' + hnTimeText(t) + '</option>').join('') + '</select></label></div>' +
    '<div class="row"><a class="btn primary" href="' + hnFile() + '" target="_blank" rel="noopener" data-act="hn-add">Add to my calendar</a></div>' +
    '<p class="small muted">It opens the event in Safari: tap <b>Add to Calendar</b>. If nothing happens, <button class="linkbtn" data-act="hn-copy">copy the link</button> and paste it into Safari. The event reminds you to open Hearth &amp; Hoard from your home screen. If you change the night or time later, add the new event and delete the old one.' + (n.addedAt ? ' Last added ' + ago(daysSince(n.addedAt)) + '.' : '') + '</p></section>';
}
function setHearthNight(field, value) {
  const n = Object.assign({}, hnOf()); n[field] = value; delete n.addedAt;
  S.hearthNight = n; save(); render(); toast('Hearth night: ' + hnDayName(n.day) + 's at ' + hnTimeText(n.time));
}
function copyHearthLink() {
  const url = new URL(hnFile(), location.href).href;
  const manual = () => openSheet('<h2 id="sheet-title" class="display h-sm">Calendar link</h2><p class="small">Copy this link and open it in Safari:</p><p class="small" style="word-break:break-all;color:var(--bone)">' + esc(url) + '</p><div class="row"><button class="btn" data-act="close">Done</button></div>');
  try { navigator.clipboard.writeText(url).then(() => toast('Link copied. Paste it into Safari.'), manual); } catch (e) { manual(); }
}
