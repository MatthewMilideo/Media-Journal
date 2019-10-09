import * as T from "./types";
import firebase from "../firebase";
import { server } from "./index";
import { postUser } from "./index";

// Signing up with Firebase
export const signUp = (email, password) => async dispatch => {
	try {
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(dataBeforeEmail => {
				// If User Created
				firebase.auth().onAuthStateChanged(function(user) {
					console.log("on auth state cahnged ran");
					user.sendEmailVerification();
					// Put user_id in my database for purpose of managing notes.
					dispatch(postUser(dataBeforeEmail.user.uid));
					// Get Token for purpose of verifying requests.
					user
						.getIdToken()
						.then(idToken => {
							console.log(idToken);
							server.interceptors.request.use(function(config) {
								config.headers["Authorization"] = idToken;
								return config;
							});

							dispatch({
								type: T.SIGNUP_SUCCESS,
								payload: {
									message:
										"Your account was successfully created! Now you need to verify your e-mail address, please go check your inbox.",
									user_id: dataBeforeEmail.user.uid
								}
							});
						})
						.catch(err => {
							dispatch({
								type: T.SIGNUP_ERROR_AXIOS,
								payload: {
									message: "Something went wrong, getting the ID token."
								}
							});
						});
				});
			})

			.catch(err => {
				dispatch({
					type: T.SIGNUP_ERROR,
					payload: {
						message:
							"Something went wrong, we couldn't create your account. Please try again."
					}
				});
			});
	} catch (err) {
		dispatch({
			type: T.SIGNUP_ERROR,
			payload: {
				message:
					"Something went wrong, we couldn't create your account. Please try again."
			}
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
						server.interceptors.request.use(function(config) {
							config.headers.Authorization = idToken;
							return config;
						});
					})
					.catch();

				console.log(" before dispatch", data.user.uid);
				dispatch({
					type: T.SIGNIN_SUCCESS,
					payload: { user_id: data.user.uid }
				});
				//	callback();
			})
			.catch(err => {
				console.log("error", err);
				dispatch({
					type: T.SIGNIN_ERROR,
					payload: {
						message: "Invalid login credentials"
					}
				});
			});
	} catch (err) {
		console.log("error", err);
		dispatch({
			type: T.SIGNIN_ERROR,
			payload: { message: "Invalid login credentials" }
		});
	}
};

// Signing out with Firebase
export const signOut = () => async dispatch => {
	try {
		firebase
			.auth()
			.signOut()
			.then(() => {
				server.interceptors.request.use(function(config) {
					config.headers.Authorization = null;
					return config; 
				});
				dispatch({ type: T.SIGNOUT_SUCCESS });
			})
			.catch(error => {
				console.log(error);
				dispatch({
					type: T.SIGNOUT_ERROR,
					payload: { message: "...some error message for the user..." }
				});
			});
	} catch (err) {
		console.log(err);
		dispatch({
			type: T.SIGNOUT_ERROR,
			payload: { message: "...some error message for the user..." }
		});
	}
};
