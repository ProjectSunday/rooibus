import React from 'react'


import { createSession, shareToAll } from '../actions/actions'
// import { connect } from 'react-redux'


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
		// displaySharingModal()
		// createSession()
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
			var sharingModal = (<div>sharing modal</div>)
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
