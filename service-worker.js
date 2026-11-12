/* Understand Quran PWA — keep learning documents network-fresh. */
const CACHE_NAME = 'uq-pwa-shell-v1';
const OFFLINE_SHELL = ['./', './index.html', './styles.css', './uq-experience.css', './uq-experience.js', './uq-reading.js', './quran-paras.js', './quran.css', './app.js', './vendor/jszip.min.js', './assets/favicon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('uq-pwa-shell-') && key !== CACHE_NAME).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Never cache DOCX, PDF, or remote learning content. New Para versions stay fresh.
  if (/\.(?:docx|pdf)(?:$|\?)/i.test(url.pathname)) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('./index.html')));
  }
});
