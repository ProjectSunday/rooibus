import * as firebase from 'firebase'
import uuid from 'uuid'

import { dispatch, store } from '~/store'

var coordKey, coordRef, sessionKey, uid;

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

const pushCoords = (coords) => {
	// var { sessionKey, userKey } = store.getState().session
	// var coord = DB.ref(`sessions/${sessionKey}/users/${userKey}/coords`).push()
	// coord.set(coords)

	if (coordRef) {
		coordRef.set(coords)
	}

}

const signIn = () => {
	firebase.auth().signInAnonymously().catch(function (error) {
		console.error('Sign in problem, tell Hai.')
		console.log(JSON.stringify(error))
	})
}

const getCurrentUser = () => {
	return firebase.auth().currentUser
}


//hmn, writing now works, need to look up list of lists

//hmn, get the coords?

const createSession = () => {
	var session = DB.ref('sessions').push()
	var user = DB.ref(`sessions/${session.key}/users`).push()
	user.set({
		uid: firebase.auth().currentUser.uid
	})
	return { sessionKey: session.key, userKey: user.key }
}

const createSession2 = () => {

	DB.ref('coords').on('value', function (snapshot) {
		debugger;
		console.log('snapshot', snapshot.val())
	})

	uid = firebase.auth().currentUser.uid
	var user = DB.ref(`users/${uid}`)
	var session = DB.ref('sessions').push()
	var coord = DB.ref('coords').push()

	var sessionToken = uuid.v4()
	user.set({
		coordKey: coord.key,
		sessionToken: sessionToken
	})

	session.set({
		token: sessionToken,
		members: [{
			displayName: 'displayName',
			coordKey: coord.key
		}]
	})



	coordRef = coord.child('list').push();

	// coordList.set({ yo: 'yoooooes'});

	pushCoords({ yo: 'yoooes'})



	console.log('createSession2 done')

}

const onCoordsChange = (callback) => {
	DB.ref('coords').on('child_added', function (data) {
		console.log('child_added', data)
	})
}


// const sessions = db.ref('sessions')


export default { createSession, createSession2, getCurrentUser, onCoordsChange, pushCoords, signIn }


/*
users: {
	'$uid': {
		coords: {
			$coord0: 'self',
			$coord1: 'shared',
			...
		},

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

		shareToken: 'xxx'
	}
}


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

coords: {
	'$coord': [
		//read: user.coords.$coord == 'self' || 'shared'
		//write: user.coords.$coord == 'self'
		{ lat, lng },
		...
	]
}


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


