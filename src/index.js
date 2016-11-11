import React 		from 'react'
import { render } 	from 'react-dom'
import { Router } 	from 'react-router'
import { Provider }	from 'react-redux'

import { store, history } 			from '~/store'
import routes 						from '~/routes'
import { startLocationTracking }	from '~/actions'

// import Map from './components/map/map'

///////////////////////////////////////////////////////////////////
// Others
///////////////////////////////////////////////////////////////////
import '~/index.html'
// import '~/utils'
// import './static/images/favicon.ico'
// import './index.sass'
// import '~/static/bootswatch/flatly.min.css'

// import * as images from './static/images'
// import preloadImages from './static/images/preloadimages'

///////////////////////////////////////////////////////////////////
// Globals
///////////////////////////////////////////////////////////////////
// window.IMAGES = images
// preloadImages()

///////////////////////////////////////////////////////////////////
// Initialization
///////////////////////////////////////////////////////////////////
// Category.getList()
// RequestedClass.getList()
// UpcomingClass.getList()

startLocationTracking()

///////////////////////////////////////////////////////////////////
// Mount
///////////////////////////////////////////////////////////////////

render(
	<Provider store={store}>
		<Router history={history} children={routes} />
	</Provider>,
	document.getElementById('mount')
)


