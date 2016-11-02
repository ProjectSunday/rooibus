import React from 'react'
import { Route, IndexRoute } from 'react-router'

import { Root } from './components'

export default (
	<Route path="/" component={Root}>
	</Route>
)

// <IndexRoute component={Home} />
// <Route path="about" component={About} />
// <Route path="requested" component={Requested} />
// <Route path="createrequest" components={CreateRequest} />
// <Route path="teach" components={Teach} />
// <Route path="upcoming" components={Upcoming} />
// <Route path="upcoming/:upcomingClassId" components={UpcomingDetail} />
