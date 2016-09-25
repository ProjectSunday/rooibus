this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('rooibus').then(function(cache) {
      return cache.addAll([
        './',
        './index.html',
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});