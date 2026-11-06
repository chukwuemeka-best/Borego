const V = 'borego-v9-media-buzz-ratings';
const FILES = [
  './', 'index.html', 'app.html', 'config.js', 'sw.js',
  'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(V);
    await Promise.all(FILES.map(async path => {
      try {
        const response = await fetch(path, { cache: 'reload' });
        if (response.ok) await cache.put(path, response);
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== V).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const copy = response.clone();
        caches.open(V).then(cache => cache.put(request, copy)).catch(() => {});
      }
      return response;
    } catch (_) {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const app = await caches.match('app.html');
        if (app) return app;
        const home = await caches.match('index.html');
        if (home) return home;
      }
      return Response.error();
    }
  })());
});

async function boregoChatIsVisible(conversationId) {
  if (!conversationId) return false;
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of windows) {
    if (client.visibilityState !== 'visible') continue;
    const active = await new Promise(resolve => {
      const channel = new MessageChannel();
      let settled = false;
      const finish = value => {
        if (settled) return;
        settled = true;
        try { channel.port1.close(); } catch (_) {}
        resolve(!!value);
      };
      channel.port1.onmessage = event => finish(event.data && event.data.active);
      setTimeout(() => finish(false), 450);
      try {
        client.postMessage({ type: 'BOREGO_CHECK_ACTIVE_CHAT', conversationId }, [channel.port2]);
      } catch (_) { finish(false); }
    });
    if (active) return true;
  }
  return false;
}

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (_) { try { data = { body: event.data.text() }; } catch (__) {} }
  event.waitUntil((async () => {
    if (await boregoChatIsVisible(String(data.conversationId || ''))) return;
    const count = Number(data.unreadCount);
    if (Number.isFinite(count) && 'setAppBadge' in self.registration) {
      try {
        if (count > 0) await self.registration.setAppBadge(count);
        else if ('clearAppBadge' in self.registration) await self.registration.clearAppBadge();
      } catch (_) {}
    }
    const avatar = String(data.avatarUrl || data.icon || 'icon-192.png');
    const options = {
      body: String(data.body || '').slice(0, 200),
      icon: avatar,
      badge: 'icon-192.png',
      data: { url: data.url || 'app.html', conversationId: data.conversationId || '' },
      renotify: false
    };
    if (data.conversationId) options.tag = 'borego-chat-' + String(data.conversationId);
    await self.registration.showNotification(String(data.title || 'Borego').slice(0, 80), options);
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const data = event.notification.data || {};
  const target = new URL(data.url || 'app.html', self.registration.scope);
  if (data.conversationId) target.searchParams.set('conversation', String(data.conversationId));
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async windows => {
    for (const client of windows) {
      if (client.url.startsWith(self.registration.scope) && 'focus' in client) {
        await client.focus();
        if ('navigate' in client) return client.navigate(target.href);
        return;
      }
    }
    return self.clients.openWindow(target.href);
  }));
});
