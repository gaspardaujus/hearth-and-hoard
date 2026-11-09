// Makes the weekly "Hearth night" calendar files the app links to: cal/hearth-<day>-<hhmm>.ics, one for every day of
// the week and every half hour from 5:00 PM to 10:00 PM. iPhones add an event from a real .ics file that Safari opens,
// but not from one a page builds on the fly, so the files are made ahead of time and published with the app.
// Each event repeats weekly, lasts 15 minutes and alerts at its start time. Run: node tools/make-calendar.mjs
import { mkdirSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'cal');
const DAYS = [['mon', 'MO'], ['tue', 'TU'], ['wed', 'WE'], ['thu', 'TH'], ['fri', 'FR'], ['sat', 'SA'], ['sun', 'SU']];
const TIMES = [];
for (let m = 17 * 60; m <= 22 * 60; m += 30) TIMES.push(String(Math.floor(m / 60)).padStart(2, '0') + String(m % 60).padStart(2, '0'));
const FIRST_MONDAY = Date.UTC(2026, 10, 9);   // the series starts in the week of Monday 9 November 2026
const STAMP = '20261109T000000Z';
const text = s => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
// RFC 5545: lines end in CRLF and fold at 75 octets; a continuation line starts with one space
function fold(line) {
  const parts = []; let cur = '', n = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch);
    if (n + b > (parts.length ? 74 : 75)) { parts.push(cur); cur = ''; n = 0; }
    cur += ch; n += b;
  }
  parts.push(cur);
  return parts.join('\r\n ');
}
const ymd = ms => new Date(ms).toISOString().slice(0, 10).replace(/-/g, '');

mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) if (f.endsWith('.ics')) rmSync(join(out, f));
let count = 0;
DAYS.forEach(([day, by], i) => TIMES.forEach(t => {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Hearth and Hoard//Hearth night//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:hearth-night-' + day + '-' + t + '@hearth-and-hoard',
    'DTSTAMP:' + STAMP,
    'DTSTART:' + ymd(FIRST_MONDAY + i * 864e5) + 'T' + t + '00',   // no time zone: the phone's own local time
    'DURATION:PT15M',
    'RRULE:FREQ=WEEKLY;BYDAY=' + by,
    'SUMMARY:' + text('Hearth night · Hearth & Hoard'),
    'DESCRIPTION:' + text('Open Hearth & Hoard from your home screen and tend the hearth: what left, what is stuck, what is due, and what comes next. About five minutes.'),
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + text('Hearth night: tend the hearth'), 'TRIGGER:PT0S', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'
  ];
  writeFileSync(join(out, 'hearth-' + day + '-' + t + '.ics'), lines.map(fold).join('\r\n') + '\r\n');
  count++;
}));
console.log('Wrote ' + count + ' calendar files to cal/');
