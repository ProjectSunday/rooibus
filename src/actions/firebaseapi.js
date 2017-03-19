import * as firebase from 'firebase'
import uuid from 'uuid'

import * as Actions from './actions'
import { dispatch, store } from '../store/store'

var CURRENT_UID

const config = {
	apiKey: "AIzaSyAmfbW-4uYV0kT8l2TpfmjRTSSZIl-x6_A",
	authDomain: "rooibusdev.firebaseapp.com",
	databaseURL: "https://rooibusdev.firebaseio.com",
	storageBucket: "rooibusdev.appspot.com",
	messagingSenderId: "212546233297"
}
firebase.initializeApp(config)

const DB = firebase.database()



/********************************************************
 * Testing
 ********************************************************/
export const test2 = () => {

}


/********************************************************
 * Auth
 ********************************************************/
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		console.info('user in:', user.uid)
		init()
		// var isAnonymous = USER.isAnonymous
	} else {
		console.info('USER out, signing in...')
		firebase.auth().signInAnonymously()
	}
})

const init = () => {
	CURRENT_UID = firebase.auth().currentUser.uid

	DB.ref(`users/${CURRENT_UID}`).update({ name: 'yo' })
	
	DB.ref(`locations/${CURRENT_UID}/shares`).set({	[CURRENT_UID]: true	})

	checkSharedMap()
}

/********************************************************
 * Location
 ********************************************************/
export const pushCoords = async (coords) => {
	DB.ref(`locations/${CURRENT_UID}/coords`).push(coords).then(() => {
		// console.log('pushcoords', coords)
		dispatch({
			type: 'MAP_ADD_USER_COORDS',
			uid: CURRENT_UID,
			coords: coords
		})
	}).catch((error) => {
		console.log('pushCoords error', error)
	})
}

/********************************************************
 * Map
 ********************************************************/

export const createMap = async () => {
	var mapId = uuid.v4().replace(/\-/g,'')

	await addUserMapAccess(CURRENT_UID, mapId)
	await setupUserViewRequestSite(mapId, CURRENT_UID)
	await listenToViewRequests(mapId, CURRENT_UID)

	return mapId
}

export const joinMap = async (mapId) => {
	await addUserMapAccess(CURRENT_UID, mapId)
	
	const onRequestComplete = (uid) => {
		listenToUserLocation(uid)
	}

	var users = await getMapUsers(mapId)
	for (var uid in users) {
		initiateViewRequest(mapId, uid, CURRENT_UID, onRequestComplete)
	}
}

export const shareToAll = () => {
	var id = store.getState().map.id
	if (!id) {
		console.error('no map id found')
		return
	}

	listenToViewRequests(id)
}

/*** ***/

const checkSharedMap = () => {
	var state = store.getState()
	if (state.map && state.map.id) {
		joinMap(state.map.id)
	}
}
const getMapUsers = async (mapId) => {
	var ref = DB.ref(`maps/${mapId}/users`)
	var users = await ref.once('value')
	return users.val()
}
const listenToNewMapShare = (id) => {
	var ref = DB.ref(`maps/${id}/users`)
	ref.on('value', async (snapshot) => {

		var users = snapshot.val()
		for (var uid in users) {
			await DB.ref(`maps/${id}/users/${uid}`).update({
				[CURRENT_UID]: true
			})
			listenToUserLocation(uid)
		}
	})
}

const listenToViewRequests = (mapId, uid) => {
	let ref = DB.ref(`maps/${mapId}/users/${uid}`)
	ref.on('value', (users) => {
		var locationId = uid
		for (var requestingUserId in users.val()) {
			grantLocationAccessToUser(locationId, requestingUserId)
			confirmViewRequest(mapId, uid, requestingUserId)
		}
	})
}

const grantLocationAccessToUser = (locationId, uid) => {
	DB.ref(`locations/${locationId}/shares`).update({ [uid]: true })
}
const confirmViewRequest = (mapId, sharingUserId, requestingUserId) => {
	DB.ref(`maps/${mapId}/users/${sharingUserId}`).update({	[requestingUserId]: true })
}
const initiateViewRequest = async (mapId, sharingUserId, requestingUserId, onComplete) => {
	var ref = DB.ref(`maps/${mapId}/users/${sharingUserId}`)
	ref.update({ [requestingUserId]: 'requesting' })
	ref.child(requestingUserId).on('value', result => {
		if (result.val() === true) {
			onComplete(sharingUserId)
		}
	})
}
const listenToUserLocation = (uid) => {
	console.log('listenToUserLocation uid:', uid)
	var ref = DB.ref(`locations/${uid}/coords`)


	// ref.once('value', snapshot => {
	// 	console.log('listenToUserLocation', snapshot.val())
	// }, error => {
	// 	console.log('230 error:', error)
	// })

	// ref.off()


	ref.on('child_added', snapshot => {
		// console.log('new location uid', uid, snapshot.val())
		dispatch({
			type: 'MAP_ADD_USER_COORDS',
			uid,
			coords: snapshot.val()
		})
	}, error => {
		console.log('listenToUserLocation error:', error)
	})
}
const setupUserViewRequestSite = async (mapId, uid) => {
	await DB.ref(`maps/${mapId}/users`).set({
		[uid]: {
			[uid]: 'view request site'
		}
	})
}

/********************************************************
 * User
 ********************************************************/
const addUserMapAccess = async (uid, mapId) => {
	await DB.ref(`users/${uid}/maps`).set({ [mapId]: true })
}

