const CACHE = 'motoroadbook-v2';
const ASSETS = [
  './', './index.html', './style.css', './app.js', './manifest.json', './itinerari.json', './icon.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    // Memorizza anche i tile già visualizzati: una zona percorsa resta disponibile offline.
    if (new URL(event.request.url).origin === location.origin || /tile\.openstreetmap\.org$/.test(new URL(event.request.url).hostname)) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); }
    return response;
  }).catch(() => caches.match('./index.html'))));
});
