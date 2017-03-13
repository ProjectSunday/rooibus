import React from 'react'
import { connect } from 'react-redux'

import './share-modal.sass'

const mapStateToProps = (state, ownProps) => {
    return {
        url: window.location.origin + '/' + state.map.id
    }
}

class ShareModal extends React.Component {
    componentDidUpdate() {
        // console.log('ShareModal componentDidUpdate')
        this.refs.url.select()
    }
    closeClicked = () => {
        console.log('clickclosed')
    }
    copyClicked = (e) => {
        this.refs.url.select()
        document.execCommand('copy')
    }
    render() {
        return (
            <div className="share-modal">
                <input type="text" className="url" ref="url" value={this.props.url} readOnly/>
                <div>
                    <button onClick={this.copyClicked}>Copy</button>
                    <button onClick={this.closeClicked}>Close</button>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(ShareModal)