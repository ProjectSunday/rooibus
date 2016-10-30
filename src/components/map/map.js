import React from 'react'

export default class Map extends React.Component {
	componentDidMount() {
		console.log('componentDidMount');

		doThings();
	}
	render() {
		return (
			<div> yooo 5555 </div>
		)		
	}
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