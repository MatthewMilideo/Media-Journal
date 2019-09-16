import * as T from "../actions/types";

const defaultState = {
	status: null,
	tags: []
};

export default (state = defaultState, action) => {
	switch (action.type) {
		// ~~~~~~~~~~ Login and Logout Cases ~~~~~~~~~~~~
		case T.BEGAN_SEARCH_TAGS:
			return {
				...defaultState,
				status: action.type
			};
		case T.FINISHED_SEARCH_TAGS:
			return {
				status: action.type,
				tags: action.payload.tags
			};
		case T.ERRORED_SEARCH_TAGS:
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
