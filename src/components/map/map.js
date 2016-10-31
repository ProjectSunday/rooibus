import React from 'react'

export default class Map extends React.Component {
	componentDidMount() {
		// console.log('componentDidMount');
		initGoogleMap(this.refs.map)
	}
	componentDidUpdate() {
		console.log('map componentDidUpdate')
	}
	render() {
		return (
			<div>
				<div ref="map" style={styles.map}></div>
			</div>
		)		
	}
}

const styles = {
	map: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	}
}

async function initGoogleMap(node) {
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
			// console.log('resolving _rooibusGoogleMapLoaded')
			resolve()
		}

		var script = document.createElement('script')
		script.type = 'text/javascript'
		script.async = false
		script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCzx7FndCtugg9jcduxA6pK_IKlr7EJYhY&callback=_rooibusGoogleMapLoaded`

		script.addEventListener('error', function () {
			console.error('Fatal Error: unable to load the google maps api')
			reject()
		})

		document.body.append(script)
	})
}
