import React from 'react'

import { test1, test2 } from '../actions/actions'

class Test1 extends React.Component {
    test1Clicked = () => {
		test1()
	}
    test2Clicked = () => {
        test2()
    }
    render() {
        return (
            <div>
                <button onClick={this.test1Clicked}>Test1</button>
                <button onClick={this.test2Clicked}>Test2</button>
            </div>
        )
	}
}

class Test2 extends React.Component {
    render() {
        return (
            <div>
                <textarea />
            </div>
        )
    }
}

export { Test1, Test2 }