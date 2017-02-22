import React from 'react'

import Testing from './testing'

export default class Root extends React.Component {
				// {this.props.children}
	render() {
		return (
			<div>
				<Testing />
			</div>
		)
	}
}

