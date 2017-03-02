import React from 'react'

import { createSession } from '../actions/actions'
// import { connect } from 'react-redux'

// import { clone } from '~/utils'

// const mapStateToProps = (state, ownProps) => {
// 	return {
// 		paths: clone(state.paths)
// 	}
// }
// @connect(mapStateToProps)
class ShareButton extends React.Component {
	shareClicked = (e) => {
		// console.log('shareClicked')
		createSession()
	}

	render() {
		return <button style={styles.button} onClick={this.shareClicked}>Sh</button>
	}
}

const styles = {
	button: {
		width: '50px',
		height: '25px',
		zIndex: -1
	}
}


export default ShareButton
