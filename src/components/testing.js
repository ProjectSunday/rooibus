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
		var now = new Date()
		console.log('22222', now.getTime())
		return <div>
			<button onClick={this.handleClick}>9999</button>
      <button onClick={this.test2Click}>Test2</button>
		</div>
	}
}

export { Test1 }