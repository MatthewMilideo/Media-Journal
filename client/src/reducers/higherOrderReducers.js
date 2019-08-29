import * as T from "../actions/types";

const defaultSearchState = {
	status: null,
	prevQuery: null,
	prevElem: null, 
	totalElems: null,
	data: {},
	keysArr: []
};

export const searchHOR = type => (state = defaultSearchState, action) => {
	switch (action.type) {
		case `${type}${T._BEGAN_SEARCH}`:
			return {
				...state,
				status: action.type,
			};
		case `${type}${T._BEGAN_SEARCH_NEXT}`:
			return {
				...state,
				status: action.type
			};
		case `${type}${T._FINISHED_SEARCH}`:
			return {
				...state,
				status: action.type,
				data: action.payload.data,
				keysArr: action.payload.data.keysArr,
				prevQuery: action.payload.prevQuery,
				prevElem: action.payload.prevElem,
				totalElems: action.payload.totalElems,
				
			};
		case `${type}${T._FINISHED_SEARCH_NEXT}`:
			return {
				...state,
				status: action.type,
				data: {...state.data, ...action.payload.data},
				keysArr: [...state.keysArr, ...action.payload.data.keysArr],
				prevElem: action.payload.prevElem,
				prevQuery: state.prevQuery,
				totalElems: state.totalElems
			};
		case `${type}${T._ERRORED_SEARCH}`:
			return {
				status: action.type
			};
		case `${type}${T._ERRORED_SEARCH_NEXT}`:
			return {
				status: action.type,
				data: action.payload
			};
		case `${type}${T._BEGAN_POST_MEDIA_USER}` :
			return{
				...state
			}
		case `${type}${T._SUCCESS_POST_MEDIA_USER}`: {
			let newState = {...state}
			newState.data = {...newState.data}
			newState.data[action.payload.CID] = {...newState.data[action.payload.CID]}
			newState.data[action.payload.CID].viewed = true; 
			console.log(newState);
			return newState
		}
		case `${type}${T._ERRORED_POST_MEDIA_USER}`: 
		default:
			return state;
	}
};
