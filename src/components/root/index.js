import React from 'react'

import { Testing } from '~/components'

export default class Root extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
				<Testing />
			</div>
		)
	}
}

