import * as T from "../actions/types";

const defaultState = {
	status: null,
    media: {},
    keysArr: []
};

export default (state = defaultState, action) => {
	switch (action.type) {
		// ~~~~~~~~~~ Login and Logout Cases ~~~~~~~~~~~~
		case T.BEGAN_GET_MEDIA:
			return {
				...state,
				status: action.type
			};
		case T.FINISHED_GET_MEDIA:
			return {
				status: action.type,
				media: action.payload.media,
				keysArr: action.payload.keysArr
			};
		case T.ERRORED_GET_MEDIA:
			return {
				...state
			};
		default:
			return state;
	}
};

/* ~~~~~~~~~~ Getters ~~~~~~~~~~~ */

export function _getSearchTags(store) {
	return store;
}
