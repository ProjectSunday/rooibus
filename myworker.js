
// function getLocation() {





// 	navigator.geolocation.getCurrentPosition(function (loc) { 

// 		var now = new Date()1111111

// 		var msg = now.toString()

// 		msg += ' accuracy: ' + loc.coords.accuracy
// 		msg += ' longitude: ' + loc.coords.longitude
// 		msg += ' latitude: ' + loc.coords.latitude

// 		postMessage(msg)

// 		setTimeout(getLocation, 1000)

// 	})

// }

// getLocation()

self.onmessage(function (e) {
	console.log('myworker message received')
	console.log(e.data)
})