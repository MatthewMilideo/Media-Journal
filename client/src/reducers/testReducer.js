import * as T from "../actions/types";

const defaultState = {
	loggedIn: false, 
	status: null,
	data: {},
};

export default (state = defaultState, action) => {
	switch (action.type) {
        case T.BEGAN_LOGIN:
			return {
				...defaultState,
				status: action.type,
			};
        case T.FINISHED_LOGIN:
			return {
				...state,
				loggedIn: true, 
				status: action.type,
				data: action.payload,

			};
        case T.ERRORED_LOGIN:
			return {
				...state,
                status: action.type,
                data: action.payload,
			};
        default:
			return state;
	}
};

export function _getLoggedIn(store) {
	return store.loggedIn;
}

export function _getTestData(store) {
	return store;
}