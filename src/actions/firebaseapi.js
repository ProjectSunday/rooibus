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


const sessions = db.ref('sessions')


export default { createSession, getCurrentUser, pushCoords, sessions, signIn }


