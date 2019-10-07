import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { reactReduxFirebase } from "react-redux-firebase";
import firebase from "./firebase";
import thunk from "redux-thunk";
import reducers from "./reducers";

const config = {
	userProfile: 'users', // firebase root where user profiles are stored
	enableLogging: false, // enable/disable Firebase's database logging
	updateProfileOnLogin: false
  }

export default ({ children, initalState = {} }) => {
	const createStoreWithFirebase = compose(reactReduxFirebase(firebase, config))(
		createStore
	);
	const composeEnhancers =
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const store = createStoreWithFirebase(
		reducers,
		initalState,
		composeEnhancers(applyMiddleware(thunk))
	);

	return <Provider store={store}> {children} </Provider>;
};

