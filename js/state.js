'use strict';
/* ================= saving, loading, backups and campaigns =================
   Progress lives only on this device, in browser storage, wrapped with a schema number so later versions can
   move old saves forward instead of wiping them. Backups and campaigns are plain JSON files the player keeps. */
const APP_ID = 'hearth-and-hoard';
const STORE_KEY = 'hearth-and-hoard';
const SCHEMA = 1;
let idSeq = 0;
const newId = p => p + Date.now().toString(36) + (idSeq++).toString(36);

/* build a fresh game from a campaign definition (the starter campaign or an imported file) */
function newGame(c) {
  const now = Date.now(), regions = {}, bosses = {}, treats = [], startAt = Math.max(0, ORDER.indexOf(c.start || 'threshold'));
  ORDER.forEach((k, i) => {
    const r = (c.regions && c.regions[k]) || {}, d = REGION_DEFAULTS[k];
    regions[k] = { name: r.name || d.name, place: r.place || d.place, short: r.short || d.short, boss: r.boss || d.boss, target: r.target || '' };
    let ms = r.milestones && r.milestones.length ? r.milestones : k === 'vault' ? PHASES.map(p => ({ text: p[0], note: p[1] })) : [];
    ms = ms.map(m => typeof m === 'string' ? { text: m } : m);
    bosses[k] = { ms: ms.map(m => ({ id: newId('m'), text: String(m.text || ''), note: m.note || '', auto: m.auto === 'allgone' || m.auto === 'onegone' ? m.auto : null, done: i < startAt, doneAt: i < startAt ? now : null })) };
    if (r.treat) treats.push({ id: newId('t'), text: String(r.treat), boss: k, claimed: false });
  });
  (c.treats || []).forEach(t => { if (t && t.text && ORDER.includes(t.boss)) treats.push({ id: newId('t'), text: String(t.text), boss: t.boss, claimed: false }); });
  const status = {};
  ORDER.forEach((k, i) => { status[k] = i < startAt ? 'restored' : i === startAt ? 'active' : k === 'vault' ? 'locked' : 'dark'; });
  return {
    schema: SCHEMA, createdAt: now, savedAt: null, campaignName: String(c.name || 'A Home of Your Own'),
    regions, bosses, status, region: ORDER[startAt],
    quests: (c.quests || []).filter(q => q && q.title && ORDER.includes(q.region)).map(q => ({
      id: newId('q'), region: q.region, title: String(q.title), desc: String(q.desc || ''), kind: q.kind === 'sort' ? 'sort' : 'task',
      status: 'open', waitsOn: q.waitsOn || null, waitingOn: null, waitingSince: null, repeat: Math.max(0, q.repeat | 0), count: 0, createdAt: now, doneAt: null
    })),
    upkeep: (c.upkeep || []).filter(u => u && u.title).map(u => ({ id: newId('u'), title: String(u.title), region: ORDER.includes(u.region) ? u.region : 'threshold', every: Math.max(1, u.every | 0 || 7), lastDone: null })),
    batches: [], reviewLater: [], treats,
    hearth: { weekOf: weekStart(now), done: false, step: 0, plans: {}, picks: [], lastDoneAt: null },
    xp: 0, level: 1, sound: true, tutorialDone: false, active: null,
    font: { h: 'grenze', b: 'barlow' },
    gear: { head: 'hood', cloak: 'worn', chest: 'tunic', boots: 'wraps', weapon: 'none', shield: 'none', lantern: 'small' },
    cat: { name: 'Cinder', coat: 'black' },
    log: [], lastBackupAt: null
  };
}

/* move older saves forward; schema 1 is the first real save format */
function migrate(st, from) {
  if (!st || typeof st !== 'object') throw new Error('empty save');
  if ((from || st.schema || 0) > SCHEMA) throw new Error('This save comes from a newer version of Hearth & Hoard.');
  const base = newGame(STARTER);
  ['regions', 'bosses', 'status', 'hearth', 'font', 'gear', 'cat'].forEach(k => { if (!st[k]) st[k] = base[k]; });
  ['quests', 'upkeep', 'batches', 'reviewLater', 'treats', 'log'].forEach(k => { if (!Array.isArray(st[k])) st[k] = []; });
  ORDER.forEach(k => { if (!st.bosses[k]) st.bosses[k] = base.bosses[k]; if (!st.status[k]) st.status[k] = base.status[k]; if (!st.regions[k]) st.regions[k] = base.regions[k]; });
  if (!ORDER.includes(st.region)) st.region = ORDER.find(k => st.status[k] === 'active') || 'threshold';
  if (typeof st.xp !== 'number') st.xp = 0;
  if (typeof st.level !== 'number' || st.level < 1) st.level = 1;
  if (st.sound === undefined) st.sound = true;
  st.schema = SCHEMA;
  return st;
}

