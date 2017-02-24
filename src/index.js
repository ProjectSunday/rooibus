// require('babel-polyfill')

import React 		from 'react'
import ReactDOM from 'react-dom'
import { Router } 	from 'react-router'
import { Provider }	from 'react-redux'

import { AppContainer } from 'react-hot-loader'

// import { store, history } 	from './store/store'
// import routes 				from './routes'
// import { init }				from './actions/actions'


/******************************************************************
 * Others
 *****************************************************************/
import './index.html'
// import '~/utils'
// import './static/images/favicon.ico'
// import './index.sass'
// import '~/static/bootswatch/flatly.min.css'

// import * as images from './static/images'
// import preloadImages from './static/images/preloadimages'

/******************************************************************
 * Globals
 *****************************************************************/
// window.IMAGES = images
// preloadImages()


/******************************************************************
 * Initialization
 *****************************************************************/

// init()

import { Test1, Test2 } from './components/testing'

/******************************************************************
 * Mount
 *****************************************************************/
/*render(
	<Provider store={store}>
		<Router history={history} children={routes} />
	</Provider>,
	document.getElementById('mount')
)*/
/*

render(
	<div>
		<Test1 />
		<Test2 />
	</div>,
	document.getElementById('mount')
)
*/

class App extends React.Component {
	render() {
		return (
			<div>
				<Test1 />
				<Test2 />
			</div>
		)
	}
}


const render = (Component) => {
	ReactDOM.render(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.getElementById('mount')
	)
}

render(App)

// Hot Module Replacement API - prevent page reloading with every change
if (module.hot) {
	module.hot.accept('./components/testing', () => {
		console.log('something')
		render(App)
  })
}
