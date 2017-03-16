import React from 'react'
import { connect } from 'react-redux'

import * as Actions from '../actions/actions'

import ShareModal from './share-modal'

import './share-button.sass'

const mapStateToProps = (state, ownProps) => {
	return {
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
		return (
			<div className="share-container">
				<div className="share-button" onClick={this.shareClicked}></div>
				<div className="share-all" onClick={this.shareToAllClicked}>ShareToAll</div>
				{sharingModal}
			</div>
		)
	}
}

export default connect(mapStateToProps)(ShareButton)
