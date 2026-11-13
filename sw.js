/* Service worker manuel.
   A single VERSION, taken from the registration URL (?v=), is used for
   the cache name, the precache query strings, and the page's
   navigator.serviceWorker.register('./sw.js?v=' + VERSION).
   HTML and data.js are network-first. skipWaiting + clients.claim.
   Old caches are deleted on activate.
   GLBs are not precached (versioned names + runtime cache-first).
   Basis transcoder and sound files are precached. Benchmarks are cached on demand, not precached. */
const VERSION = new URL(self.location.href).searchParams.get('v') || '0';
const VER = 'c204-2026-v' + VERSION;
const PRECACHE = [
  './',
  './index.html',
  './style.css?v=' + VERSION,
  './main.js?v=' + VERSION,
  './data.js?v=' + VERSION,
  './vendor/basis/basis_transcoder.js',
  './vendor/basis/basis_transcoder.wasm',
  './vendor/detect-gpu.esm.js',
  './assets/sfx/amb_engine.ogg',
  './assets/sfx/wheels_roll.ogg',
  './assets/sfx/door_open.ogg',
  './assets/sfx/door_close.ogg',
  './assets/sfx/ui_click.ogg',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VER);
    await Promise.all(PRECACHE.map((u) => c.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VER).map((k) => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const threeCdn = url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('three@0.170.0/');
  if (url.origin !== self.location.origin && !threeCdn) return;

  const isDoc = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  const isData = url.pathname.endsWith('/data.js');
  if (isDoc || isData) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const c = await caches.open(VER);
        c.put(req, fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(req)) || (isDoc ? (await caches.match('./index.html')) : undefined);
      }
    })());
    return;
  }

  const path = url.pathname;
  const known = /\/(assets|vendor|detect-gpu-benchmarks)\//.test(path)
    || /[?&]v=/.test(url.search)
    || threeCdn;
  if (!known) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) {
          const c = await caches.open(VER);
          c.put(req, fresh.clone());
        }
        return fresh;
      } catch {
        return caches.match(req);
      }
    })());
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    const fresh = await fetch(req);
    if (fresh && fresh.ok) {
      const c = await caches.open(VER);
      c.put(req, fresh.clone());
    }
    return fresh;
  })());
});
