import * as firebase from 'firebase'
import uuid from 'uuid'

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

var user, location
const init = (user) => {
	user = {
		publicKey: uuid.v4().replace(/\-/g,''),
		ref: firebase.database().ref(`users/${uid}`),
		uid: firebase.auth().currentUser.uid
	}
	location = {
		ref: firebase.database().ref('locations').push()
	}
}

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		console.info('user in', user.uid)
		init(user);

		// var isAnonymous = user.isAnonymous
	} else {
		console.info('user out, signing in...')
		firebase.auth().signInAnonymously()
	}
})

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

/**********************************************pushCoords**********
 * Init
 ********************************************************/

// var _user;
const getUser = async () => {
	// if (!_user) {
	// 	// console.log('creating user')
	// 	// await firebase.auth().signInAnonymously()
	// 	var uid = firebase.auth().currentUser.uid
	// 	_user = {
	// 		locationRef: firebase.database().ref('locations').push(),
	// 		publicKey: uuid.v4().replace(/\-/g,''),
	// 		ref: firebase.database().ref(`users/${uid}`),
	// 		uid: firebase.auth().currentUser.uid
	// 	}
	// }
	// console.log('_user', _user)
	// return _user
}

module.init = async () => {

	// dispatch({ 'SET_MAP_ID': })
	// var user = await getUser()
	// user.ref.update({ publicKey: user.publicKey })


	// user.locationRef.set({ uid: user.uid })

	console.log('init done')
}


//hmn coords working, need to share locations with users
/********************************************************
 * Location
 ********************************************************/

const pushCoords = async (coords) => {
	// var user = await getUser()
	// user.locationRef.child('coords').push(coords).then(() => {
	// 	// console.log('pushCoords done', coords)
	// }).catch(() => {
	// 	console.log('pushCoords error')
	// })
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

const createMap = async () => {
	var mapKey = uuid.v4().replace(/\-/g,'')

	// var user = await getUser()

	user.ref.child('maps').set({ [mapKey]: true })

	var mapRef = DB.ref(`maps/${mapKey}`).set({
		viewRequests: {
			[user.publicKey]: true
		}
	})

	console.log('createMap key: ', mapKey)

}

// const joinMap = async (mapKey) => {

	// dispatch()
	// await ensureAuthentication()
	// let userRef = await getUserRef()

	// var user = await getUser()
	// this.user.ref.child('maps').update({
	// 	[mapKey]: true
	// })

	// DB.ref(`maps/${mapKey}`).once('value', snapshot => {
	// 	console.log('maps snaopshot')
	// 	console.log(snapshot.val())
	// 	// var map = snapshot.val()

	// 	console.log('185', user.publicKey)
	// 	snapshot.ref.child('viewRequests').update({
	// 		[user.publicKey]: true
	// 	})

	// 	// if (map.viewRequests && map.viewRequests.length) {

	// 	// }
	// })


// }

/********************************************************
 * Export
 ********************************************************/
export default module
// export default { createMap, getCurrentUser, init, onCoordsChange, pushCoords, test, test2 }



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


