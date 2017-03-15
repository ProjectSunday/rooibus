import React from 'react'
import { connect } from 'react-redux'

import * as Actions from '../actions/actions'

import './status-button.sass'

import offline from '../images/offline.png'
import online from '../images/online.png'

const mapStateToProps = (state, ownProps) => {
    return {
        online: state.user.online
    }
}
class StatusButton extends React.Component {
    onClick = () => {
        Actions.setUserOnlineStatus(!this.props.online)
    }
    render() {
        var style = {
            backgroundImage: this.props.online ? `url(${online})` : `url(${offline}`
        }
        return (
            <div className="status-button" onClick={this.onClick}>
                <div className="button-image" style={style} />
            </div>
        )
    }
}

export default connect(mapStateToProps)(StatusButton)