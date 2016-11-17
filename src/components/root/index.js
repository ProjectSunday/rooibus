import React from 'react'

// import { FriendMap, ShareButton } from '~/components'

export default class Root extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		)
	}
}

