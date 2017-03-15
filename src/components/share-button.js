import React from 'react'
import { connect } from 'react-redux'

import * as Actions from '../actions/actions'
// import { clone } from '~/utils'

import ShareModal from './share-modal'

import './share-button.sass'

const mapStateToProps = (state, ownProps) => {
	return {
		boundsLocked: state.map.boundsLocked,
		sharingModalOpen: state.ui.sharingModalOpen
	}
}

class ShareButton extends React.Component {
	shareClicked = (e) => {
		Actions.shareMap()
		Actions.showSharingModal()
	}
	shareToAllClicked = (e) => {
		Actions.shareToAll()
	}
	render() {
		var sharingModal
		if (this.props.sharingModalOpen) {
			var sharingModal = <ShareModal />
		}
		var lockBounds

		console.log('33 !this.props.boundsLocked', !this.props.boundsLocked)
		if (!this.props.boundsLocked) {
			lockBounds = <div className="lock-bounds" onClick={this.lockBoundsClicked}>lockbounds</div>
		}
		return (
			<div className="share-container">
				<div className="share-button" onClick={this.shareClicked}></div>
				<div className="share-all" onClick={this.shareToAllClicked}>ShareToAll</div>
				{lockBounds}
				{sharingModal}
			</div>
		)
	}
}

export default connect(mapStateToProps)(ShareButton)
