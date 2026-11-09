# Hearth & Hoard

A personal, game-like web app for reclaiming a home one real task at a time. Your home is a ruined keep: finishing quests, getting things out the door and keeping up with chores brings the light back, region by region, boss by boss.

- Plain HTML, CSS and JavaScript. No framework, no build step, no server, no accounts.
- Installs to a phone's home screen and works offline.
- Progress is stored only on the device. Back up from the hearth or the Character tab; a backup is a JSON file you keep.
- Personal campaigns (real rooms, family details) are imported on the device as files and are never committed to this repository.

## Run it locally

```
node tools/serve.mjs 5173
```

Then open http://localhost:5173.

## Publish

GitHub Pages: Settings > Pages > Deploy from a branch > `main`, root folder.

Whenever any app file changes, bump `VERSION` in `sw.js` so installed copies pick up the update.

## Layout

| Path | What it holds |
|---|---|
| `index.html` | The page and the order the scripts load in |
| `css/app.css` | All styles |
| `js/core.js` | Constants, sprites, region defaults, gear tables |
| `js/campaign-default.js` | The starter campaign, "A Home of Your Own" |
| `js/rules.js` | Game state variables and rules: dates, bosses, milestones, gear unlocks |
| `js/state.js` | Saving, loading, schema upgrades, backups, campaign import |
| `js/engine.js` | Sound, canvas, lighting, props and particles |
| `js/art-chars.js`, `js/art-world.js` | The hero, the cat, the bosses, the region scenes and the map |
| `js/play.js` | Boss reactions, the defeat cutscene, XP and rewards |
| `js/ledger.js` | The Ledger of Release (what has left the house), rank seals, treat unlocks and the sale-price prompt |
| `js/views.js`, `js/actions.js` | Screens, sheets, the guide and every button |
| `js/editor.js` | Adding, renaming and deleting quests, chores, departures and treats |
| `js/main.js` | Start-up and offline registration |
| `sw.js`, `manifest.webmanifest`, `icons/` | Offline support and home-screen install |
| `tools/` | Local test server and the icon generator |

The script files share one scope and load in the order listed in `index.html`.

## Campaign files

A campaign file looks like this (trimmed):

```json
{
  "app": "hearth-and-hoard",
  "kind": "campaign",
  "schema": 1,
  "campaign": {
    "name": "A Home of Your Own",
    "start": "threshold",
    "regions": {
      "threshold": {
        "place": "Entry, living room and kitchen",
        "target": "The kitchen table",
        "treat": "A lazy day off",
        "milestones": ["The table is clear and usable", { "text": "Everything leaving has left", "auto": "allgone" }]
      }
    },
    "quests": [{ "region": "threshold", "title": "Clear one corner of the table", "kind": "sort" }],
    "upkeep": [{ "title": "Reset the kitchen", "region": "threshold", "every": 1 }],
    "treats": [
      { "text": "Pizza night", "unlock": { "kind": "level", "level": 5 } },
      { "text": "A massage", "unlock": { "kind": "seal", "dest": "Donate", "tier": 2 } }
    ]
  }
}
```

A region's `"treat"` unlocks when that region's boss falls. Entries in `"treats"` say what earns them: `{ "kind": "boss", "boss": "armory" }`, `{ "kind": "level", "level": 5 }`, or `{ "kind": "seal", "dest": "Donate", "tier": 2 }`. Seals are ranks for things donated, sold, passed along, recycled and thrown away; tiers 1 to 6 are earned at 1, 10, 25, 50, 100 and 250 things.

Regions are `threshold`, `armory`, `chambers`, `reliquary` and `vault`. A milestone with `"auto": "allgone"` ticks itself once that region's departures have left the house and none are waiting; if nothing from the region needs to leave, it ticks along with the last of the other milestones. `"onegone"` ticks once the first departure has left. Regions before `"start"` begin reclaimed, with their milestones met. A quest can `"repeat"` a number of times, or `"waitsOn"` someone after you do your part.
