const OFFLINE_CACHE_NAME = 'offline-cache';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(OFFLINE_CACHE_NAME).then((cache) => {
      return cache.add(OFFLINE_URL);
    }),
  );
});

self.addEventListener('activate', () => {
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      }),
    );
  }
});
