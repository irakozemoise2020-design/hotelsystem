// Keeps the app shell, always asks the network first so staff get updates at once. Data requests are never cached.
const CACHE = 'hotel-shell-v1', SHELL = ['./', 'index.html', 'i18n.js', 'config.js', 'manifest.webmanifest', 'icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res; }).catch(() => caches.match(r).then(m => m || new Response('You are offline. Connect to the internet to use the hotel system.', { status: 503, headers: { 'Content-Type': 'text/plain' } }))));
});
