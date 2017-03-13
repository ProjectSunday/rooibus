import React from 'react'


import { shareMap, shareToAll } from '../actions/actions'
// import { connect } from 'react-redux'

import ShareModal from './share-modal'

import './share-button.sass'


// import { clone } from '~/utils'

// const mapStateToProps = (state, ownProps) => {
// 	return {
// 		paths: clone(state.paths)
// 	}
// }


// @connect(mapStateToProps)
class ShareButton extends React.Component {
	constructor() {
		super()
		this.state = {
			sharingModalOpen: false
		}
	}
	shareClicked = (e) => {
		shareMap()
		this.setState({
			sharingModalOpen: true
		})
	}
	shareToAllClicked = (e) => {
		shareToAll()
	}
	render() {
		var sharingModal
		if (this.state.sharingModalOpen) {
			var sharingModal = <ShareModal />
		}
		return (
			<div className="share-container">
				<div className="share-button" onClick={this.shareClicked}></div>
				<div className="share-all" onClick={this.shareToAllClicked}>ShareToAll</div>
				{sharingModal}
			</div>
		)
	}
}

export default ShareButton
