'use strict';
const REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const SMOOTH = REDUCED ? 'auto' : 'smooth';
const clamp01 = v => Math.max(0, Math.min(1, v));

function rng(seed) {
  let s = seed >>> 0;
  return function () { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
(function grain() {
  try {
    const c = document.createElement('canvas'); c.width = c.height = 48;
    const x = c.getContext('2d'), r = rng(7);
    for (let i = 0; i < 300; i++) { x.fillStyle = r() < .55 ? 'rgba(0,0,0,.24)' : 'rgba(255,236,210,.04)'; x.fillRect(Math.floor(r() * 48), Math.floor(r() * 48), r() < .25 ? 2 : 1, 1); }
    document.documentElement.style.setProperty('--grain', 'url(' + c.toDataURL() + ')');
  } catch (e) {}
})();

/* ================= fonts ================= */
const FONTS_H = { grenze: ['Grenze Gotisch', '"Grenze Gotisch", "Texturina", Georgia, serif', 700], texturina: ['Texturina', '"Texturina", Georgia, serif', 600], pirata: ['Pirata One', '"Pirata One", Georgia, serif', 400] };
const FONTS_B = { barlow: ['Barlow Semi Condensed', '"Barlow Semi Condensed", "Arial Narrow", system-ui, sans-serif'], philosopher: ['Philosopher', '"Philosopher", "Trebuchet MS", sans-serif'], saira: ['Saira Semi Condensed', '"Saira Semi Condensed", "Arial Narrow", sans-serif'] };

/* ================= small sprites ================= */
const SPAL = { k: '#1A1412', y: '#D9B35C', Y: '#F0DDA0', G: '#7D746A', g: '#6B625B', r: '#E8772E', o: '#FFA552', R: '#8E2F23', b: '#6F8FB8', B: '#435C80', W: '#F5EEDF', c: '#C9BDA6', w: '#5A4330', h: '#5A4E45', H: '#3E352F', s: '#C89B7B', e: '#1A1412' };
const RELIC = {
  coaster: ['..yyyy..', '.yYYYYy.', 'yYYyyYYy', 'yYyyyyYy', 'yYYyyYYy', '.yYYYYy.', '..yyyy..', '........'],
  crown: ['....G...', '...G.G..', '......G.', 'y..y..y.', 'yy.yy.yy', 'yyyyyyyy', 'yryyyyry', 'yyyyyyyy'],
  stone: ['........', '...bb...', '..bWbb..', '.bWbbbb.', '.bbbbBb.', '..bbBB..', '...BB...', '........'],
  klantern: ['...GG...', '..G..G..', '.GGGGGG.', '.GrYYrG.', '.GYrrYG.', '.GyrryG.', '.GGGGGG.', '........'],
  seal: ['..RRRR..', '.RRRRRR.', 'RRYRRYRR', 'RRRYYRRR', 'RRRYYRRR', 'RRYRRYRR', '.RRRRRR.', '..RRRR..']
};
const ICON = {
  sanctuary: ['...r....', '..rr.r..', '..ror.r.', '.roorrr.', '.royyor.', '.ryYyyr.', '.GGGGGG.', 'G.G..G.G'],
  quests: ['.cccccc.', 'cGccccGc', '.cccccc.', '.cGGGGc.', '.cccccc.', '.cGGGcc.', 'cGccccGc', '.cccccc.'],
  map: ['...GG...', '..GGGG..', '..GrGG..', '.GGGGGG.', 'G.GrrG.G', 'GGGGGGGG', 'GGGrrGGG', 'GGGrrGGG'],
  character: ['..hhhh..', '.hhhhhh.', '.hHssh..', '.hHesh..', '..hhhh..', '.hhhhhh.', 'hhhhhhhh', 'hh....hh']
};
const MINIHERO = ['...hhh....', '..hhhhh...', '..hHssh...', '..hHesh...', '..ccccc...', '.cccccccs.', '.cCcccmc.l', '.cCccccc.l', 'ccCcccccLL', 'ccCcccccLL', 'cCcccccc..', '.cccccc...', '..b..b....'];
const CATFACE = ['O.....T', 'OO...TT', 'ooOoOoo', 'okoooko', 'ooonooo', 'oWWWWWo', '.ooooo.'];
const CAT_SLEEP = ['.......o.o', '..oOoOoooo', '.ooooooQoQ', 'ooooooooWn', 'TTTooooooo'];
const CAT_SIT = [
  ['....o..o', '....oooo', '....okok', '....oonW', '...oooo.', '..oOoOo.', '..ooWWo.', '.ooooooo', 'TT.oo.oo'],
  ['....o..o', '....oooo', '....okok', '....oonW', '...oooo.', 'T.oOoOo.', 'T.ooWWo.', '.ooooooo', '...oo.oo']
];
const CAT_WALK = [
  ['T......o..o', '.T.....oooo', '..oOoOookok', '..oooooooWn', '..ooooooo..', '..o.o..o.o.'],
  ['.T.....o..o', 'T......oooo', '..oOoOookok', '..oooooooWn', '..ooooooo..', '...o..o..o.']
];
const HEART = ['.r.r.', 'rrrrr', '.rrr.', '..r..'];
const SEAL = ['..RRRR..', '.RRRRRR.', 'RRRRRRYR', 'RRRRRYRR', 'RYRRYRRR', 'RRYYRRRR', '.RRRRRR.', '..RRRR..'];
const ICON6 = {
  depart: ['...yy...', '..y..y..', '..cccc..', '.cccccc.', 'cccWcccc', 'cccccccc', '.cccccc.', '........'],
  quest: ['......cW', '.....cW.', '....cW..', '.y.cW...', '..yW....', '..wy....', '.w..y...', 'w.......'],
  upkeep: ['...o....', '...ro...', '...r....', '..cWc...', '..cWc...', '..cWc...', '..cWc...', '.GGGGG..']
};
const COATS = {
  black: { label: 'Black', o: '#262124', O: '#3A3338', T: '#262124', k: '#FFA552', W: '#3E363C' },
  gray: { label: 'Ash', o: '#8A8580', O: '#68635F', T: '#8A8580', k: '#1A1412', W: '#C9C2B8' },
  orange: { label: 'Ginger', o: '#D9813A', O: '#A85E27', T: '#D9813A', k: '#1A1412', W: '#F0D9B5' },
  white: { label: 'Bone', o: '#E7DCC6', O: '#C9BDA6', T: '#E7DCC6', k: '#4A6A8A', W: '#F5EEDF' },
  calico: { label: 'Calico', o: '#E7DCC6', O: '#D9813A', T: '#262124', k: '#1A1412', W: '#F5EEDF' }
};
const coatPal = id => { const c = COATS[id] || COATS.black; return { o: c.o, O: c.O, T: c.T, k: c.k, W: c.W, Q: '#1A1412', n: '#E0604A' }; };
const urlCache = {};
function sprURL(pat, scale, pal, pid, mono) {
  const key = pat.join('|') + '@' + scale + '#' + (pid || '') + (mono || '');
  if (urlCache[key]) return urlCache[key];
  const c = document.createElement('canvas'); c.width = pat[0].length * scale; c.height = pat.length * scale;
  const x = c.getContext('2d');
  pat.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '.') return; x.fillStyle = mono || (pal || SPAL)[ch] || '#ff00ff'; x.fillRect(i * scale, j * scale, scale, scale); }));
  return (urlCache[key] = c.toDataURL());
}
const img = (pat, scale, o) => { o = o || {}; return '<img class="px" src="' + sprURL(pat, scale, o.pal, o.pid, o.mono) + '" alt="' + (o.alt || '') + '">'; };

