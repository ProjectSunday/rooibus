import * as firebase from 'firebase'

import { dispatch, store } from '~/store'

var coordKey, sessionKey, uid;

var config = {
	apiKey: "AIzaSyAmfbW-4uYV0kT8l2TpfmjRTSSZIl-x6_A",
	authDomain: "rooibusdev.firebaseapp.com",
	databaseURL: "https://rooibusdev.firebaseio.com",
	storageBucket: "rooibusdev.appspot.com",
	messagingSenderId: "212546233297"
}
firebase.initializeApp(config)

const db = firebase.database()

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var isAnonymous = user.isAnonymous;
		var uid = user.uid;
		console.log('user in', user)
	} else {
		console.log('user out')
	}
})

const pushCoords = (coords) => {
	var { sessionKey, userKey } = store.getState().session
	var coord = db.ref(`sessions/${sessionKey}/users/${userKey}/coords`).push()
	coord.set(coords)
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


const createSession = () => {
	var session = db.ref('sessions').push()
	var user = db.ref(`sessions/${session.key}/users`).push()
	user.set({
		uid: firebase.auth().currentUser.uid
	})
	return { sessionKey: session.key, userKey: user.key }
}

const createSession2 = () => {
	uid = firebase.auth().currentUser.uid

	var coord = db.ref('coords').push()
	coord.set({
		uid: uid,
		list: []
	})
	coordKey = coord.key

	var session = db.ref('sessions').push()
	var s = {}
	s[coordKey] = true
	session.set(s)
	sessionKey = session.key

	var user = db.ref(`users/${uid}`)

	var u = {}
	u[sessionKey] = true
	user.set(u)

	db.ref('coords').on('value', function (snapshot) {
		console.log('snapshot', snapshot.val())
	})
}


const sessions = db.ref('sessions')


export default { createSession, createSession2, getCurrentUser, pushCoords, sessions, signIn }


/*
users: {
	'$uid': {
		coords: {
			$coord: 'self' // 'shared'
		},

		shares: {
			token: 'xxx',
			with: 'anyone'
		},

		session: {
			'$sessionid': true  //'owner', ''
		}


	}
}


sessions: {
	'$session': {
		//read: user.sessions.$session == 'creator' || 

		'token': 'xxx'
		'$coord': true,
		...
	}
}


coords: {
	'$coord': {
		//read: user.coords.$coord == 'self' || 'shared'
		//write: user.coords.$coord == 'self'
		'shareToken': 'xxxx'
		'list': [x, x]
	}
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


