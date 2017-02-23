import React from 'react'

import { Test1, Test2 } from './testing'

export default class Root extends React.Component {
				// {this.props.children}
	render() {
		return (
			<div>
				<Test1 />
				<Test2 />
			</div>
		)
	}
}

