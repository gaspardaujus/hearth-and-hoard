'use strict';
/* Offline support. Bump VERSION whenever any app file changes so installed copies fetch the update. */
const VERSION = 'hearth-1.0.1';
const CORE = 'core-' + VERSION, FONTS = 'fonts-v1';
const ASSETS = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css',
  'js/core.js', 'js/campaign-default.js', 'js/rules.js', 'js/state.js', 'js/engine.js', 'js/art-chars.js',
  'js/art-world.js', 'js/play.js', 'js/views.js', 'js/actions.js', 'js/main.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'
];
/* The Google Fonts stylesheets that index.html loads (keep the two lists the same). The first page load happens before
   this worker is in control, so on install it saves each stylesheet and the Latin font files it points to. That way
   the very first launch already works offline with the real typefaces. */
const FONT_CSS = [
  'https://fonts.googleapis.com/css2?family=Grenze+Gotisch:wght@500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Texturina:wght@500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Pirata+One&display=swap',
  'https://fonts.googleapis.com/css2?family=Philosopher:wght@400;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Saira+Semi+Condensed:wght@400;500;600;700&display=swap'
];
const LATIN_FACE = /\/\*\s*latin\s*\*\/\s*@font-face\s*\{[^}]*?url\((['"]?)(https:\/\/fonts\.gstatic\.com\/[^)'"]+)\1\)/g;
function warmFonts() {
  return caches.open(FONTS).then(c => Promise.all(FONT_CSS.map(u => fetch(u).then(res => {
    if (!res.ok) return;
    return res.clone().text().then(css => c.put(u, res).then(() => {
      const files = [...new Set([...css.matchAll(LATIN_FACE)].map(m => m[2]))];
      return Promise.all(files.map(f => c.match(f, { ignoreVary: true }).then(hit => hit || fetch(f).then(r => r.ok ? c.put(f, r) : null))));
    }));
  }).catch(() => {}))));   // offline or blocked: the fetch handler below saves fonts on a later launch instead
}
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CORE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(warmFonts).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CORE && k !== FONTS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(c => c.match(req, { ignoreVary: true }).then(hit => {
      const net = fetch(req).then(res => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }
  if (url.origin !== self.location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).catch(() => req.mode === 'navigate' ? caches.match('index.html') : Response.error())));
});
