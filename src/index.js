import 'babel-polyfill'								//needed for async/await

import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

import { store, history } from './store/store'
import routes from './routes'
// import { init } from './actions/actions'


import './images/share.png'
/******************************************************************
 * Others
 *****************************************************************/
import './index.html'
// import '~/utils'
// import './static/images/favicon.ico'
// import './index.sass'

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

/******************************************************************
 * Mount
 *****************************************************************/
class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<Router history={history} children={routes} />
			</Provider>
		)
	}
}

//needed for HMR
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
// module.hot.accept takes a path
if (module.hot) {
	module.hot.accept('./', () => {
		render(App)
  })
}
