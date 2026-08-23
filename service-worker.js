
const CACHE='kpa-public-v7';
const ASSETS=[
 './','./index.html','./about.html','./academics.html','./admissions.html','./wellness.html',
 './leadership.html','./facilities.html','./news.html','./events.html','./gallery.html',
 './achievements.html','./calendar.html','./downloads.html','./faq.html','./contact.html','./portal.html',
 './assets/css/styles.css','./assets/js/main.js','./assets/images/kpa-logo.jpg'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;
  }).catch(()=>caches.match('./index.html'))));
});
