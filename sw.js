const V='borego-v8-global-buzz-rings',FILES=['./','index.html','app.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES.filter(Boolean))).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})
  .catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('app.html'):Response.error()))));
});

async function boregoChatIsVisible(conversationId){
 if(!conversationId)return false;
 const list=await self.clients.matchAll({type:'window',includeUncontrolled:true});
 for(const client of list){
  if(client.visibilityState!=='visible')continue;
  const active=await new Promise(resolve=>{
   const channel=new MessageChannel();let settled=false;
   const finish=v=>{if(settled)return;settled=true;try{channel.port1.close()}catch(_){}resolve(!!v)};
   channel.port1.onmessage=e=>finish(e.data&&e.data.active);
   setTimeout(()=>finish(false),450);
   try{client.postMessage({type:'BOREGO_CHECK_ACTIVE_CHAT',conversationId},[channel.port2])}catch(_){finish(false)}
  });
  if(active)return true;
 }
 return false;
}

self.addEventListener('push',e=>{
 let d={};try{d=e.data?e.data.json():{}}catch(_){try{d={body:e.data.text()}}catch(__){}}
 e.waitUntil((async()=>{
  if(await boregoChatIsVisible(String(d.conversationId||'')))return;
  if(Number.isFinite(Number(d.unreadCount))&&'setAppBadge' in self.registration){try{if(Number(d.unreadCount)>0){const bp=self.registration.setAppBadge(Number(d.unreadCount));if(bp&&bp.catch)bp.catch(()=>{})}else if('clearAppBadge' in self.registration){const bp=self.registration.clearAppBadge();if(bp&&bp.catch)bp.catch(()=>{})}}catch(_){}}
  const avatar=String(d.avatarUrl||d.icon||'icon-192.png');
  const o={body:String(d.body||'').slice(0,200),icon:avatar,badge:'icon-192.png',data:{url:d.url||'app.html',conversationId:d.conversationId||''},renotify:false};
  if(d.conversationId)o.tag='borego-chat-'+String(d.conversationId);
  await self.registration.showNotification(String(d.title||'Borego').slice(0,80),o);
 })());
});
self.addEventListener('notificationclick',e=>{e.notification.close();
 const u=new URL((e.notification.data&&e.notification.data.url)||'app.html',self.registration.scope).href;
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if(c.url.startsWith(self.registration.scope)&&'focus'in c)return c.focus()}return self.clients.openWindow(u)}));
});
