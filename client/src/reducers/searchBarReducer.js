import * as T from "../actions/types";

const defaultState = {
	activeElem: T.MOVIE,
	searchText: '', 
};

export const SEARCH_BAR_TEXT = 'SEARCH_BAR_TEXT';
export const SEARCH_BAR_ACTIVE_CHANGE = 'SEARCH_BAR_ACTIVE_CHANGE';


export default (state = defaultState, action) => {
	switch (action.type) {
		// ~~~~~~~~~~ Login and Logout Cases ~~~~~~~~~~~~
		case T.SEARCH_BAR_ACTIVE_CHANGE:
			return {
                ...state,
                activeElem: action.payload
			};
		case T.SEARCH_BAR_TEXT:
			return {
                ...state,
				searchText: action.payload
			};
		default:
			return state;
	}
};

/* ~~~~~~~~~~ Getters ~~~~~~~~~~~ */

export function _getSearchState(store) {
	return store;
}



