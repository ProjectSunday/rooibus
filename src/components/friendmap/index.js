import React from 'react'
import { connect } from 'react-redux'

import { clone } from '~/utils'

import { ShareButton } from '~/components'

const mapStateToProps = (state, ownProps) => {
	return {
		coords: {
			lat: 39.779410,
			lng: -86.164397
		},
		marker: {
			lat: 39.779410,
			lng: -86.164397
		},
		paths: clone(state.paths)
	}
}
@connect(mapStateToProps)
export default class FriendMap extends React.Component {
	async componentDidMount() {


		if (!window.google) {
			await getGoogleObject()
		}
		// console.log('friendmap componentDidMount')
		// console.log(JSON.stringify(this.props.paths))


		this.map = drawMap(this.refs.map, this.props.coords)

		// this.drawPaths(this.map, this.props.paths)
		// placeMaker(map, this.props.marker)
	}
	async componentDidUpdate() {
		// console.log('friendmap componentDidUpdate')
		// console.log(JSON.stringify(this.props.paths))

		// if (!window.google) {
		// 	await getGoogleObject()
		// }

		if (window.google) {
			this.drawPaths()
		}


	}

	drawPaths = () => {
		var last;
		this.props.paths.forEach(p => {
			// drawLine(map, p.coords)
			
			last = p.coords.pop()
			this.drawDot(last)
		})

		if (last) {
			var latLng = new google.maps.LatLng(last.lat, last.lng)
			this.map.panTo(latLng)
		}
	}

	drawDot = (coords) => {
		let dot = new google.maps.Marker({
			map: this.map,
			position: coords,
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				fillColor: '#FF0000',
				fillOpacity: 0.5,
				strokeColor: '#FF0000',
				strokeWeight: 1,
				scale: 5
			}
		})
		dot.setMap(this.map)
	}

	render() {
		return (
			<div>
				<div ref="map" style={styles.map}></div>
				<ShareButton />
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
		left: 0,
		zIndex: -1
	}
}

function drawMap(node, coords) {

	return new google.maps.Map(node, {
	    center: coords,
	    mapTypeControl: false,
	    zoom: 15
	})
}

async function getGoogleObject() {
	return new Promise((resolve, reject) => {
		// if (window.google) { resolve(); return }

		window._rooibusGoogleMapLoaded = function () {
			// console.log('resolving _rooibusGoogleMapLoaded')
			resolve()
		}

		var script = document.createElement('script')
		script.type = 'text/javascript'
		script.async = false
		script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDW_vBOv7QmHYXsO5j4Hm661UyR-A1YfJw&callback=_rooibusGoogleMapLoaded`

		script.addEventListener('error', function () {
			console.error('Fatal Error: unable to load the google maps api')
			reject()
		})

		document.body.append(script)
	})
}

function drawLine(map, path) {
	var line = new google.maps.Polyline({
		path,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 3
	})

	line.setMap(map)
}


function placeMaker(map, coords) {


	var dot = new google.maps.Marker({
		map,
		position: map.center,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			fillColor: '#FF0000',
			fillOpacity: 0.5,
			strokeColor: '#FF0000',
			strokeWeight: 1,
			scale: 5
		}
	})

	dot.setMap(map)

	// var path = []

	// setInterval(() => {
	// 	coords.lat += 0.0001
	// 	coords.lng += 0.00005

	// 	path.push({
	// 		lat: coords.lat,
	// 		lng: coords.lng
	// 	})
		
	// 	var line = new google.maps.Polyline({
	// 		path,
	// 		// geodesic: true,
	// 		strokeColor: '#FF0000',
	// 		strokeOpacity: 1.0,
	// 		strokeWeight: 3
	// 	});

	// 	line.setMap(map)
		
	// }, 100)


	// var circle = new google.maps.Circle({
	// 	strokeColor: '#FF0000',
	// 	strokeOpacity: 1,
	// 	strokeWeight: 1,
	// 	fillColor: '#FF0000',
	// 	fillOpacity: 1,
	// 	map: map,
	// 	center: map.center,
	// 	radius: 1



	//     // center: coords,
	//     // radius: 10,
	//     // strokeColor: "#E16D65",
	//     // strokeOpacity: 1,
	//     // strokeWeight: 3,
	//     // fillColor: "#E16D65",
	//     // fillOpacity: 0
	// })

	// circle.setMap(map)





}

