import React from 'react'
import { connect } from 'react-redux'

import * as Actions from '../actions/actions'

import './lock-bounds-button.sass'

const mapStateToProps = (state, ownProps) => {
    return {
        autoAdjustBounds: state.map.autoAdjustBounds
    }
}
class LockBoundsButton extends React.Component {
    lockBoundsClicked = () => {
        console.log('lockBoundsClicked')
        Actions.setAutoAdjustBounds(true)
    }
    render() {
        console.log('19 autoAdjustBounds:', this.props.autoAdjustBounds)
        var styles = {
            display: this.props.autoAdjustBounds ? 'none' : 'block'
        }
        return (
            <div style={styles} className="lock-bounds-button" onClick={this.lockBoundsClicked}>LB</div>
        )
    }
}


export default connect(mapStateToProps)(LockBoundsButton)