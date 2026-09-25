const VERSION = 'pro-v2-' + Date.now();
const RUNTIME_CACHE = 'mod-pro-runtime-' + VERSION;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if(event.data && event.data.type === 'SKIP_WAITING'){
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if(req.method !== 'GET') return;

  const url = new URL(req.url);

  if(url.hostname === 'api.github.com') return;

  if(url.hostname === 'raw.githubusercontent.com'){
    event.respondWith(
      fetch(req).then(res => {
        if(res && res.status === 200){
          const clone = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  if(url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'){
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if(res && res.status === 200){
          const clone = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
        }
        return res;
      }))
    );
    return;
  }

  // Network First للجميع
  event.respondWith(
    fetch(req).then(res => {
      if(res && res.status === 200 && res.type === 'basic'){
        const clone = res.clone();
        caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
      }
      return res;
    }).catch(() => caches.match(req).then(c => c || caches.match('/index.html')))
  );
});

/* ══════════════════════════════════════════════════════════
   NOTIFICATIONS SUPPORT
   ══════════════════════════════════════════════════════════ */
self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var urlToOpen = event.notification.data && event.notification.data.url;
  if(!urlToOpen){
    var body = event.notification.body || '';
    urlToOpen = '/';
  }
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList){
      for(var i = 0; i < clientList.length; i++){
        var c = clientList[i];
        if('focus' in c){
          c.focus();
          if('navigate' in c && urlToOpen) c.navigate(urlToOpen);
          return;
        }
      }
      if(clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});
