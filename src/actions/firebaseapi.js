import * as firebase from 'firebase'
import uuid from 'uuid'

import { dispatch, store } from '~/store'

var coordKey, coordsRef, LOCATION_REF, sessionKey;

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
		var uid = user.uid;
		console.log('user in', uid)
	} else {
		console.log('user out')
	}
})

const signIn = async () => {
	return firebase.auth().signInAnonymously()
}

/********************************************************
 * Testing
 ********************************************************/

const test = (data) => {
	DB.ref('locations').once('value').then(blah => {
		console.log('test success', blah)
	}).catch(e => {
		console.log('test error', e)
	})
}

/********************************************************
 * Init
 ********************************************************/

const init = () => {
	let uid = firebase.auth().currentUser.uid
	// var token = uuid.v4()

	// DB.ref(`users/${uid}/locations`).set({
	// 	[token]: true
	// })

	LOCATION_REF = DB.ref('locations').push()
	LOCATION_REF.set({ uid, sharingWith: { yo: true } })

	console.log('init done')
}

/********************************************************
 * Location
 ********************************************************/

const pushCoords = (coords) => {
	console.log('pushCoords', coords)
	DB.ref(`locations/${LOCATION_REF.key}/coords`).push(coords).then(() => {
		console.log('pushCoords done')
	}).catch(() => {
		console.log('pushCoords error')
	})
}

const onCoordsChange = (callback) => {
	console.log('onCoordsChange start')
	DB.ref('locations').on('value', snapshot => {
		callback(snapshot.val())
	})
}




const getCurrentUser = () => {
	return firebase.auth().currentUser
}


const createSession = () => {
	DB.ref('locations').once()
}

const createSession2 = () => {

	let uid = firebase.auth().currentUser.uid
	var token = uuid.v4()


	
	DB.ref(`users/${uid}/locations`).set({
		[token]: true
	})

	DB.ref(`locations/${uid}`).set({
		token
	})


	// coordsRef.set({ yo: 'yaaaaa'})

	DB.ref(`locations`).on('value', (stuff) => {
		console.log('locations value', stuff.val())
	})
		
	console.log('createSession2 done')

}


export default { createSession, createSession2, getCurrentUser, init, onCoordsChange, pushCoords, signIn, test }


/*

locations: {
	$location: {
		uid: 'user1',
		sharingWith: {
			'user2': true
		},
		coords: {

		}
		.read: auth !== null && ( auth.uid === data.uid || data.share.user2.exists() )
		.write: auth !== null && auth.uid === data.uid
	}
}

//sharing begins

1. user A creates a session
	sessions: {
		'session1': {
			token: 'xxx',
			.read: auth !== null && user.sessionToken === data.token
			.write: auth !== null && user.sessionToken === data.token
		}
	}

2. user A sends url with session token
3. user B read and extract session token
4. user B writes session token
5. user B writes uid to session.accessRequests
	'session1': {
		accessRequests: {
			'request1': {
				uid: 'uid',
				status: 'IN_PROGRESS'
			}
		}
	}
6. user A sees request and writes to locations


//hmn, rules are not fucken filters



*/


