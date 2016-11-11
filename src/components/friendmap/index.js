import React from 'react'
import { connect } from 'react-redux'

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
		paths: state.paths
	}
}
@connect(mapStateToProps)
export default class FriendMap extends React.Component {
	async componentDidMount() {
		console.log('componentDidMount');

		await getGoogleObject()

		this.map = drawMap(this.refs.map, this.props.coords)

		this.drawPaths(this.map, this.props.paths)
		// placeMaker(map, this.props.marker)
	}
	componentDidUpdate() {
		console.log('map componentDidUpdate')
		this.drawPaths(this.map, this.props.paths)

	}

	drawPaths = (map, paths) => {
		var last;
		paths.forEach(p => {
			// drawLine(map, p.coords)
			
			drawDot(map, p.coords.pop())
			last = p.coords.pop()
		})

		if (last) {
			this.map.panTo(last)
		}
	}


	render() {
		return <div ref="map" style={styles.map}></div>
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

function drawMap(node, coords) {

	return new google.maps.Map(node, {
	    center: coords,
	    zoom: 15
	})
}

async function getGoogleObject() {
	if (window.google) { return }
	return new Promise((resolve, reject) => {
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

function drawDot(map, coords) {

	var dot = new google.maps.Marker({
		map,
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

	dot.setMap(map)

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

