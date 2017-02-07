import * as firebase from 'firebase'
import uuid from 'uuid'

import { dispatch, store } from '~/store'

var coordKey, coordsRef, LOCATION_REF, SESSION_REF, USER_REF;

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
	

	USER_REF = DB.ref(`users/${uid}`)
	USER_REF.set({ publicKey })

	LOCATION_REF = DB.ref('locations').push()
	LOCATION_REF.set({ uid })

	console.log('init done')
	console.log('user-ref', USER_REF)
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

const createMap = () => {
	var mapKey = uuid.v4().replace(/\-/g,'')

	USER_REF.update({ mapKey })

	SESSION_REF = DB.ref(`maps/${mapKey}`).set({
		key: mapKey,
		viewRequests: {
			[publicKey]: true
		}
	})
}

const joinMap = () => {

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

const createSession = () => {
	var id = uuid.v4().replace(/\-/g,'')

	USER_REF.update({
		sessionId: id
	})

	SESSION_REF = DB.ref(`sessions/${id}`)
	SESSION_REF.set({
		uid,
		publicKey
	})

}

const joinSession = async (id) => {
	console.debug('user-ref', USER_REF)
	
	if (!USER_REF) {
		await signIn()
	}
	console.debug('user-ref', USER_REF)

	//hmn this is annoying why user_ref keeps undefining, fix this shit

	USER_REF.update({
		sessionId: id
	})

	DB.ref(`sessions/${id}`).once('value').then(function (snapshot) {
		snapshot.ref.update({
			acknowledgements: {
				[publicKey]: true
			}
		})
	})
}

/********************************************************
 * Export
 ********************************************************/

export default { createSession, getCurrentUser, init, joinSession, onCoordsChange, pushCoords, signIn, test }

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
		mapKey: 'mapkey1'
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


