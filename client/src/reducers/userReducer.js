import * as T from "../actions/types";

const defaultState = {
	status: null,
	message: "",
	user_id: "Default"
};

export default (state = defaultState, action) => {
	switch (action.type) {
		// ~~~~~~~~~~ Login and Logout Cases ~~~~~~~~~~~~
		case T.HACKER_USER_ID:
		return {
			...state,
			status: T.SIGNIN_SUCCESS,
			user_id: action.payload,
		};
		case T.SIGNUP_SUCCESS:
			return {
				...state,
				status: action.status,
				user_id: action.payload.user_id,
				message: action.payload.message
			};
		case T.SIGNUP_ERROR:
			return {
				...state,
				status: action.type,
				message: action.payload.message
			};
		case T.SIGNIN_SUCCESS:
			return {
				...state,
				user_id: action.payload.user_id,
				message: action.payload.message
			};
		case T.SIGNIN_ERROR:
			return {
				...state, 
				status: action.type,
				user_id: defaultState.user_id,
				message: action.payload.message
			};
		case T.SIGNOUT_SUCCESS:
			return {
				...state,
				status: action.type,
				user_id: defaultState.user_id,
			};
		case T.SIGNOUT_ERROR:
			return {
				...state,
				status: action.type,
				user_id: defaultState.user_id,
				message: action.payload.message
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
