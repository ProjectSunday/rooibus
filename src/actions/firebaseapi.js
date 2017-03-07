import * as firebase from 'firebase'
import uuid from 'uuid'

import { startLocationTracking } from './actions'
import { dispatch, store } from '../store/store'

const module = {}

var coordKey, coordsRef, LOCATION_REF, SESSION_REF, USER_REF, MAP_REF;

var PUBLIC_KEY, uid

const config = {
	apiKey: "AIzaSyAmfbW-4uYV0kT8l2TpfmjRTSSZIl-x6_A",
	authDomain: "rooibusdev.firebaseapp.com",
	databaseURL: "https://rooibusdev.firebaseio.com",
	storageBucket: "rooibusdev.appspot.com",
	messagingSenderId: "212546233297"
}
firebase.initializeApp(config)

// const DB = firebase.database()

/********************************************************
 * Auth
 ********************************************************/


//hmn, get freakin sharing to workflow

var USER, LOCATION, MAP

const init = (user) => {

	var uid = firebase.auth().currentUser.uid
	var publicKey = uuid.v4().replace(/\-/g,'')
	USER = {
		publicKey,
		ref: firebase.database().ref(`users/${uid}`),
		uid
	}

	USER.ref.update({ publicKey })
	

	LOCATION = {
		ref: firebase.database().ref('locations').push()
	}

	LOCATION.ref.update({ publicKey, uid })

	checkSharedMap()

	startLocationTracking()

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

const test2 = () => {
	var now = new Date()
	DB.ref('testing').update({
		[now.getTime()]: now.getTime() + now.toString()
	})
}

/********************************************************
 * Init
 ********************************************************/

// var _USER;
const getUSER = async () => {
	// if (!_USER) {
	// 	// console.log('creating USER')
	// 	// await firebase.auth().signInAnonymously()
	// 	var uid = firebase.auth().currentUSER.uid
	// 	_USER = {
	// 		LOCATIONRef: firebase.database().ref('LOCATIONs').push(),
	// 		publicKey: uuid.v4().replace(/\-/g,''),
	// 		ref: firebase.database().ref(`USERs/${uid}`),
	// 		uid: firebase.auth().currentUSER.uid
	// 	}
	// }
	// console.log('_USER', _USER)
	// return _USER
}

// module.init = async () => {

// 	// dispatch({ 'SET_MAP_ID': })
// 	// var USER = await getUSER()
// 	// USER.ref.update({ publicKey: USER.publicKey })


// 	// USER.LOCATIONRef.set({ uid: USER.uid })

// 	console.log('init done')
// }


/********************************************************
 * location
 ********************************************************/

module.pushCoords = async (coords) => {
	// var USER = await getUSER()
	LOCATION.ref.child('coords').push(coords).then(() => {
		console.log('pushCoords done', coords)
	}).catch((error) => {``
		console.log('pushCoords error', error)
	})
}

const watchCoordsChange = () => {


}

/********************************************************
 * Map
 ********************************************************/

module.createMap = async () => {
	var mapKey = uuid.v4().replace(/\-/g,'')
	USER.ref.child('maps').set({ [mapKey]: true })

	MAP = firebase.database().ref(`maps/${mapKey}`).set({
		// viewRequests: {
		// 	[USER.publicKey]: true
		// },
		locations: {
			[LOCATION.ref.key]: true
		}
	})

	console.log('createMap key: ', mapKey)

}

const checkSharedMap = () => {
	var state = store.getState()
	if (state.map && state.map.id) {
		module.joinMap(state.map.id)
		console.log('joined mapid:', state.map.id)
	}
}


module.joinMap = async (mapKey) => {
	
	await USER.ref.child('maps').update({
		[mapKey]: true
	})

	var map = await firebase.database().ref(`maps/${mapKey}`).once('value')
	console.log('179 mapkey', mapKey)
	console.log('179 map', map.val())
	var locations = map.val().locations
	await USER.ref.child('locations').update(locations)

	for (var location in locations) {
		firebase.database().ref(`locations/${location}`).on('value', yo => {
			console.log('186 yo', yo.val().coords)
		})
	}
	// firebase.database().ref(`locations`).on('value', yo => {



}

/********************************************************
 * Export
 ********************************************************/
export default module



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


