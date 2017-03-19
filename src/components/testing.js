import React from 'react'

import * as Actions from '../actions/actions'

class Testing extends React.Component {
    test1Clicked = () => {
        Actions.test1()
    }
    test2Clicked = () => {
        Actions.test2()
    }
    render() {
        return (
            <div>
                {/*<div className="testing">TESTING</div>*/}
                {/*<button onClick={this.test1Clicked}>Test1</button>*/}
                {/*<button onClick={this.test2Clicked}>Test2</button>*/}
            </div>
        )
	}
}

export default Testing
