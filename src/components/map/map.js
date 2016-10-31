import React from 'react'

export default class Map extends React.Component {
	componentDidMount() {
		// console.log('componentDidMount');

		initGoogleMap(this.refs.map)
		// doThings();
	}
	render() {
		return (
			<div ref="map" style={styles.map}> yooo 5555 </div>
		)		
	}
}

const styles = {
	map: {
		width: '300px',
		height: '100px'
	}
}

async function initGoogleMap(node) {
	if (!window.initMap) {
		window.initMap = initMap
	}

	if (!window.google) {
		await getGoogleObject()
	}


	var map = new google.maps.Map(node, {
	    center: {lat: -34.397, lng: 150.644},
	    scrollwheel: false,
	    zoom: 8
	})


}

async function getGoogleObject() {
	return new Promise((resolve, reject) => {
		window._rooibusGoogleMapLoaded = function () {
			console.log('resolving _rooibusGoogleMapLoaded')
			resolve()
		}

		var script = document.createElement('script')
		script.type = 'text/javascript'
		script.async = false;
		script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCzx7FndCtugg9jcduxA6pK_IKlr7EJYhY&callback=_rooibusGoogleMapLoaded`

		script.addEventListener('error', function () {
			console.error('Fatal Error: unable to load the google maps api')
			reject()
		})

		document.body.append(script)
	})
}


function doThings() {
	console.log('dothings', document)


	var script = document.createElement('script')

	script.type = 'text/javascript'
	script.async = false;


	var apiKey = 'AIzaSyCzx7FndCtugg9jcduxA6pK_IKlr7EJYhY'

	var src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`

	script.src = src

	script.addEventListener('load', function () {
		console.log('onload')
	})

	script.addEventListener('error', function () {
		console.log('error')
	})


	window.initMap= initMap;

	document.body.append(script)
	console.log('append')

}

function initMap() {
	console.log('initMap called', window.google)


}