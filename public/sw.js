const PREFIX='dnd-shell-';const CACHE=PREFIX+'__BUILD_ID__';const ASSETS=__PRECACHE_ASSETS__;
const scope=self.registration.scope;const absolute=p=>new URL(p,scope).href;const shell=absolute('index.html');
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(absolute))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!e.request.url.startsWith(scope))return;e.respondWith((async()=>{const c=await caches.open(CACHE);if(e.request.mode==='navigate'){try{const r=await fetch(e.request);if(r.ok)return r;}catch{}const fallback=await c.match(shell);return fallback||Response.error();}const cached=await c.match(e.request.url);return cached||fetch(e.request);})());});
