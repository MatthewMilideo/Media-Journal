import * as T from "./types";
import firebase from "../firebase";
import { server } from "./index";
import axios from "axios";
// Signing up with Firebase
export const signUp = (email, password) => async dispatch => {
	try {
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(dataBeforeEmail => {
				console.log("b4", dataBeforeEmail);
				firebase.auth().onAuthStateChanged(function(user) {
					user.sendEmailVerification();
				});
			})
			.then(dataAfterEmail => {
				console.log("after", dataAfterEmail);
				firebase.auth().onAuthStateChanged(function(user) {
					user
						.getIdToken()
						.then(idToken => {
							console.log(idToken);
							axios.defaults.headers.common["Authorization"] = idToken;
							// Any extra code
						})
						.catch();
					console.log(user);
					if (user.emailVerified) {
						// Email is verified
						dispatch({
							type: T.SIGNUP_SUCCESS,
							payload:
								"Your account was successfully created! Now you need to verify your e-mail address, please go check your inbox."
						});
					} else {
						// Email is not verified
						console.log("error 1");
						dispatch({
							type: T.SIGNUP_ERROR,
							payload:
								"Something went wrong, we couldn't create your account. Please try again."
						});
					}
				});
			})
			.catch(function(error) {
				console.log("error 2", error);
				dispatch({
					type: T.SIGNUP_ERROR,
					payload:
						"Something went wrong, we couldn't create your account. Please try again."
				});
			});
	} catch (err) {
		dispatch({
			type: T.SIGNUP_ERROR,
			payload:
				"Something went wrong, we couldn't create your account. Please try again."
		});
	}
};

// Signing in with Firebase
export const signIn = (email, password, callback) => async dispatch => {
	try {
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(data => {
				firebase
					.auth()
					.currentUser.getIdToken()
					.then(idToken => {
						console.log(idToken);
						server.interceptors.request.use(function(config) {
							config.headers.Authorization = idToken;
							console.log("idToken", idToken);
							return config;
						});
						// Any extra code
					})
					.catch();

				console.log(data);
				dispatch({ type: T.SIGNIN_SUCCESS,
						payload: data.user.uid });
				//	callback();
			})
			.catch(err => {
				console.log("error", err);
				dispatch({
					type: T.SIGNIN_ERROR,
					payload: "Invalid login credentials"
				});
			});
	} catch (err) {
		console.log("error", err);
		dispatch({ type: T.SIGNIN_ERROR, payload: "Invalid login credentials" });
	}
};

// Signing out with Firebase
export const signOut = () => async dispatch => {
	try {
		firebase
			.auth()
			.signOut()
			.then(() => {
				dispatch({ type: T.SIGNOUT_SUCCESS });
			})
			.catch(() => {
				dispatch({
					type: T.SIGNOUT_ERROR,
					payload: "...some error message for the user..."
				});
			});
	} catch (err) {
		dispatch({
			type: T.SIGNOUT_ERROR,
			payload: "...some error message for the user..."
		});
	}
};
