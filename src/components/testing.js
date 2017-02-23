import React from 'react'

// import { test, test2 } from '~/actions'

class Test1 extends React.Component {
    handleClick = () => {
		// test()
	}
    test2Click = () => {
        // test2()
    }
    render() {
		return (
            <div>
                <button onClick={this.handleClick}>4444</button>
                <button onClick={this.test2Click}>Test2</button>
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