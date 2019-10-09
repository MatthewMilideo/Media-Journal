// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
// We only want to use Firebase Auth here
import "firebase/auth";

// Your app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDhvCMxOcDMqjvMr8aUs7RqAYnIY7SS81E",
	authDomain: "media-journal.firebaseapp.com",
	databaseURL: "https://media-journal.firebaseio.com",
	projectId: "media-journal",
	storageBucket: "",
	messagingSenderId: "628641291135",
	appId: "1:628641291135:web:473bc3740144d8bd5e584a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase
	.auth()
	.setPersistence(firebase.auth.Auth.Persistence.NONE)
	.then(function() {
		// Existing and future Auth states are now persisted in the current
		// session only. Closing the window would clear any existing state even
		// if a user forgets to sign out.
		// ...
		// New sign-in will be persisted with session persistence.
		return;
	})
	.catch(function(error) {
	});

// Finally, export it to use it throughout your app
export default firebase;
