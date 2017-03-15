import * as firebase from 'firebase'
import uuid from 'uuid'

import * as Actions from './actions'
import { dispatch, store } from '../store/store'

const User = {}
const MapFB = {}

var coordKey, coordsRef, LOCATION_REF, SESSION_REF, USER_REF, MAP_REF;

var CURRENT_UID

// var PUBLIC_KEY, uid

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
 * Auth
 ********************************************************/

var USER, LOCATION, MAP

const init = (user) => {

	var uid = firebase.auth().currentUser.uid
	var publicKey = uuid.v4().replace(/\-/g,'')
	USER = {
		publicKey,
		ref: DB.ref(`users/${uid}`),
		uid
	}

	CURRENT_UID = uid

	USER.ref.update({ publicKey })
	

	LOCATION = {
		ref: DB.ref('locations').push()
	}

	DB.ref(`locations/${USER.uid}/shares`).set({
		[USER.uid]: true
	})

	// DB.ref(`locations`).on('value', (snapshot) => {
	// 	console.log('location child changed', snapshot.val())
	// })
	
	// LOCATION.ref.update({ publicKey, uid })

	checkSharedMap()

	// Actions.startLocationTracking()

}

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		console.info('user in', user.uid)
		init(user)

		// var isAnonymous = USER.isAnonymous
	} else {
		console.info('USER out, signing in...')
		firebase.auth().signInAnonymously()
	}
})

/********************************************************
 * Testing
 ********************************************************/


const test = (data) => {
	DB.ref('test').set({
		uid: firebase.auth().currentUSER.uid,
		yotest: 'hello user:' + firebase.auth().currentUSER.uid
	})
	console.log('test')
}

export const test2 = () => {

	console.log('test2222')

	DB.ref(`testing/yo`).once('value', (snapshot) => {
		console.log('test2', snapshot.val())
	})

	DB.ref('testing/yo').set({
		blah: 'blah'
	})
}

/********************************************************
 * Init
 ********************************************************/


/********************************************************
 * location
 ********************************************************/
//hmn pushcoords is dispatching multiples
export const pushCoords = async (coords) => {
	DB.ref(`locations/${USER.uid}/coords`).push(coords).then(() => {
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

	await addUserMapAccess(USER.uid, mapId)
	await setupUserViewRequestSite(mapId, USER.uid)
	await listenToViewRequests(mapId, USER.uid)

	console.log('createMap id: ', mapId)
	return mapId
}

export const joinMap = async (mapId) => {
	await addUserMapAccess(USER.uid, mapId)
	
	const onRequestComplete = (uid) => {
		listenToUserLocation(uid)
	}

	var users = await getMapUsers(mapId)
	console.log('142 users:', users)
	for (var uid in users) {
		initiateViewRequest(mapId, uid, USER.uid, onRequestComplete)
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

/*** map private ***/

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
				[USER.uid]: true
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
		console.log('new location uid', uid, snapshot.val())
		// dispatch({
		// 	type: 'MAP_ADD_USER_COORDS',
		// 	uid,
		// 	coords: snapshot.val()
		// })
	}, error => {
		console.log('listenToUserLocation error:', error)
	})
}

const listenToViewRequestConfirmation = (mapId, sharingUserId, requestingUserId) => {

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

/********************************************************
 * Export
 ********************************************************/
// export default module



/*
simplified workflow
1. USER a creates map session
2. USER a share map
3. USER b joins map
4. USER b share LOCATION
*/

/*
new workflow for joining a "minimap"

USER a creates minimap
-------------------------------

USER a creates map, writes:
	USERId{
		mapKey: 'mapkey1'
		publicKey: 'publickeya'
	}
	mapId: {
		key: 'mapkey1'
		viewRequests: {
			'publickeya': true
		}
	}

USER a sends mapkey to USER b, writes:
	USERB: {
		map: { 'mapkey1': true }
	}

USER b request view, writes:
	mapId: {
		key: 'mapkey1',
		viewRequests: {
			'publickeya': true,
			'publickeyb': true
		}
	}

USER a sees new key, writes:
	LOCATIONA: {
		shares: {
			'publickeyb': true
		}
	}

USER b sees LOCATIONA

USER b join minimap
--------------------------------

USER b writes:
	LOCATIONB: {
		shares: {
			'publickeyb': true
		}
	}






	

/*




USER a shares with USER b
-------------------------------

USER a creates session, writes:
	USERId: {
		sessionKey: 'session-key-1',
		publicKey: 'public-key-a'
	}
	sessionId: {
		key: 'session-key-1',
		publicKey: 'public-key-a',
		acknowledgements: {}
	}

USER a send link to USER b

USER b writes:
	USERId: {
		sessionKey: 'session-key-1'
	}

USER b creates publicKey (should already be created), writes:
	USERId: {
		publicKey: 'public-key-b'
	}
	sessionId: {
		key: 'session-key-1',
		acknowledgements: {
			'public-key-b': true
		}
	}

USER a takes 'public-key-b', writes:
	LOCATIONId: {
		//.read: "auth != null && data.child('shares' + root.child('USERs/ + auth.uid + '/publicKey').val()).val() == true"
		//.write: 'auth != null && data.child('uid').val() == auth.uid"
		shares: {
			'public-key-b': true
		}
	}


USER b shares with USER a
------------------------------
USER b takes USER a public key, writes:
	LOCATIONId: {
		shares: {
			'public-key-a': true
		}
	}



*/