/* ================= campaign data ================= */
const REGIONS = {
  threshold: { name: 'The Threshold', place: 'Entry, living room and kitchen', short: 'Entry & kitchen', boss: 'The Buried Table', relic: ['Gilded Coaster', 'coaster'] },
  armory: { name: 'The Overfilled Armory', place: 'Bedroom closet, dresser and laundry', short: 'Closet & laundry', boss: 'The Closet That Would Not Close', relic: ['Hanger Crown', 'crown'] },
  chambers: { name: 'The Forgotten Chambers', place: 'Basement storage shelf', short: 'Basement storage', boss: 'The Mountain of “Someday”', bossShort: 'The Mountain', relic: ['Someday Stone', 'stone'] },
  reliquary: { name: 'The Quiet Reliquary', place: 'Spare room keepsake shelf', short: 'Keepsake shelf', boss: 'Make Room for the Past', bossShort: 'The Mourner', relic: ['Keepsake Lantern', 'klantern'] },
  vault: { name: 'The Old Family Vault', place: 'Your parents’ house', short: 'Parents’ house', boss: 'The Keeper of All That Was', bossShort: 'The Keeper', bossTitle: 'Guardian of the Old Family Vault', relic: ['Family Seal', 'seal'] }
};
const REGION_DEFAULTS = JSON.parse(JSON.stringify(REGIONS));
const ORDER = ['threshold', 'armory', 'chambers', 'reliquary', 'vault'];
const PHASES = [
  ['Open the vault', 'Agree on scope with your parents and bring the first batch home.'],
  ['Face the archive', 'Review what is there, one box at a time.'],
  ['Choose what endures', 'Decide what you keep, and what you release.'],
  ['Lay the past to rest', 'Finish every departure and give each keepsake its place.']
];
const STEPS = {
  Donate: [{ t: 'Load the cart', d: 'Put it in your car.' }, { t: 'Deliver it', d: 'Drop it at the donation center.' }],
  Sell: [{ t: 'Post the notice', d: 'Take photos and list it for sale.' }, { t: 'Make the handoff', d: 'Hand it to the buyer.' }],
  'Pass along': [{ t: 'Send word', d: 'Confirm they still want it.' }, { t: 'Make the handoff', d: 'Hand it over.' }],
  Recycle: [{ t: 'Read the rules', d: 'Check what the recycler takes.' }, { t: 'Deliver it', d: 'Drop it off.' }],
  Trash: [{ t: 'Set it out', d: 'Put it out on trash day.' }]
};
const steps = dest => STEPS[dest].map(s => ({ t: s.t, d: s.d }));
const SMALLER_BATCH = {
  Donate: ['Look up the drop-off hours', 'Put it by your keys tonight', 'Pick a day for the trip'],
  Sell: ['Take one photo', 'Write a one-line listing', 'Pick a price'],
  'Pass along': ['Send a one-line text asking if they want it', 'Pick a handoff day'],
  Recycle: ['Look up the drop-off hours', 'Put it by your keys tonight'],
  Trash: ['Move it next to the bin']
};
const STAGE_SMALLER = ['Find a bag or box for it', 'Move it next to the door', 'Do half of it now'];
const SMALLER_QUEST = [['Review five items', 'Stop after five, even mid-box.'], ['Work for ten minutes', 'Set a timer. Stop when it rings.'], ['Only pull out the obvious keepers', 'Leave every hard decision for later.']];
const DESTS = ['Donate', 'Sell', 'Pass along', 'Recycle', 'Trash'];
const TITLES = [[1, 'Wanderer'], [3, 'Lamplighter'], [5, 'Keeper of Drawers'], [7, 'Warden of the Chambers'], [9, 'Bearer of the Hearth'], [12, 'Keeper of the Vault']];

