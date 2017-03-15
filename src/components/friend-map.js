import React from 'react'
import { connect } from 'react-redux'

import { clone } from '../utils'
import * as Actions from '../actions/actions'

import ShareButton from './share-button'
import StatusButton from './status-button'

import './friend-map.sass'

const US_DEFAULT_ZOOM = 4
const US_GEOLOGICAL_CENTER = { lat: 39.833333, lng: -98.583333 }

const mapStateToProps = (state, ownProps) => {
	return {
		boundsLocked: state.map.boundsLocked,
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
	async componentDidMount() {
		// console.log('friendmap componentDidMount')
		if (!window.google) {
			await getGoogleObject()
		}
		this.map = drawMap(this.refs.map)
		this.addBoundsListener()
	}
	componentDidUpdate(prevProps, prevState) {
		console.log('friendmap componentDidUpdate')
		if (window.google) {
			this.drawPaths()
		}
		if (this.props.userOnline) {
			Actions.startLocationTracking()
		} else {
			Actions.stopLocationTracking()
		}
	}

	addBoundsListener = () => {
		var self = this
		google.maps.event.addListenerOnce(self.map, 'idle', () => {    //idle listener is needed to ignore the first bounds_changed
			self.map.addListener('bounds_changed', () => {
				Actions.setBoundsLockedStatus(false)
			})
		})
	}
	drawPaths = () => {
		var last;
		var colors = [ '#008000', '#00FFFF', '#0000FF', '#FF00FF', '#800080', '#FF0000', '#800000', '#FFFF00', '#808000', '#00FF00', '#F39C12' ]
		
		var bounds = new google.maps.LatLngBounds()

		this.props.map.users.forEach((user, i) => {
			user.coords.forEach(coord => {
				this.drawDot(coord, colors[i])
				bounds.extend(coord)
				last = coord
			})
		})


		if (!this.props.boundsLocked) return

		if (this.props.map.users.length > 1) {
			this.map.fitBounds(bounds)
		} else {
			if (last) {
				var latLng = new google.maps.LatLng(last.lat, last.lng)
				this.map.panTo(latLng)
			}
		}

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
					<ShareButton />
					<StatusButton />
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
	return new Promise((resolve, reject) => {
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

export default connect(mapStateToProps)(FriendMap)