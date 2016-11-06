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
		}
	}
}
@connect(mapStateToProps)
export default class FriendMap extends React.Component {
	componentDidMount() {
		// console.log('componentDidMount');
		var map = initGoogleMap(this.refs.map, this.props.coords)
		placeMaker(map, this.props.marker)
	}
	componentDidUpdate() {
		console.log('map componentDidUpdate')
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

async function initGoogleMap(node, coords) {
	if (!window.google) {
		await getGoogleObject()
	}

	return new google.maps.Map(node, {
	    center: coords,
	    scrollwheel: false,
	    zoom: 15
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
		script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDW_vBOv7QmHYXsO5j4Hm661UyR-A1YfJw&callback=_rooibusGoogleMapLoaded`

		script.addEventListener('error', function () {
			console.error('Fatal Error: unable to load the google maps api')
			reject()
		})

		document.body.append(script)
	})
}

function placeMaker(map, coords) {

}

