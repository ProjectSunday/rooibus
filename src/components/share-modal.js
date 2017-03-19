import React from 'react'
import { connect } from 'react-redux'

import * as Actions from '../actions/actions'
import './share-modal.sass'

const mapStateToProps = (state, ownProps) => {
    return {
        mapId: state.map.id,
        sharingModalOpen: state.ui.sharingModalOpen
    }
}

class ShareModal extends React.Component {
    componentDidMount() {
        Actions.shareMap()
        Actions.showSharingModal()
    }
    componentDidUpdate() {
        if (this.props.mapId) {
            this.refs.url.select()
            document.execCommand('copy')
        }
    }    
    overlayClicked = () => {
        Actions.hideSharingModal()
    }
    closeClicked = () => {
        Actions.hideSharingModal()
    }
    copyClicked = (e) => {
        this.refs.url.select()
        document.execCommand('copy')
    }
    render() {
        var styles = {
            display: this.props.sharingModalOpen ? 'flex' : 'none'
        }
        if (this.props.mapId) {
            var url = window.location.origin + '/' + this.props.mapId
        } else {
            var url = 'Loading...'
        }
        return (
            <div className="modal-container" style={styles}>
                <div className="share-modal">
                    <h3 className="modal-caption">Sharing link copied!</h3>
                    <input type="text" className="url" ref="url" value={url} readOnly/>
                    <div>
                        <div className="copy-again" onClick={this.copyClicked}>Copy Again</div>
                    </div>
                </div>
                <div className="modal-overlay" onClick={this.overlayClicked} />
            </div>
        )
    }
}

export default connect(mapStateToProps)(ShareModal)