/* ================= cosmetic gear: 7 slots, 3 full sets ================= */
const SLOTS = ['head', 'cloak', 'chest', 'boots', 'weapon', 'shield', 'lantern'];
const SLOT_LABEL = { head: 'Head', cloak: 'Cloak', chest: 'Chest', boots: 'Boots', weapon: 'Weapon', shield: 'Shield', lantern: 'Lantern' };
const GEAR = {
  head: [
    { id: 'hood', name: 'Traveler’s Hood', req: null, kind: 'hood' },
    { id: 'cowl', name: 'Masked Cowl', req: { lvl: 3 }, kind: 'cowl' },
    { id: 'helm', name: 'Iron Helm', req: { lvl: 6 }, kind: 'helm' },
    { id: 'ashhelm', name: 'Ashen Warden Helm', req: { boss: 'threshold' }, kind: 'ashhelm', set: 'ashen' },
    { id: 'emberhelm', name: 'Ember Vanguard Helm', req: { boss: 'chambers' }, kind: 'emberhelm', set: 'ember' },
    { id: 'crownhood', name: 'Crowned Hood', req: { lvl: 9 }, kind: 'crownhood' },
    { id: 'saint', name: 'Reliquary Halo-helm', req: { boss: 'reliquary' }, kind: 'saint', set: 'saint' },
    { id: 'crown', name: 'Crown of All That Was', req: { boss: 'vault' }, kind: 'crown' }
  ],
  cloak: [
    { id: 'worn', name: 'Worn Cloak', req: null, c: '#6A5C52', t: '#4A3E36', style: 'tattered' },
    { id: 'ash', name: 'Ash-grey Cloak', req: { boss: 'threshold' }, c: '#8A847E', t: '#5E5954', set: 'ashen' },
    { id: 'wardrobe', name: 'Wardrobe Mantle', req: { boss: 'armory' }, c: '#5E4670', t: '#3E2C4C', trim: '#C9A24A', style: 'long' },
    { id: 'ember', name: 'Ember Vanguard Cloak', req: { boss: 'chambers' }, c: '#3E302E', t: '#261C1A', trim: '#FF8A3D', glow: 1, style: 'tattered', set: 'ember' },
    { id: 'shroud', name: 'Reliquary Shroud', req: { boss: 'reliquary' }, c: '#3A4A6E', t: '#263048', trim: '#E0C070', style: 'long', set: 'saint' },
    { id: 'regalia', name: 'Vault-keeper’s Regalia', req: { boss: 'vault' }, c: '#8E3430', t: '#5A201E', trim: '#E0C070', style: 'long', fur: true }
  ],
  chest: [
    { id: 'tunic', name: 'Wanderer’s Tunic', req: null, kind: 'tunic' },
    { id: 'leather', name: 'Studded Leather', req: { lvl: 4 }, kind: 'leather' },
    { id: 'mail', name: 'Chain Mail', req: { boss: 'armory' }, kind: 'mail' },
    { id: 'plate', name: 'Ashen Plate', req: { lvl: 8 }, kind: 'plate', set: 'ashen' },
    { id: 'ember', name: 'Ember Vanguard Plate', req: { boss: 'chambers' }, kind: 'ember', set: 'ember' },
    { id: 'saint', name: 'Reliquary Cuirass', req: { boss: 'reliquary' }, kind: 'saint', set: 'saint' }
  ],
  boots: [
    { id: 'wraps', name: 'Foot Wraps', req: null, kind: 'wraps' },
    { id: 'leather', name: 'Leather Boots', req: { lvl: 2 }, kind: 'leather' },
    { id: 'iron', name: 'Iron Greaves', req: { lvl: 5 }, kind: 'iron', set: 'ashen' },
    { id: 'ember', name: 'Cinder Treads', req: { boss: 'chambers' }, kind: 'ember', set: 'ember' },
    { id: 'saint', name: 'Gilded Sabatons', req: { boss: 'reliquary' }, kind: 'saint', set: 'saint' }
  ],
  weapon: [
    { id: 'none', name: 'Empty Hand', req: null, kind: 'none' },
    { id: 'staff', name: 'Walking Staff', req: { lvl: 2 }, kind: 'staff' },
    { id: 'sword', name: 'Armory Sword', req: { boss: 'armory' }, kind: 'sword' },
    { id: 'glaive', name: 'Sweeping Glaive', req: { lvl: 7 }, kind: 'glaive' },
    { id: 'hammer', name: 'Hearthstone Hammer', req: { boss: 'chambers' }, kind: 'hammer' },
    { id: 'keystaff', name: 'Key-staff', req: { boss: 'reliquary' }, kind: 'keystaff' },
    { id: 'blade', name: 'Blade of Resolve', req: { lvl: 12 }, kind: 'blade' }
  ],
  shield: [
    { id: 'none', name: 'No Shield', req: null, kind: 'none' },
    { id: 'buckler', name: 'Wooden Buckler', req: { lvl: 3 }, kind: 'buckler' },
    { id: 'kite', name: 'Iron Kite Shield', req: { boss: 'threshold' }, kind: 'kite' },
    { id: 'crest', name: 'Armory Crest', req: { boss: 'armory' }, kind: 'crest' },
    { id: 'ember', name: 'Ember Aegis', req: { lvl: 10 }, kind: 'ember' },
    { id: 'saint', name: 'Reliquary Ward', req: { boss: 'reliquary' }, kind: 'saint' }
  ],
  lantern: [
    { id: 'small', name: 'Small Lantern', req: null, glow: '#E9B35F', frame: '#4A4038' },
    { id: 'ember', name: 'Ember Lantern', req: { boss: 'chambers' }, glow: '#FF8A3D', frame: '#5A4430' },
    { id: 'spirit', name: 'Spirit Lantern', req: { lvl: 8 }, glow: '#9FD4FF', frame: '#46505E' },
    { id: 'reliquary', name: 'Reliquary Lantern', req: { boss: 'reliquary' }, glow: '#FFD27A', frame: '#B8954A' },
    { id: 'vault', name: 'Lantern of the Vault', req: { boss: 'vault' }, glow: '#FF6A4A', frame: '#7A2E2A' }
  ]
};
const SETS = {
  ashen: { name: 'Ashen Warden', aura: 'silver glints', slots: { head: 'ashhelm', cloak: 'ash', chest: 'plate', boots: 'iron' } },
  ember: { name: 'Ember Vanguard', aura: 'rising embers', slots: { head: 'emberhelm', cloak: 'ember', chest: 'ember', boots: 'ember' } },
  saint: { name: 'Reliquary Saint', aura: 'circling golden motes', slots: { head: 'saint', cloak: 'shroud', chest: 'saint', boots: 'saint' } }
};
const BOOTS = { wraps: { c: '#8A7A60', hi: '#A8987A', sole: '#4A4038', tall: 0 }, leather: { c: '#5A3E26', hi: '#7A5634', sole: '#2A1E14', tall: 2 }, iron: { c: '#8A8E96', hi: '#C0C4CC', sole: '#4A4E56', tall: 3 }, ember: { c: '#3A3436', hi: '#5A5056', sole: '#7A3A20', tall: 3 }, saint: { c: '#D8D0C0', hi: '#F4EEE0', sole: '#B8954A', tall: 3 } };
const CHEST = { tunic: { c: '#7A5A3A', hi: '#94704A', lo: '#5A3E26', paul: [3, 2] }, leather: { c: '#6A4A2E', hi: '#8A6440', lo: '#4A3220', paul: [4, 3] }, mail: { c: '#8A8E96', hi: '#B0B4BC', lo: '#5E626A', paul: [4, 3] }, plate: { c: '#9EA2AA', hi: '#D0D4DC', lo: '#6A6E76', paul: [5, 4] }, ember: { c: '#3E3638', hi: '#5E5458', lo: '#241E20', paul: [5, 4], trim: '#7A3A20' }, saint: { c: '#D8D0C0', hi: '#F4EEE0', lo: '#A89C88', paul: [5, 4], trim: '#C9A24A' } };
const WPN = { staff: { pole: 1, len: 20, shaft: '#7A5634' }, keystaff: { pole: 1, len: 22, shaft: '#7A5634' }, glaive: { pole: 1, len: 22, shaft: '#6B4A2E' }, sword: { blade: '#C0C4CC', bladeL: 13, shaft: '#5A3E26', guard: '#C9A24A' }, blade: { blade: '#E8ECF4', bladeL: 16, shaft: '#3A2E3A', guard: '#E0C070' }, hammer: { len: 13, shaft: '#6A4A30', head: '#4A4446' } };
