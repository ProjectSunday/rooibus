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

const init = async () => {
	let uid = firebase.auth().currentUser.uid
	// var token = uuid.v4()


	
	// DB.ref(`users/${uid}/shares`).set({
	// 	[token]: true
	// })

	// USER_REF = DB.ref('users')

	// var user = await getUserProfile()


	// DB.ref('users').once('value').then(blah => {
	// 	console.log('test success', blah.val())
	// 	debugger;
	// })


	LOCATION_REF = DB.ref('locations').push()
	LOCATION_REF.set({ uid })

	LOCATION_REF.on('value', (stuff) => {
		console.log('locations value', stuff.val())
	})

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

        ".read": "auth != null && 
		(
			data.child('uid').val() === auth.uid 
			||
			data.child('shares').hasChild(root.child('users/shareToken').val())
		)",

        ".read": "auth != null && (data.child('uid').val() === auth.uid || data.child('shares').hasChild(root.child('users/shareToken').val()) )",

  //hmn rules suck, find out how to do multishare later, do one share now, test to see if this shit works

  
/********************************************************
 * User
 ********************************************************/

const getUserProfile = async () => {
	return DB.ref('users').once('value')
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


	
	// DB.ref(`users/${uid}/locations`).set({
	// 	[token]: true
	// })

	LOCATION_REF.set({
		[token]: true
	})


	// coordsRef.set({ yo: 'yaaaaa'})

	DB.ref(`locations`).on('value', (stuff) => {
		console.log('locations value', stuff.val())
	})
		
	console.log('createSession2 done')

}

const createShare = () => {
	let uid = firebase.auth().currentUser.uid
	let token = uuid.v4()
	
	let shares = DB.ref(`users/${uid}/shares`).push({
		[token]: true
	})

	LOCATION_REF.child('shares').push({
		[token]: true
	})

}


export default { createSession, createSession2, createShare, getCurrentUser, init, onCoordsChange, pushCoords, signIn, test }




//hmn, don't ever quit without notes again

/*

	how the fuck is sharing suppose to work?

	ALL THROUGH THE SHARE KEY



User Story:
	1. user A sends url to user B, user B can now see user A

	2. user B can now share location with user A, user A will see user B's location


Technical Design
	Story 1:
		User A stores coordinates in locations, access controlled by uid.

*/



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
		.write: auth !== null && ( !data.exists() || auth.uid === data.uid )
	}
}

//sharing begins

1. user A creates a session
	sessions: {
		'session1': {
			token: 'xxx',
			users: {
				'uid': {
					...
					locationKey: 'xxx'
				}
			}
			.read: auth !== null && user.sessionToken === data.token
			.write: auth !== null && user.sessionToken === data.token
		}
	}

2. user A sends url with session token
3. user B read and extract session token
4. user B writes session token
5. user B writes uid to session.users
	'session1': {
		users: {
			'uid': {
				...
				locationKey: 'xxx'
			}
		}
	}
6. user A sees request and writes to locations


//hmn, rules are not fucken filters
//hmn, use uid for locations because we would want to override the coords


*/


