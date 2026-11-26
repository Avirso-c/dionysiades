// Service worker : réseau d'abord (pour toujours avoir la dernière version), cache en secours hors connexion.
const CACHE = 'dionysiades-v1', FICHIERS = ['./', './index.html', './manifest.webmanifest', './icon-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', (e) => { const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // la base de données ne passe jamais par le cache
  e.respondWith(fetch(e.request).then((r) => { const copie = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copie)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))); });
