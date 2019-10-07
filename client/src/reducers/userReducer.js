import { firebaseReducer } from "react-redux-firebase";
import * as T from "../actions/types";

const defaultState = {
	status: null,
	user_id: 61
};

export default (state = defaultState, action) => {
	switch (action.type) {
		// ~~~~~~~~~~ Login and Logout Cases ~~~~~~~~~~~~
		case T.SIGNUP_SUCCESS:
			return {
				...state
			};
		case T.SIGNUP_ERROR:
			return {
				...state
			};
		case T.SIGNIN_SUCCESS:
			return {
				user_id: action.payload,
				...state
			};
		case T.SIGNIN_ERROR:
			return {
				...state
			};
		case T.SIGNOUT_SUCCESS:
			return {
				...state
			};
		case T.SIGNOUT_ERROR:
			return {
				...state
			};
		default:
			return state;
	}
};

/* ~~~~~~~~~~ Getters ~~~~~~~~~~~ */

export function _getUser(store) {
	return store;
}

// ~~~~~~~~~~ Getters ~~~~~~~~~~~

export function _getUserInfo(store) {
	return store.userInfo;
}

export function _getUserErr(store) {
	return store.errType;
}
