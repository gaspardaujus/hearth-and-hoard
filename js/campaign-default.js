'use strict';
/* ================= the starter campaign =================
   Ships with the app. A personal campaign (real rooms, family details) is imported from a file on the device
   and never lives in this code. Milestones marked "allgone" tick themselves once every departure for that
   region has left the house; "onegone" ticks once the first one has. */
const STARTER = {
  name: 'A Home of Your Own',
  start: 'threshold',
  regions: {
    threshold: {
      place: 'Entry, living room and kitchen', short: 'Everyday rooms', target: 'The kitchen or dining table',
      milestones: [
        'The table is completely clear and usable for a meal',
        'Everything that was on it has a home or a next step',
        'Nothing was just moved to another pile',
        { text: 'Everything leaving these rooms has actually left', auto: 'allgone' }
      ]
    },
    armory: {
      place: 'Bedroom closet, dresser and laundry', short: 'Closet & laundry', target: 'The bedroom closet',
      milestones: [
        'The closet closes easily and the floor is clear',
        'Every kept item fits on a hanger, a shelf or in a bin',
        'Clothes that are leaving have a destination',
        { text: 'The first donation has actually left the house', auto: 'onegone' }
      ]
    },
    chambers: {
      place: 'Basement, garage or storage closet', short: 'Deep storage', target: 'One shelf unit or five boxes',
      milestones: [
        'The target is sorted: every item has a home or a destination',
        'Kept items have an assigned, labeled spot',
        { text: 'Everything leaving has actually left', auto: 'allgone' },
        'Undecided items are on the review-later list with a date'
      ]
    },
    reliquary: {
      place: 'A keepsake shelf or chest', short: 'Keepsake spot', target: 'Ready for what comes home',
      milestones: [
        'A clear space to receive and sort what comes home',
        'A chosen, cleared home for keepsakes',
        'A retrieval plan agreed with your family',
        'A first batch size that fits in one trip'
      ]
    },
    vault: { place: 'Family belongings kept elsewhere', short: 'Family belongings' }
  },
  quests: [
    { region: 'threshold', title: 'Clear one corner of the table', desc: 'Give everything on one corner of the table a home or a destination.', kind: 'sort' },
    { region: 'threshold', title: 'Shoes and coats away', desc: 'Put away the shoes and coats piled by the door.' },
    { region: 'threshold', title: 'Clear one counter section', desc: 'Clear and wipe one section of kitchen counter.' },
    { region: 'threshold', title: 'Gather the dishes', desc: 'Collect stray dishes and cups from every room.' },
    { region: 'threshold', title: 'Clear one chair or side table', desc: 'Pick one and clear it completely.', kind: 'sort' },
    { region: 'threshold', title: 'Fill one bag', desc: 'Fill one bag of trash or recycling.' },
    { region: 'armory', title: 'Sort one dresser drawer', desc: 'Keep what you wear. Give the rest a destination.', kind: 'sort' },
    { region: 'armory', title: 'Review the shoe shelf', desc: 'Keep the pairs you wear.', kind: 'sort' },
    { region: 'armory', title: 'Gather the duplicates', desc: 'Collect clothes you have more than enough of.', kind: 'sort' },
    { region: 'armory', title: 'Choose donations', desc: 'Pick clothes that no longer fit or never get worn.', kind: 'sort' },
    { region: 'armory', title: 'Put the keepers away', desc: 'Hang or fold everything you are keeping.' },
    { region: 'chambers', title: 'Walk the storage', desc: 'Note roughly what is there, shelf by shelf.' },
    { region: 'chambers', title: 'Open a forgotten box', desc: 'Review one box. Choose what stays. Give everything else a destination.', kind: 'sort', repeat: 5 },
    { region: 'chambers', title: 'Hunt the doubles', desc: 'Find duplicates across the house and set the extras aside.', kind: 'sort' },
    { region: 'chambers', title: 'Label the kept containers', desc: 'Every bin you keep gets a label.' },
    { region: 'reliquary', title: 'Send word home', desc: 'Ask your family what is still there and what they need gone.', waitsOn: 'your family' },
    { region: 'reliquary', title: 'Choose the sorting space', desc: 'Pick where boxes will land when they come home.' },
    { region: 'reliquary', title: 'Clear the keepsake spot', desc: 'Clear one shelf or chest for keepsakes.' },
    { region: 'reliquary', title: 'Plan the trip', desc: 'Pick a collection date and how the boxes will travel.' }
  ],
  upkeep: [
    { title: 'Reset the kitchen', region: 'threshold', every: 1 },
    { title: 'Return stray things to where they live', region: 'threshold', every: 3 },
    { title: 'Put away one laundry load', region: 'armory', every: 3 },
    { title: 'Make the bed', region: 'armory', every: 1 }
  ],
  treats: []
};
