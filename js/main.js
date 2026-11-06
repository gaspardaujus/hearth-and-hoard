'use strict';
/* ================= start up ================= */
(function boot() {
  const saved = loadState();
  if (saved) { S = saved; applyNames(); rollWeek(); }
  else { S = newGame(STARTER); S.firstRun = true; applyNames(); }
  render();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render());
  if (!REDUCED) requestAnimationFrame(loop);
  if (S.firstRun) setTimeout(welcome, 400);
  else { askPersist(); if (!S.tutorialDone) setTimeout(startTalk, 700); }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && S && !cut) { rollWeek(); render(); } });
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController) updateReady(); });
  }
})();