function save() {
  try { S.savedAt = Date.now(); localStorage.setItem(STORE_KEY, JSON.stringify({ app: APP_ID, schema: SCHEMA, state: S })); return true; }
  catch (e) { toast('Could not save on this device. Make a backup now.'); return false; }
}
function loadState() {
  let raw = null;
  try { raw = localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  if (!raw) return null;
  try { const d = JSON.parse(raw); return migrate(d.state || d, d.schema || 0); }
  catch (e) { try { localStorage.setItem(STORE_KEY + '-unreadable-' + Date.now(), raw); } catch (er) {} return null; }
}
function askPersist() { try { if (navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(p => { if (!p) navigator.storage.persist(); }).catch(() => {}); } catch (e) {} }

function logEvent(type, data) { S.log.push(Object.assign({ t: Date.now(), type }, data || {})); if (S.log.length > 3000) S.log.splice(0, S.log.length - 3000); }

/* a new week opens a new hearth */
function rollWeek() {
  const w = weekStart(Date.now());
  if (S.hearth.weekOf !== w) { S.hearth = { weekOf: w, done: false, step: 0, plans: {}, picks: [], lastDoneAt: S.hearth.lastDoneAt || null }; save(); }
}

/* ---- files: backups out, backups and campaigns in ---- */
const stamp = () => { const d = new Date(), p = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); };
async function shareOrDownload(name, text) {
  const blob = new Blob([text], { type: 'application/json' });
  try {
    const file = new File([blob], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: name }); return true; }
  } catch (e) { if (e && e.name === 'AbortError') return false; }
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return true;
}
function exportBackup() {
  const data = { app: APP_ID, kind: 'backup', schema: SCHEMA, exportedAt: new Date().toISOString(), campaign: S.campaignName, state: S };
  shareOrDownload('hearth-and-hoard-backup-' + stamp() + '.json', JSON.stringify(data)).then(ok => { if (ok) { S.lastBackupAt = Date.now(); save(); toast('Backup saved'); render(); } });
}
function pickFile() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json,application/json';
  inp.onchange = () => { const f = inp.files && inp.files[0]; if (f) f.text().then(readImport).catch(() => toast('Could not read that file')); };
  inp.click();
}
function readImport(text) {
  let d = null;
  try { d = JSON.parse(text); } catch (e) {}
  if (!d || d.app !== APP_ID || !((d.kind === 'backup' && d.state) || (d.kind === 'campaign' && d.campaign))) { toast('That is not a Hearth & Hoard file'); return; }
  confirmImport(d);
}
function applyImport(d) {
  try { S = d.kind === 'backup' ? migrate(d.state, d.schema || 0) : newGame(d.campaign); }
  catch (e) { toast(e.message || 'That file could not be loaded'); return false; }
  if (d.kind === 'backup') S.lastBackupAt = Date.parse(d.exportedAt) || S.lastBackupAt || null;
  delete S.firstRun; applyNames(); rollWeek(); save(); askPersist();
  tab = 'sanctuary'; sub = null; mapRegion = null; moveTab = null; cut = null; moments = []; lastHit = null;
  return true;
}

/* the campaign definition behind a game (used by "Start over"): names, milestones, quests, chores and treats, no progress */
function campaignOf(st) {
  const regions = {};
  ORDER.forEach(k => {
    const r = st.regions[k] || {};
    regions[k] = { name: r.name, place: r.place, short: r.short, boss: r.boss, target: r.target, milestones: ((st.bosses[k] && st.bosses[k].ms) || []).map(m => ({ text: m.text, note: m.note || '', auto: m.auto || null })) };
  });
  return {
    name: st.campaignName, start: 'threshold', regions,
    quests: st.quests.map(q => ({ region: q.region, title: q.title, desc: q.desc, kind: q.kind, repeat: q.repeat || 0, waitsOn: q.waitsOn || null })),
    upkeep: st.upkeep.map(u => ({ title: u.title, region: u.region, every: u.every })),
    treats: st.treats.map(t => ({ text: t.text, boss: t.boss }))
  };
}
