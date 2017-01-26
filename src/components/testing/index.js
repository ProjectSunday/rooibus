import React from 'react'

export default class Testing extends React.Component {
	handleClick = () => {
		alert('yo1111')
	}
	render() {
		return <div>
			<button onClick={this.handleClick}>Test1</button>
		</div>
	}
}

