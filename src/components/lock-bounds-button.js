import React from 'react'
import { connect } from 'react-redux'

import * as Actions from '../actions/actions'

import './lock-bounds-button.sass'

const mapStateToProps = (state, ownProps) => {

    var autoAdjustBoundsDisabled = !state.map.autoAdjustBounds
    var mapHasCoords = state.map.users.length > 0
    return {
        visible: autoAdjustBoundsDisabled && mapHasCoords
    }
}
class LockBoundsButton extends React.Component {
    lockBoundsClicked = () => {
        Actions.setAutoAdjustBounds(true)
    }
    render() {
        var styles = {
            display: this.props.visible ? 'block' : 'none'
        }
        return (
            <div style={styles} className="lock-bounds-button" onClick={this.lockBoundsClicked}></div>
        )
    }
}


export default connect(mapStateToProps)(LockBoundsButton)