import * as firebase from 'firebase'

import { dispatch, store } from '~/store'

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

//hmn, need to figure out how to lock down sessions.  user should have a .sessions { id: true }.  flat data structure

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

	
	// var session = db.ref('sessions').push()
	// session.set({
	// 	uid: firebase.auth().currentUser.uid,
	// 	blah: 'blah'
	// })

	var uid = firebase.auth().currentUser.uid
	var userRef = db.ref(`users/${uid}`)

	userRef.set({
		yo: 'yooo'
	});

	// var s = {}
	// s[session.key] = true
	// s['uid'] = firebase.auth().currentUser.uid
	// userSessionsRef.set(s)


	console.log('createSession2 done')
	// return { sessionKey: session.key, userKey: user.key }
}


const sessions = db.ref('sessions')


export default { createSession, createSession2, getCurrentUser, pushCoords, sessions, signIn }


