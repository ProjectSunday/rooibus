import React from 'react'

import ShareModal from './share-modal'
import Testing from './testing'

import './root.sass'

export default class Root extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
				<Testing />
				<ShareModal />
			</div>
		)
	}
}

