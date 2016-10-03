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


// this.addEventListener('periodicsync', function(event) {
//     if (event.registration.tag == "periodicSync") {
//         console.log("Periodic event occurred: ", event);
//     }
// });


this.addEventListener('sync', function(event) {
  if (event.tag == 'myFirstSync') {
    event.waitUntil(doSomeStuff());
  }
});

function doSomeStuff() {
	return new Promise(function (resolve, reject) => {
		console.log('inside promise')
		setTimeout(function () {
			console.log('resolving')
			resolve()
		}, 10000)
	})
}

