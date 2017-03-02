import React from 'react'
import { Route, IndexRoute } from 'react-router'

import About from './components/about'
import Root from './components/root'
import FriendMap from './components/friend-map'
import Session from './components/session'

export default (
	<Route path="/" component={Root}>
		<IndexRoute component={FriendMap} />
		<Route path="/about" component={About} />
		<Route path="/:mapId" component={Session} />
	</Route>
)

