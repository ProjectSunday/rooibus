import React from 'react'
import { Route, IndexRoute } from 'react-router'

// import { About, FriendMap, Root, Session } from './components'

import Root from './components/root'
import FriendMap from './components/friend-map'

export default (
	<Route path="/" component={Root}>
		<IndexRoute component={FriendMap} />
	</Route>
)

		// <Route path="/about" component={About} />
		// <Route path="/:mapId" component={Session} />

/*export default (
	<Route path="/" component={Root}>
	</Route>
)*/
