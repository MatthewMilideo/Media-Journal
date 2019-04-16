import {
	BEGAN_SEARCH,
	BEGAN_SEARCH_NEXT,
	FINISHED_SEARCH,
	FINISHED_SEARCH_NEXT,
	ERRORED_SEARCH
} from "../actions/types";

const defaultState = {
	status: null,
	type: null,
	query: null,
	data: [],
	curElem: null,
	totalElems: null
};
/*
export default (state = defaultState, action) => {
	switch (action.type) {
		case BEGAN_SEARCH:
			return {
				...defaultState,
				status: action.type,
				type: action.payload.type,
				query: action.payload.query
			};
			case BEGAN_SEARCH_NEXT:
			return {
				...state,
				status:action.type
			};
		case FINISHED_SEARCH:
			return {
				...state, 
				status: action.type,
				data: action.payload.data,
				curElem: action.payload.curElem,
				totalElems: action.payload.totalElems
			};
		case FINISHED_SEARCH_NEXT:
			return {
				...state,
				status: action.type,
				data: [...state.data,  ...action.payload.data],
				curElem: action.payload.curElem,
			};
		case ERRORED_SEARCH:
			return {
				status: action.type,
			};
		default:
			return state;
	}
};

export function _getSearchStatus(store) {
	return store.status;
}

export function _getSearchData(store) {
	return store.data;
}
*/