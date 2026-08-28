const CACHE='kpa-v16-authentic-content';
const STATIC=[
 './assets/css/styles.css','./assets/js/main.js','./assets/images/kpa-logo.jpg',
 './assets/svg/living-crest.svg','./assets/svg/kpa-geometry.svg'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);if(u.origin!==location.origin)return;
  // Never cache live configuration, admin dashboard, or CMS/API loader modules.
  if(u.pathname.includes('/admin/')||u.pathname.endsWith('/assets/js/supabase-config.js')||u.pathname.endsWith('/assets/js/cms.js')||u.pathname.endsWith('/assets/js/admissions.js')||u.pathname.endsWith('/assets/js/contact.js')){
    e.respondWith(fetch(e.request));return;
  }
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res})));
});
