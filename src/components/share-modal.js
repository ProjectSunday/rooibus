import React from 'react'
import { connect } from 'react-redux'

import * as Actions from '../actions/actions'
import './share-modal.sass'

const mapStateToProps = (state, ownProps) => {
    return {
        mapId: state.map.id
    }
}

class ShareModal extends React.Component {
    componentDidUpdate() {
        // console.log('ShareModal componentDidUpdate')
        this.refs.url.select()
    }
    closeClicked = () => {
        Actions.hideSharingModal()
    }
    copyClicked = (e) => {
        this.refs.url.select()
        document.execCommand('copy')
    }
    render() {
        if (this.props.mapId) {
            var url = window.location.origin + '/' + this.props.mapId
        } else {
            var url = 'Loading...'
        }
        return (
            <div className="share-modal">
                <input type="text" className="url" ref="url" value={url} readOnly/>
                <div>
                    <button onClick={this.copyClicked}>Copy</button>
                    <button onClick={this.closeClicked}>Close</button>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ShareModal)