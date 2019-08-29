import * as T from "../actions/types";

const defaultState = {
	status: null,
	user_id: 7, 
};

export default (state = defaultState, action) => {
	switch (action.type) {
		// ~~~~~~~~~~ Login and Logout Cases ~~~~~~~~~~~~
		case T.BEGAN_LOGIN:
			return {
				...defaultState,
				status: action.type
			};
		case T.FINISHED_LOGIN:
			return {
				status: action.type,
				user_id: 7, 
			};
		case T.ERRORED_LOGIN:
			return {
				...state, 
			};
		case T.LOGOUT:
			return {
				status: T.LOGOUT,
				user_id: null, 
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

