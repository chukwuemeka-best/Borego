const V='borego-v6',FILES=['./','index.html','app.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='borego-avatar-cache-v1').map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})
    .catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('app.html'):Response.error()))));
});

self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){try{d={body:e.data.text()}}catch(__){}}
  if(Number.isFinite(Number(d.unreadCount))&&'setAppBadge' in self.registration){try{if(Number(d.unreadCount)>0){const bp=self.registration.setAppBadge(Number(d.unreadCount));if(bp&&bp.catch)bp.catch(()=>{})}else if('clearAppBadge' in self.registration){const bp=self.registration.clearAppBadge();if(bp&&bp.catch)bp.catch(()=>{})}}catch(_){}}
  const o={body:String(d.body||'').slice(0,200),icon:'icon-192.png',badge:'icon-192.png',data:{url:d.url||'app.html'}};
  if(d.tag){o.tag=String(d.tag);o.renotify=true}
  e.waitUntil(self.registration.showNotification(String(d.title||'Borego').slice(0,80),o))});
self.addEventListener('notificationclick',e=>{e.notification.close();
  const u=new URL((e.notification.data&&e.notification.data.url)||'app.html',self.registration.scope).href;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if(c.url.startsWith(self.registration.scope)&&'focus' in c)return c.focus()}return clients.openWindow(u)}))});
