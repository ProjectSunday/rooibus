import { clone } from '../utils'

////////////////////////////////////////////////////////////////////////////////////////////////////
//testing
////////////////////////////////////////////////////////////////////////////////////////////////////

export const testing = (state = {}, action) => {
	switch (action.type) {
		case 'TESTING':
			return state
		default:
			return state
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//map
////////////////////////////////////////////////////////////////////////////////////////////////////

var initialMapState = {
	autoAdjustBounds: true,
	users: []
}
export const map = (state = initialMapState, action) => {
	switch (action.type) {
		case 'SET_MAP_ID':
		case 'MAP_SET_ID':
			var newState = clone(state)
			newState.id = action.mapId
			return newState
		case 'MAP_ADD_USER_COORDS':
			var newState = clone(state)
			var user = newState.users.find(u => u.uid === action.uid)
			if (user) {
				user.coords.push(action.coords)
			} else {
				newState.users.push({
					uid: action.uid,
					coords: [
						action.coords
					]
				})
			}
			return newState
		case 'MAP_SET_AUTO_ADJUST_BOUNDS':
			var state = clone(state)
			state.autoAdjustBounds = action.automatic
			return state
		default:
			return state
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// paths
////////////////////////////////////////////////////////////////////////////////////////////////////
export const paths = (state = [], action) => {
	switch (action.type) {
		case 'TRACKING_ADD_COORDS':
			var newState = clone(state)
			newState[0] = newState[0] || { coords: [] }
			newState[0].coords.push(action.coords)
			return newState
		default:
			return state
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//session
////////////////////////////////////////////////////////////////////////////////////////////////////

// var initialCategoryState = { list: [], selectedCategory: undefined }
export const session = (state = {}, action) => {
	switch (action.type) {
		case 'SET_SESSION':
			return Object.assign({}, state, action.session)
		default:
			return state
	}
}

/********************************************************
 * ui
 ********************************************************/
const uiInitialState = {
	lockBoundsButtonVisible: false,
	sharingModalOpen: false
}
export const ui = (state = uiInitialState, action) => {
	switch (action.type) {
		case 'UI_SET_SHARING_MODAL_OPEN':
			var state = clone(state)
			state.sharingModalOpen = action.open
			return state
		case 'UI_SET_LOCK_BOUNDS_BUTTON_VISIBLE':
			var state = clone(state)
			state.lockBoundsButtonVisible = action.visible
			return state
		default:
			return state
	}
}
/********************************************************
 * user
 ********************************************************/
var initialUserState = {
	online: false
}
export const user = (state = initialUserState, action) => {
	switch (action.type) {
		case 'USER_SET_ONLINE_STATUS':
			var state = clone(state)
			state.online = action.online
			return state
		default:
			return state
	}
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //notification
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// export const notification = (state = {}, action) => {
// 	switch (action.type) {
// 		case 'SHOW_NOTIFICATION':
// 			return Object.assign({}, action.notification, { show: true })
// 		case 'HIDE_NOTIFICATION':
// 			return Object.assign({}, action.notification, { show: false })
// 		default:
// 			return state
// 	}
// }

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //requestedClass
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// var initialRequestedClass = {
// 	list: []
// }
// export const requestedClass = (state = initialRequestedClass, action) => {
// 	switch (action.type) {
// 		case 'REQUESTEDCLASS_CREATE_SUCCESS':
// 			var list = state.list.slice(0)
// 			list.push(action.requestedClass)
// 			return Object.assign({}, state, { list })
// 		case 'REQUESTEDCLASS_SET_LIST':
// 			return Object.assign({}, state, { list: action.list })
// 		default:
// 			return state
// 	}
// }

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //ui
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// var initialUiState = {
// 	// selectedCategory: undefined
// }
// export const ui = (state = initialUiState, action) => {
// 	switch (action.type) {
// 		// case 'UI_SET_SELECTED_CATEGORY': 
// 		// 	return Object.assign({}, state, { selectedCategory: action.value })
// 		default:
// 			return state
// 	}
// }

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //upcomingClass
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// var initialupcomingClassState = {
// 	list: []
// }
// export const upcomingClass = (state = initialupcomingClassState, action) => {
// 	switch (action.type) {
// 		case 'UPCOMINGCLASS_SET_LIST':
// 			return Object.assign({}, state, { list: action.list })
// 		case 'UPCOMINGCLASS_CREATE_SUCCESS':
// 			var list = state.list.slice(0)
// 			list.push(action.upcomingClass)
// 			return Object.assign({}, state, { list })
// 		case 'UPCOMINGCLASS_DELETE_SUCCESS':
// 			var list = state.list.filter(u => u._id !== action.upcomingClass._id)
// 			return Object.assign({}, state, { list })
// 		default:
// 			return state
// 	}
// }



