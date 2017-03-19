import React from 'react'
import { connect } from 'react-redux'

import { clone } from '../utils'
import * as Actions from '../actions/actions'

import LockBoundsButton from './lock-bounds-button'
import ShareButton from './share-button'
import StatusButton from './status-button'

import './friend-map.sass'

const US_DEFAULT_ZOOM = 4
const US_GEOLOGICAL_CENTER = { lat: 39.833333, lng: -98.583333 }
const DEFAULT_SINGLE_USER_ZOOM_LEVEL = 18
var GOOGLE_OBJECT_PROMISE_SINGLETON //this is to avoid initializing the google maps api twice


const mapStateToProps = (state, ownProps) => {
	return {
		autoAdjustBounds: state.map.autoAdjustBounds,
		coords: {
			lat: 39.779410,
			lng: -86.164397
		},
		marker: {
			lat: 39.779410,
			lng: -86.164397
		},
		map: state.map,
		paths: clone(state.paths),
		userOnline: state.user.online
	}
}
class FriendMap extends React.Component {
	constructor() {
		super()
		this.suppressEvents = false
	}
	async componentDidMount() {
		// console.log('friendmap componentDidMount')
		
		if (!window.google) {
			await getGoogleObject()
		}
		this.map = drawMap(this.refs.map)
		this.addBoundsListeners()
		this.addSmoothZooming()
	}
	async componentDidUpdate(prevProps, prevState) {
		// console.log('friendmap componentDidUpdate')
		if (!window.google) {
			await getGoogleObject()
		}

		this.drawPaths()

		if (this.props.userOnline) {
			Actions.startLocationTracking()
		} else {
			Actions.stopLocationTracking()
		}

		this.adjustMapBounds()
	}
	addBoundsListeners = () => {
		this.map.addListener('dragstart', () => {
			if (!this.suppressEvents) {
				Actions.setAutoAdjustBounds(false)
			}
		})

		this.map.addListener('zoom_changed', () => {
			if (!this.suppressEvents) {
				Actions.setAutoAdjustBounds(false)
			}
		})
	}
	addSmoothZooming = () => {

		var map = this.map;

		var marker = new google.maps.Marker({
			map: map, 
			position: new google.maps.LatLng(-20.3,30.3)
		});

		google.maps.event.addListener(marker, 'dblclick', function(event){
			map = marker.getMap();    
			map.setCenter(overlay.getPosition()); // set map center to marker position
			smoothZoom(map, 12, map.getZoom()); // call smoothZoom, parameters map, final zoomLevel, and starting zoom level
		});

		// the smooth zoom function
		function smoothZoom (map, max, cnt) {
			if (cnt >= max) {
				return;
			}
			else {
				z = google.maps.event.addListener(map, 'zoom_changed', function(event){
					google.maps.event.removeListener(z);
					smoothZoom(map, max, cnt + 1);
				});
				setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
			}
		} 

	}
	adjustMapBounds = () => {
		if (!this.props.autoAdjustBounds) return

		this.suppressEvents = true

		var last
		var bounds = new google.maps.LatLngBounds()

		this.props.map.users.forEach(user => {
			user.coords.forEach(coord => {
				bounds.extend(coord)
				last = coord
			})
		})

		if (this.props.map.users.length > 1) {
			this.map.fitBounds(bounds)
		} else if (last) {
			var latLng = new google.maps.LatLng(last.lat, last.lng)
			this.map.panTo(latLng)
			this.map.setZoom(DEFAULT_SINGLE_USER_ZOOM_LEVEL)
		}

		this.suppressEvents = false
	}

	drawPaths = () => {
		var last;
		var colors = [ '#008000', '#00FFFF', '#0000FF', '#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00', '#808000', '#00FF00', '#F39C12' ]

		this.props.map.users.forEach((user, i) => {
			user.coords.forEach(coord => {
				this.drawDot(coord, colors[i])
			})
		})

	}
	drawDot = (coords, color) => {
		let dot = new google.maps.Marker({
			map: this.map,
			position: coords,
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				fillColor: color,
				fillOpacity: 0.5,
				strokeColor: color,
				strokeWeight: 1,
				scale: 5
			}
		})
		dot.setMap(this.map)
	}

	render() {
		return (
			<div>
				<div className="top-buttons">
					<div className="top-left">
						<ShareButton />
					</div>
					<div className="top-right">
						<LockBoundsButton />
						<StatusButton />
					</div>
				</div>
				<div className="map-container" ref="map"></div>
			</div>
		)
	}
}

function drawMap(node) {
	var center = new google.maps.LatLng(US_GEOLOGICAL_CENTER.lat, US_GEOLOGICAL_CENTER.lng)
	return new google.maps.Map(node, {
	    center,
	    mapTypeControl: false,
	    zoom: US_DEFAULT_ZOOM
	})
}

async function getGoogleObject() {
	if (!GOOGLE_OBJECT_PROMISE_SINGLETON) {
		GOOGLE_OBJECT_PROMISE_SINGLETON = new Promise((resolve, reject) => {
			window._rooibusGoogleMapLoaded = function () {
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
	return GOOGLE_OBJECT_PROMISE_SINGLETON
}

export default connect(mapStateToProps)(FriendMap)


// function drawLine(map, path) {
// 	var line = new google.maps.Polyline({
// 		path,
// 		strokeColor: '#FF0000',
// 		strokeOpacity: 1.0,
// 		strokeWeight: 3
// 	})

// 	line.setMap(map)
// }


// function placeMaker(map, coords) {


// 	var dot = new google.maps.Marker({
// 		map,
// 		position: map.center,
// 		icon: {
// 			path: google.maps.SymbolPath.CIRCLE,
// 			fillColor: '#FF0000',
// 			fillOpacity: 0.5,
// 			strokeColor: '#FF0000',
// 			strokeWeight: 1,
// 			scale: 5
// 		}
// 	})

// 	dot.setMap(map)

// 	// var path = []

// 	// setInterval(() => {
// 	// 	coords.lat += 0.0001
// 	// 	coords.lng += 0.00005

// 	// 	path.push({
// 	// 		lat: coords.lat,
// 	// 		lng: coords.lng
// 	// 	})
		
// 	// 	var line = new google.maps.Polyline({
// 	// 		path,
// 	// 		// geodesic: true,
// 	// 		strokeColor: '#FF0000',
// 	// 		strokeOpacity: 1.0,
// 	// 		strokeWeight: 3
// 	// 	});

// 	// 	line.setMap(map)
		
// 	// }, 100)


// 	// var circle = new google.maps.Circle({
// 	// 	strokeColor: '#FF0000',
// 	// 	strokeOpacity: 1,
// 	// 	strokeWeight: 1,
// 	// 	fillColor: '#FF0000',
// 	// 	fillOpacity: 1,
// 	// 	map: map,
// 	// 	center: map.center,
// 	// 	radius: 1



// 	//     // center: coords,
// 	//     // radius: 10,
// 	//     // strokeColor: "#E16D65",
// 	//     // strokeOpacity: 1,
// 	//     // strokeWeight: 3,
// 	//     // fillColor: "#E16D65",
// 	//     // fillOpacity: 0
// 	// })

// 	// circle.setMap(map)





// }
