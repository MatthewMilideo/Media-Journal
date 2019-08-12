import * as T from "../actions/types";

const defaultState = {
	status: null,
	errType: null,
	registration: {
		status: null,
		email: null,
		userName: null
	},
	userInfo: {
		loggedIn: false,
		userID: null,
		userName: "",
		userEmail: ""
	},
	userData: {}
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
				...state,
				status: action.type,
				userInfo: {
					...state.userInfo,
					loggedIn: true,
					userID: action.payload.user_id,
					userName: action.payload.user_name,
					userEmail: action.payload.user_email
				}
			};
		case T.ERRORED_LOGIN:
			return {
				...state,
				status: action.type,
				errType: action.payload
			};
		case T.LOGOUT:
			return {
				...defaultState,
				status: T.LOGOUT
			};
		// ~~~~~~~~~~~ Registration Cases ~~~~~~~~~~~~~~~~
		case T.BEGAN_REGISTER:
			return {
				...state,
				registration: {
					...state.registration,
					status: action.type
				}
			};
		case T.FINISHED_REGISTER:
			return {
				...state,
				registration: {
					...state.registration,
					status: action.type
				}
			};
		case T.ERRORED_REGISTER:
			return {
				...state,
				registration: {
					...state.registration,
					status: action.type,
					error: action.payload
				}
			};
		// ~~~~~~~~~~~~~ Reg Validation ~~~~~~~~~~~~~~
		case T.REG_UNDEFINED:
			return {
				...state,
				registration: action.type
			};
	
		case T.VALID_USER:
			return {
				...state,
				registration: {
					...state.registration,
					userName: action.type
				}
			};
		case T.INVALID_USER:
			return {
				...state,
				registration: {
					...state.registration,
					userName: action.type
				}
			};

		case T.VALID_EMAIL:
			return {
				...state,
				registration: {
					...state.registration,
					email: action.type
				}
			};
		case T.INVALID_EMAIL:
			return {
				...state,
				registration: {
					...state.registration,
					email: action.type
				}
			};
		default:
			return state;
	}
};

// ~~~~~~~~~~ Getters ~~~~~~~~~~~

export function _getUserInfo(store) {
	return store.userInfo;
}

export function _getUserErr(store) {
	return store.errType;
}

export function _getUser(store) {
	return store;
}
