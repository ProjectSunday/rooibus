import React from 'react'

export default class Session extends React.Component {
	componentDidMount() {
		console.log('Session componentDidMount')
		console.log(this.props)
	}
	componentWillUpdate() {
		console.log('Session componentWillUpdate')
		// console.log(this.props.params)
	}
	render() {

		// console.log('Session render', this.props.params)


		return <div>i am sessions</div>
	}
}