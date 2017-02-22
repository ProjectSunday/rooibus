import React from 'react'
import { Route, IndexRoute } from 'react-router'

// import { About, FriendMap, Root, Session } from './components'

import Root from './components/root'

/*export default (
	<Route path="/" component={Root}>
		<IndexRoute component={FriendMap} />
		<Route path="/about" component={About} />
		<Route path="/:mapId" component={Session} />
	</Route>
)*/

export default (
	<Route path="/" component={Root}>
	</Route>
)

// <Route path="about" component={About} />
// <Route path="requested" component={Requested} />
// <Route path="createrequest" components={CreateRequest} />
// <Route path="teach" components={Teach} />
// <Route path="upcoming" components={Upcoming} />
// <Route path="upcoming/:upcomingClassId" components={UpcomingDetail} />
