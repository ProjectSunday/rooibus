import * as firebase from 'firebase'
import uuid from 'uuid'

import { startLocationTracking } from './actions'
import { dispatch, store } from '../store/store'

const module = {}

var coordKey, coordsRef, LOCATION_REF, SESSION_REF, USER_REF, MAP_REF;

// var PUBLIC_KEY, uid

const config = {
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

var USER, LOCATION, MAP

const init = (user) => {

	var uid = firebase.auth().currentUser.uid
	var publicKey = uuid.v4().replace(/\-/g,'')
	USER = {
		publicKey,
		ref: DB.ref(`users/${uid}`),
		uid
	}

	USER.ref.update({ publicKey })
	

	LOCATION = {
		ref: DB.ref('locations').push()
	}

	DB.ref(`locations/${USER.uid}/shares`).set({
		[USER.uid]: true
	})

	// DB.ref(`locations`).on('value', (snapshot) => {
	// 	console.log('location child changed', snapshot.val())
	// })
	
	// LOCATION.ref.update({ publicKey, uid })

	checkSharedMap()

	startLocationTracking()

}

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		console.info('user in', user.uid)
		init(user)

		// var isAnonymous = USER.isAnonymous
	} else {
		console.info('USER out, signing in...')
		firebase.auth().signInAnonymously()
	}
})

/********************************************************
 * Testing
 ********************************************************/


const test = (data) => {
	DB.ref('test').set({
		uid: firebase.auth().currentUSER.uid,
		yotest: 'hello user:' + firebase.auth().currentUSER.uid
	})
	console.log('test')
}

module.test2 = () => {

	console.log('test2222')

	DB.ref(`testing/yo`).once('value', (snapshot) => {
		console.log('test2', snapshot.val())
	})

	DB.ref('testing/yo').set({
		blah: 'blah'
	})
}

/********************************************************
 * Init
 ********************************************************/


/********************************************************
 * location
 ********************************************************/

module.pushCoords = async (coords) => {
	// var USER = await getUSER()

	DB.ref(`locations/${USER.uid}/coords`).push(coords).then(() => {
		console.log('pushCoords done', coords)
	}).catch((error) => {``
		console.log('pushCoords error', error)
	})
}

const watchCoordsChange = () => {


}

/********************************************************
 * Map
 ********************************************************/

module.createMap = async () => {
	var mapId = uuid.v4().replace(/\-/g,'')

	DB.ref(`users/${USER.uid}/maps`).set({ [mapId]: true })

	await DB.ref(`maps/${mapId}/users`).set({
		[USER.uid]: {
			[USER.uid]: true
		}
	})

	// listenToNewMapShare(mapId)

	listenToViewRequests(mapId)

	console.log('createMap id: ', mapId)

	return mapId

}

const checkSharedMap = () => {
	var state = store.getState()
	if (state.map && state.map.id) {
		module.joinMap(state.map.id)
	}
}


module.joinMap = async (id) => {
	
	await USER.ref.child('maps').update({
		[id]: true
	})

	var map = await DB.ref(`maps/${id}`).once('value')
	var users = map.val().users
	// await USER.ref.child('locations').update(locations)

	for (var uid in users) {
		await DB.ref(`maps/${id}/users/${uid}`).update({
			[USER.uid]: 'requesting'
		})

		DB.ref(`maps/${id}/users/${uid}/${USER.uid}`).on('value', yo => {
			if (yo.val() === true) {
				listenToUserLocation(uid)
			}
		})

		// console.log('joinmap uid:', uid)
		// listenToUserLocation(uid)

	}

}

module.shareToAll = () => {
	var id = store.getState().map.id
	if (!id) {
		console.error('no map id found')
		return
	}

	listenToViewRequests(id)
}

const listenToNewMapShare = (id) => {
	var ref = DB.ref(`maps/${id}/users`)
	ref.on('value', async (snapshot) => {

		var users = snapshot.val()
		for (var uid in users) {
			await DB.ref(`maps/${id}/users/${uid}`).update({
				[USER.uid]: true
			})
			listenToUserLocation(uid)
			
		}

	})

	
}

//hmn coords are transferring over. needs to display coords, are they transferring?/??

//hmn setting up virtual machine, testing is fucked

const listenToViewRequests = (id) => {
	var ref = DB.ref(`maps/${id}/users/${USER.uid}`)
	ref.set({
		[USER.uid]: true
	})
	ref.on('value', (users) => {
		for (var uid in users.val()) {
			DB.ref(`locations/${USER.uid}/shares`).update({
				[uid]: true
			})
			DB.ref(`maps/${id}/users/${USER.uid}`).update({
				[uid]: true
			})
		}
	})
}

const listenToUserLocation = (uid) => {
	console.log('listenToUserLocation uid:', uid)
	var ref = DB.ref(`locations/${uid}/coords`)


	// ref.once('value', snapshot => {
	// 	console.log('listenToUserLocation', snapshot.val())
	// }, error => {
	// 	console.log('230 error:', error)
	// })

	// ref.off()


	ref.on('child_added', snapshot => {
		console.log('new location uid', uid, snapshot.val())
		dispatch({
			type: 'MAP_ADD_USER_COORDS',
			uid,
			coords: snapshot.val()
		})
	}, error => {
		console.log('listenToUserLocation error:', error)
	})
}

/********************************************************
 * Export
 ********************************************************/
export default module



/*
simplified workflow
1. USER a creates map session
2. USER a share map
3. USER b joins map
4. USER b share LOCATION
*/

/*
new workflow for joining a "minimap"

USER a creates minimap
-------------------------------

USER a creates map, writes:
	USERId{
		mapKey: 'mapkey1'
		publicKey: 'publickeya'
	}
	mapId: {
		key: 'mapkey1'
		viewRequests: {
			'publickeya': true
		}
	}

USER a sends mapkey to USER b, writes:
	USERB: {
		map: { 'mapkey1': true }
	}

USER b request view, writes:
	mapId: {
		key: 'mapkey1',
		viewRequests: {
			'publickeya': true,
			'publickeyb': true
		}
	}

USER a sees new key, writes:
	LOCATIONA: {
		shares: {
			'publickeyb': true
		}
	}

USER b sees LOCATIONA

USER b join minimap
--------------------------------

USER b writes:
	LOCATIONB: {
		shares: {
			'publickeyb': true
		}
	}






	

/*




USER a shares with USER b
-------------------------------

USER a creates session, writes:
	USERId: {
		sessionKey: 'session-key-1',
		publicKey: 'public-key-a'
	}
	sessionId: {
		key: 'session-key-1',
		publicKey: 'public-key-a',
		acknowledgements: {}
	}

USER a send link to USER b

USER b writes:
	USERId: {
		sessionKey: 'session-key-1'
	}

USER b creates publicKey (should already be created), writes:
	USERId: {
		publicKey: 'public-key-b'
	}
	sessionId: {
		key: 'session-key-1',
		acknowledgements: {
			'public-key-b': true
		}
	}

USER a takes 'public-key-b', writes:
	LOCATIONId: {
		//.read: "auth != null && data.child('shares' + root.child('USERs/ + auth.uid + '/publicKey').val()).val() == true"
		//.write: 'auth != null && data.child('uid').val() == auth.uid"
		shares: {
			'public-key-b': true
		}
	}


USER b shares with USER a
------------------------------
USER b takes USER a public key, writes:
	LOCATIONId: {
		shares: {
			'public-key-a': true
		}
	}



*/


