/* Borego PWA service worker — offline app shell, cache refresh, and push notifications. */
const CACHE = 'borego-shell-v7';
const SHELL = ['./', './index.html', './app.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './logo.png'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(SHELL.map(async path => {
      try {
        const response = await fetch(path, { cache: 'reload' });
        if (response && response.ok) await cache.put(path, response);
      } catch (_) { /* Optional asset; do not prevent the app shell installing. */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('borego-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE);
          const path = url.pathname.endsWith('/index.html') || url.pathname.endsWith('/') ? './index.html' : './app.html';
          await cache.put(path, fresh.clone());
        }
        return fresh;
      } catch (_) {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(request) || await cache.match('./app.html') || await cache.match('./index.html');
        return cached || new Response('Borego is not available offline yet. Open it once while connected to the internet.', {status:503, headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) {
      event.waitUntil(fetch(request).then(response => { if (response && response.ok) return cache.put(request, response.clone()); }).catch(() => {}));
      return cached;
    }
    try {
      const response = await fetch(request);
      if (response && response.ok) event.waitUntil(cache.put(request, response.clone()));
      return response;
    } catch (_) { return Response.error(); }
  })());
});

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (_) { try { data = {body: event.data.text()}; } catch (__) {} }
  const options = {body:String(data.body || '').slice(0,200), icon:'./icon-192.png', badge:'./icon-192.png', data:{url:data.url || 'app.html'}};
  if (data.tag) { options.tag = String(data.tag); options.renotify = true; }
  event.waitUntil(self.registration.showNotification(String(data.title || 'Borego').slice(0,80), options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || 'app.html', self.registration.scope).href;
  event.waitUntil(self.clients.matchAll({type:'window', includeUncontrolled:true}).then(async windows => {
    for (const client of windows) {
      if (client.url.startsWith(self.registration.scope)) {
        await client.focus();
        if ('navigate' in client && client.url !== target) await client.navigate(target);
        return;
      }
    }
    return self.clients.openWindow(target);
  }));
});
