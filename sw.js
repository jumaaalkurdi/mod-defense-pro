const VERSION = 'pro-v1.0.0';
const STATIC_CACHE = 'mod-pro-static-' + VERSION;
const RUNTIME_CACHE = 'mod-pro-runtime-' + VERSION;

const PRECACHE = ['/', '/index.html', '/styles.css', '/design-pro.css', '/security.js', '/data.js', '/app.js', '/design-pro.js', '/pwa.js', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE).catch(() => {})).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== STATIC_CACHE && k !== RUNTIME_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('message', (event) => {
  if(event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.hostname === 'api.github.com') return;
  if(url.hostname === 'raw.githubusercontent.com'){
    event.respondWith(fetch(req).then(res => {
      if(res && res.status === 200){ const clone = res.clone(); caches.open(RUNTIME_CACHE).then(c => c.put(req, clone)); }
      return res;
    }).catch(() => caches.match(req)));
    return;
  }
  if(url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'){
    event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
      if(res && res.status === 200){ const clone = res.clone(); caches.open(RUNTIME_CACHE).then(c => c.put(req, clone)); }
      return res;
    })));
    return;
  }
  if(url.origin === location.origin){
    event.respondWith(caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if(res && res.status === 200 && res.type === 'basic'){ const clone = res.clone(); caches.open(RUNTIME_CACHE).then(c => c.put(req, clone)); }
        return res;
      }).catch(() => cached || caches.match('/index.html'));
      return cached || network;
    }));
    return;
  }
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
