// import request from 'superagent'
// import { push } from 'react-router-redux'

import { dispatch, store } from '../store/store'

import uuid from 'uuid'

//export * from './firebaseapi'


import * as FirebaseApi from './firebaseapi'
// export const firebase = firebaseapi

// import { signIn } from './firebaseapi'


export const init = async () => {
	// await FirebaseApi.init()

	// startLocationTracking()

	// FirebaseApi.onCoordsChange(coords => {
	// 	console.log('onCoordsChange coords:', coords)
	// })

}

// import { sendQuery, sendMutation } from './prismapi'

////////////////////////////////////////////////////////////////////////////////////////////////////
// Auth
////////////////////////////////////////////////////////////////////////////////////////////////////
export const signIn = () => {
	FirebaseApi.signIn()
}


/********************************************************
 * Sharing
 ********************************************************/
export const joinMap = (mapId) => {
	dispatch({ type: 'SET_MAP_ID', mapId })
	// FirebaseApi.joinMap(mapId)`
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Testing
////////////////////////////////////////////////////////////////////////////////////////////////////

export const test1 = () => {
	// dispatch({
	// 	type: 'MAP_ADD_USER_COORDS',
	// 	uid: 'blahuid',
	// 	coords: {
	// 		lat: 39.779410,
	// 		lng: -86.164397
	// 	}
	// })
}

export const test2 = () => {
	FirebaseApi.test2()
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//Auth
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Location
////////////////////////////////////////////////////////////////////////////////////////////////////

var _watchPositionId
export const startLocationTracking = () => {
	if (_watchPositionId !== undefined) return
	_watchPositionId = navigator.geolocation.watchPosition(location => {
		FirebaseApi.pushCoords({ lat: location.coords.latitude, lng: location.coords.longitude })
	}, undefined, { enableHighAccuracy: true })
}
export const stopLocationTracking = () => {
	if (_watchPositionId === undefined) return
	navigator.geolocation.clearWatch(_watchPositionId)
}

export const addLocation = async (coords) => {

	// FirebaseApi.pushCoords(coords)

	dispatch({
		type: 'TRACKING_ADD_COORDS',
		coords
	})
}


/********************************************************
 * Map
 ********************************************************/
export const shareMap = async () => {
	var state = store.getState()
	if (state.map.id !== undefined) return

	var mapId = await FirebaseApi.createMap()
	dispatch({ type: 'SET_MAP_ID', mapId })
}

export const joinSession = (key) => {
	FirebaseApi.joinSession(key)
}

export const shareToAll = () => {
	FirebaseApi.shareToAll()
}

export const enableAutoAdjustMapBounds = () => {
	dispatch({
		type: 'MAP_SET_AUTO_ADJUST_BOUNDS',
		automatic: true
	})
}
export const mapBoundsChanged = () => {
	var state = store.getState()
	if (state.map.autoAdjustBounds) {
		console.log('MAP_SET_AUTO_ADJUST_BOUNDS false')
		dispatch({
			type: 'MAP_SET_AUTO_ADJUST_BOUNDS',
			automatic: false
		})
	}
}



/********************************************************
 * Sharing
 ********************************************************/
export const showSharingModal = () => {
	dispatch({ type: 'UI_SET_SHARING_MODAL_OPEN', open: true})
}
export const hideSharingModal = () => {
	dispatch({ type: 'UI_SET_SHARING_MODAL_OPEN', open: false})
}
export const setAutoAdjustBounds = (automatic) => {
	dispatch({ type: 'MAP_SET_AUTO_ADJUST_BOUNDS', automatic })
}

/********************************************************
 * User
 ********************************************************/
export const setUserOnlineStatus = (online) => {
	dispatch({ type: 'USER_SET_ONLINE_STATUS', online })
}

// export const Authentication = {
// 	start: () => {
// 		dispatch({ type: 'AUTH_SHOW_SPINNER', value: true })

// 		var popup = createPopup();

// 		AUTHENTICATION_INTERVAL_ID = setInterval(() => {
// 			var token
// 			try {
// 				var href = popup.location.href
// 				token = href.split('#')[1].split('&')[0].split('=')[1]
// 			} catch (err) {}

// 			if (token) {
// 				doneAuthorizing(token)
// 				popup.close()
// 			}

// 			if (popup.closed) {
// 				doneAuthorizing()
// 			}

// 		}, 10)

// 		function doneAuthorizing(token) {
// 			if (token) {
// 				Profile.get(token)
// 			} else {
// 				clearInterval(AUTHENTICATION_INTERVAL_ID)
// 				dispatch({ type: 'AUTH_SHOW_SPINNER', value: false })
// 			}
// 		}
// 	}
// }

// function createPopup() {
// 	var width = 700
// 	var height = 700

// 	var left = (screen.width - width) / 2
// 	var top = (screen.height - height) / 2

// 	var url = process.env.MEETUP_OAUTH2_AUTH_URL || 'https://secure.meetup.com/oauth2/authorize?client_id=sgeirri963sprv1a1vh3r8cp3o&response_type=token&scope=basic+event_management&redirect_uri=http://localhost:7000/authentication'
// 	var settings = `scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no,width=${width},height=${height},top=${top},left=${left}`;
// 	return window.open(url, '', settings)
// }




// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //Authentication
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// var AUTHENTICATION_INTERVAL_ID

// export const Authentication = {
// 	start: () => {
// 		dispatch({ type: 'AUTH_SHOW_SPINNER', value: true })

// 		var popup = createPopup();

// 		AUTHENTICATION_INTERVAL_ID = setInterval(() => {
// 			var token
// 			try {
// 				var href = popup.location.href
// 				token = href.split('#')[1].split('&')[0].split('=')[1]
// 			} catch (err) {}

// 			if (token) {
// 				doneAuthorizing(token)
// 				popup.close()
// 			}

// 			if (popup.closed) {
// 				doneAuthorizing()
// 			}

// 		}, 10)

// 		function doneAuthorizing(token) {
// 			if (token) {
// 				Profile.get(token)
// 			} else {
// 				clearInterval(AUTHENTICATION_INTERVAL_ID)
// 				dispatch({ type: 'AUTH_SHOW_SPINNER', value: false })
// 			}
// 		}
// 	}
// }

// function createPopup() {
// 	var width = 700
// 	var height = 700

// 	var left = (screen.width - width) / 2
// 	var top = (screen.height - height) / 2

// 	var url = process.env.MEETUP_OAUTH2_AUTH_URL || 'https://secure.meetup.com/oauth2/authorize?client_id=sgeirri963sprv1a1vh3r8cp3o&response_type=token&scope=basic+event_management&redirect_uri=http://localhost:7000/authentication'
// 	var settings = `scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no,width=${width},height=${height},top=${top},left=${left}`;
// 	return window.open(url, '', settings)
// }


// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //Category
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// export const Category = {
// 	getList: async () => {
// 		var { list } = await sendQuery(`
// 			list: categories {
// 				_id,
// 				name,
// 				imageName
// 			}
// 		`)
// 		dispatch({ type: 'CATEGORY_SET_LIST', list })
// 	},
// 	setSelected: (id) => {
// 		dispatch({ type: 'CATEGORY_SET_SELECTED', value: id })
// 	}
// }

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //Navigation
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// export const Navigation = {
// 	go: (path) => {
// 		dispatch(push(path))
// 	}
// }

// export const navigate = (path) => {
// 	dispatch(push(path))
// }

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //Notification
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// export const showNotification = (notification) => {
// 	dispatch({ type: 'SHOW_NOTIFICATION', notification })
// }

// export const hideNotification = (notification) => {
// 	dispatch({ type: 'HIDE_NOTIFICATION', notification })
// }

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //Profile
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// export const Profile = {
// 	get: async (token) => {
// 		var { user } = await sendMutation(`	
// 			user: authenticateViaMeetup (token: "${token}") {
// 				_id,
// 				token,
// 				meetup {
// 					token,
// 					member {
// 						id,
// 						name,
// 						photo {
// 							thumb_link
// 						}
// 					}
// 				}
// 			}
// 		`)
// 		dispatch({ type: 'AUTH_LOGIN_SUCCESS', user })
// 	},
// 	logout: async () => {
// 		dispatch({ type: 'AUTH_SHOW_SPINNER', value: true })

// 		var state = store.getState()

// 		var data = await sendMutation(`
// 			logoutUser (token: "${state.authentication.user.token}") { _id, status }
// 		`)

// 		var { status } = data.logoutUser
// 		if (status === 'LOGOUT_SUCCESS') {
// 			dispatch({
// 				type: 'AUTH_LOGOUT_SUCCESS'
// 			})
// 		} else {
// 			throw 'logout failture'  //todo
// 		}
// 	}
// }

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //Requested Class
// ////////////////////////////////////////////////////////////////////////////////////////////////////
// export const RequestedClass = {
// 	create: async (requested) => {
// 		showNotification({ type: 'progress', message: 'Creating new request...' })

// 		var state = store.getState()

// 		var { requestedClass } = await sendMutation(`
// 			requestedClass: createRequestedClass (token: "${state.authentication.user.token}", name: "${requested.name}", categoryId: "${requested.categoryId}") {
// 				_id,
// 				name,
// 				category {
// 					_id,
// 					name,
// 					imageName
// 				},
// 				date,
// 				location
// 			}
// 		`)
// 		dispatch({ type: 'REQUESTEDCLASS_CREATE_SUCCESS', requestedClass })
			
// 		hideNotification({ type: 'success', message: 'New request created'}) 
// 	},
// 	getList: async () => {
// 		var { list } = await sendQuery(`
// 			list: requestedClasses {
// 				_id,
// 				name,
// 				category {
// 					_id,
// 					name,
// 					imageName
// 				},
// 				date,
// 				location
// 			}
// 		`)
// 		dispatch({ type: 'REQUESTEDCLASS_SET_LIST', list })
// 	}
// }

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //UI
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// export const UI = {
// 	// setSelectedCategory: (categoryId) => {
// 	// 	dispatch({ type: 'UI_SET_SELECTED_CATEGORY', value: categoryId })
// 	// }
// }

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// //UpcomingClass
// ////////////////////////////////////////////////////////////////////////////////////////////////////
// export const UpcomingClass = {
// 	create: async (upcoming) => {
// 		showNotification({ type: 'progress', message: 'Creating new class...' })

// 		var state = store.getState()

// 		var { upcomingClass } = await sendMutation(`
// 			upcomingClass: createUpcomingClass (token: "${state.authentication.user.token}", name: "${upcoming.name}", categoryId: "${upcoming.categoryId}") {
// 				_id,
// 				category {
// 					_id,
// 					name,
// 					imageName
// 				},
// 				event {
// 					name
// 				},
// 				teachers {
// 					_id,
// 					meetup {
// 						member {
// 							name,
// 							photo {
// 								thumb_link
// 							}
// 						}
// 					}
// 				}
// 			}
// 		`)
		
// 		dispatch({ type: 'UPCOMINGCLASS_CREATE_SUCCESS', upcomingClass })
			
// 		hideNotification({ type: 'success', message: 'New class created'}) 

// 	},
// 	delete: async (upcoming) => {
// 		showNotification({ type: 'progress', message: 'Deleting class...' })

// 		var state = store.getState()

// 		var { upcomingClass } = await sendMutation(`
// 			upcomingClass: deleteUpcomingClass (token: "${state.authentication.user.token}", _id: "${upcoming._id}") {
// 				_id,
// 				status
// 			}
// 		`)

// 		if (upcomingClass.status === 'DELETE_SUCCESS') {
// 			dispatch({ type: 'UPCOMINGCLASS_DELETE_SUCCESS', upcomingClass })
// 			hideNotification({ type: 'success', message: 'Class deleted.'}) 
// 		} else {
// 			//todo
// 		}



// 	},
// 	getList: async () => {
// 		var { list } = await sendQuery(`
// 			list: upcomingClasses {
// 				_id,
// 				category {
// 					_id,
// 					name,
// 					imageName
// 				},
// 				event {
// 					name
// 				},
// 				teachers {
// 					_id,
// 					meetup {
// 						member {
// 							name,
// 							photo {
// 								thumb_link
// 							}
// 						}
// 					}
// 				}			
// 			}
// 		`)
// 		// console.log('list', list)

// 		dispatch({ type: 'UPCOMINGCLASS_SET_LIST', list })
// 	}
// 	// setSelectedCategory: (categoryId) => {
// 	// 	dispatch({ type: 'UI_SET_SELECTED_CATEGORY', value: categoryId })
// 	// }
// }


// export * from './firebaseapi'

