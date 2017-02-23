import * as firebase from 'firebase'
import uuid from 'uuid'

import { dispatch, store } from '../store/store'

var coordKey, coordsRef, LOCATION_REF, SESSION_REF, USER_REF, MAP_REF;

var publicKey, uid

var config = {
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

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var isAnonymous = user.isAnonymous;
		console.info('user in', user.uid)
	} else {
		console.info('user out')
	}
})

const getUserRef = async () => {
	if (!firebase.auth().currentUser) {
		await signIn()
	}
	var uid = firebase.auth().currentUser.uid
	return firebase.database().ref(`users/${uid}`)
}

const signIn = async () => {
	return firebase.auth().signInAnonymously()
}

/********************************************************
 * Testing
 ********************************************************/


const test = (data) => {
	DB.ref('test').set({
		uid: firebase.auth().currentUser.uid,
		yotest: 'hello user:' + firebase.auth().currentUser.uid
	})
	console.log('test')
}

const test2 = () => {
	var now = new Date()
	DB.ref('testing').update({
		[now.getTime()]: now.getTime() + now.toString()
	})
}


// const test = (data) => {
// 	DB.ref('locations').once('value').then(blah => {
// 		console.log('test success', blah)
// 	}).catch(e => {
// 		console.log('test error', e)
// 	})
// }

/********************************************************
 * Init
 ********************************************************/

const init = async () => {
	uid = firebase.auth().currentUser.uid
	publicKey = uuid.v4().replace(/\-/g,'')
	

	var userRef = await getUserRef()
	userRef.update({ publicKey })

	LOCATION_REF = DB.ref('locations').push()
	LOCATION_REF.set({ uid })



	//testing

	DB.ref('testing').on('child_added', snapshot => {
		console.log('testing: ', snapshot.key, '  :  ', snapshot.val())
	})	

	// DB.ref('maps').orderByKey().on("child_added", snapshot => {

		// console.log('huhhhh')
	// DB.ref('maps').on('value', snapshot => {
	// 	console.log('maps:value')
	// 	console.log(snapshot.val())
	// })

	console.log('init done')
	// console.log('user-ref', USER_REF)
}

/********************************************************
 * Location
 ********************************************************/

const pushCoords = (coords) => {
	// console.log('pushCoords', coords)
	DB.ref(`locations/${LOCATION_REF.key}/coords`).push(coords).then(() => {
		// console.log('pushCoords done')
	}).catch(() => {
		console.log('pushCoords error')
	})
}

const onCoordsChange = (callback) => {
	// console.log('onCoordsChange start')
	DB.ref('locations').on('value', snapshot => {
		callback(snapshot.val())
	})

}

/********************************************************
 * Map
 ********************************************************/


//hmn, what the fuck am i working on.  oh yes, get fucken sharing to work
//hmn, child_added work, use snapshot.key.  get sharing publickey in maps to work


const createMap = async () => {
	var mapKey = uuid.v4().replace(/\-/g,'')

	var userRef = await getUserRef()
	userRef.child('maps').set({ [mapKey]: true })

	var mapRef = DB.ref(`maps/${mapKey}`).set({
		viewRequests: {
			[publicKey]: true
		}
	})

	console.log('createMap key: ', mapKey)

}

const joinMap = async (mapKey) => {
	// await ensureAuthentication()
	let userRef = await getUserRef()

	userRef.child('maps').update({
		[mapKey]: true
	})

	DB.ref(`maps/${mapKey}`).once('value', snapshot => {
		console.log('maps snaopshot')
		console.log(snapshot.val())
	})


}

/********************************************************
 * User
 ********************************************************/

const getUserProfile = async () => {
	return DB.ref('users').once('value')
}

const getCurrentUser = () => {
	return firebase.auth().currentUser
}

/********************************************************
 * Session
 ********************************************************/

// const createSession = () => {
// 	var id = uuid.v4().replace(/\-/g,'')

// 	USER_REF.update({
// 		sessionId: id
// 	})

// 	SESSION_REF = DB.ref(`sessions/${id}`)
// 	SESSION_REF.set({
// 		uid,
// 		publicKey
// 	})

// }

// const joinSession = async (id) => {
// 	console.debug('user-ref', USER_REF)
	
// 	if (!USER_REF) {
// 		await signIn()
// 	}
// 	console.debug('user-ref', USER_REF)


// 	USER_REF.update({
// 		sessionId: id
// 	})

// 	DB.ref(`sessions/${id}`).once('value').then(function (snapshot) {
// 		snapshot.ref.update({
// 			acknowledgements: {
// 				[publicKey]: true
// 			}
// 		})
// 	})
// }

/********************************************************
 * Export
 ********************************************************/

export default { createMap, getCurrentUser, init, joinMap, onCoordsChange, pushCoords, signIn, test, test2 }



/*
simplified workflow
1. user a creates map session
2. user a share map
3. user b joins map
4. user b share location
*/

/*
new workflow for joining a "minimap"

user a creates minimap
-------------------------------

user a creates map, writes:
	userId{
		mapKey: 'mapkey1'
		publicKey: 'publickeya'
	}
	mapId: {
		key: 'mapkey1'
		viewRequests: {
			'publickeya': true
		}
	}

user a sends mapkey to user b, writes:
	userB: {
		map: { 'mapkey1': true }
	}

user b request view, writes:
	mapId: {
		key: 'mapkey1',
		viewRequests: {
			'publickeya': true,
			'publickeyb': true
		}
	}

user a sees new key, writes:
	locationA: {
		shares: {
			'publickeyb': true
		}
	}

user b sees locationA

user b join minimap
--------------------------------

user b writes:
	locationB: {
		shares: {
			'publickeyb': true
		}
	}






	

/*




user a shares with user b
-------------------------------

user a creates session, writes:
	userId: {
		sessionKey: 'session-key-1',
		publicKey: 'public-key-a'
	}
	sessionId: {
		key: 'session-key-1',
		publicKey: 'public-key-a',
		acknowledgements: {}
	}

user a send link to user b

user b writes:
	userId: {
		sessionKey: 'session-key-1'
	}

user b creates publicKey (should already be created), writes:
	userId: {
		publicKey: 'public-key-b'
	}
	sessionId: {
		key: 'session-key-1',
		acknowledgements: {
			'public-key-b': true
		}
	}

user a takes 'public-key-b', writes:
	locationId: {
		//.read: "auth != null && data.child('shares' + root.child('users/ + auth.uid + '/publicKey').val()).val() == true"
		//.write: 'auth != null && data.child('uid').val() == auth.uid"
		shares: {
			'public-key-b': true
		}
	}


user b shares with user a
------------------------------
user b takes user a public key, writes:
	locationId: {
		shares: {
			'public-key-a': true
		}
	}



*/


