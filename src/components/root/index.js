import React from 'react'

import { FriendMap } from '~/components'

export default class Root extends React.Component {
	render() {


		if (process.env.NODE_ENV === 'local') {
			var buildNumber = process.env.BLAH
			var build = <div style={styles.build}>{buildNumber}asdf</div>
		}
		return (
			<div>
				<div style={styles.friendMap}>
					<FriendMap />
				</div>
				{build}
			</div>
		)
	}
}

const styles = {
	friendMap: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: process.env.NODE_ENV === 'local' ? 20 : 0,
		left: 0
	},
	build: {
		position: 'absolute',
		bottom: 0
	}
}

// <Notification />
// <Header />
// {this.props.children}
// <Footer />
// <hr />
// <Testing />
