const CACHE='agenda-v12';
const FICHEIROS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FICHEIROS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  // pedidos de dados nunca vao a cache
  if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
  e.respondWith(
    fetch(e.request).then(r=>{
      const cl=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cl));return r;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
