import React from 'react'

import { joinMap } from '../actions/actions'

import FriendMap from './friend-map'

class Session extends React.Component {
	componentDidMount() {
		console.log('Session componentDidMount')
		console.log(this.props)

		//Todo: check valid uid here

		joinMap(this.props.params.mapId)

	}
	componentWillUpdate() {
		console.log('Session componentWillUpdate')
		// console.log(this.props.params)
	}
	componentDidUpdate() {
		console.log('Session componentDidUpdate')
	}
	render() {
		console.debug('**************')
		// console.log('Session render', this.props.params)


		return <FriendMap />
	}
}

export default Session