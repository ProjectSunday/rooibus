import * as firebase from 'firebase'
import uuid from 'uuid'

import { dispatch, store } from '~/store'

var coordKey, coordsRef, locationRef, sessionKey;

var config = {
	apiKey: "AIzaSyAmfbW-4uYV0kT8l2TpfmjRTSSZIl-x6_A",
	authDomain: "rooibusdev.firebaseapp.com",
	databaseURL: "https://rooibusdev.firebaseio.com",
	storageBucket: "rooibusdev.appspot.com",
	messagingSenderId: "212546233297"
}
firebase.initializeApp(config)

const DB = firebase.database()

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var isAnonymous = user.isAnonymous;
		var uid = user.uid;
		console.log('user in', uid)
	} else {
		console.log('user out')
	}
})

const test = (data) => {
	DB.ref('locations').once('value').then(blah => {
		console.log('work god damn it, ', blah)
	});
}

const pushCoords = (coords) => {
	console.log('pushCoords', coords)
	DB.ref(`locations/${locationRef.key}/coords`).push(coords).then(() => {
		console.log('pushCoords done')
	}).catch(() => {
		console.log('pushCoords error')
	})
}

const init = () => {
	let uid = firebase.auth().currentUser.uid
	var token = uuid.v4()

	DB.ref(`users/${uid}/locations`).set({
		[token]: true
	})

	locationRef = DB.ref('locations').push()
	locationRef.set({
		token
	})

	

	console.log('init done')
}

const signIn = async () => {
	// console.log('signIn start')
	return firebase.auth().signInAnonymously()

	// firebase.auth().signInAnonymously().then(u => {
	// 	console.log('signIn success uid', u.uid)
	// 	// debugger;
	// 	// let uid = firebase.auth().currentUser.uid
		

	// 	DB.ref(`locations/${u.uid}/coords`).on('value', snapshot => {
	// 		console.log('locations value', snapshot.val())
	// 	})
	// 	startLocationTracking()

	// }).catch(e => {
	// 	console.error('Sign in problem, tell Hai.')
	// 	console.log(JSON.stringify(e))
	// })
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

const onCoordsChange = (callback) => {
	console.log('yo')
	let u = firebase.auth().currentUser.uid
	DB.ref(`locations`).on('child_changed', snapshot => {
		console.log('yooooo')
		callback(snapshot.val())
	})
}


export default { createSession, createSession2, getCurrentUser, init, onCoordsChange, pushCoords, signIn, test }


/*
users: {
	'user1': {
		shares: {
			Uid: true
		}
	},
	'user2': {

	}
}


locations: {
	$location: {
		uid: 'user1',
		share: {
			'user2': true
		},
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


//user A create token, stores in locations
//user A create coords object with token


this.listenTo(this.model, 'change:searchTopic')
this.set()
sessions: {
	'$session': {
		//read: user.shareToken == data.shareToken
		//write: user.shareToken == data.shareToken
		'token': 'xxx',
		'members': {
			'$member': {
				displayName: 'blah',
				coordKey: '$coord'
			},
			...
		}
	},
	...
}


locations: {
	'$uid': {
		token: 'xxx',
		coords: {
			'$coords': { lat, lng }
			...
		}
	}
	...
}


'$coord': [
		//read: user.coords.$coord == 'self' || 'shared'
		//write: user.coords.$coord == 'self'
		{ lat, lng },
		...
	]



		//sharing steps - user A sharing with user B
		1. user A generates session token and store
		2. user A creates session with share token
		3. user A add self to session.members
		3. user A sends share token to user B
		4. user B reads token and store, user B now has access to session
		5. user B adds user A coord Id to his coords
		
		//user B opts to share with user A
		1. user B writes to session.members
		2. user A sees new member, writes user B's coord Id to his coords


requirement:
	1. user should be able to read/write self coords
	2. user should be able to only read shared coords
	3. user should not be able to write shared coords

sharing requirement:
	1. user A should be able to read/write secret   //hmn, use token for secret, you're on the right track'
	2. user A should be able to share secret
	2. user B should be able to read shared secret
	3. user B should NOT be able to write shared secret


*/


