import React from 'react'

import { Test1, Test2 } from './testing'

import './root.sass'

export default class Root extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
				<Test1 />
				<Test2 />
			</div>
		)
	}
}

