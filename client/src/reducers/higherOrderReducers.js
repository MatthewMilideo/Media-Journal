import * as T from "../actions/types";

const defaultSearchState = {
	status: null,
	media: {},
	keysArr: [],
	queryData: {}
};

function finishedSearch(state, action) {
	let newState = { ...state };
	newState.status = action.type;
	newState.media = action.payload.media;
	newState.keysArr = action.payload.keysArr;
	newState.queryData = action.payload.queryData;
	return newState;
}

const copyObj = function(obj, rmKey) {
	let returnObj = {};
	let keys = Object.keys(obj);
	keys.forEach(key => {
		if (parseInt(key) !== rmKey) returnObj[key] = obj[key];
	});
	return returnObj;
};

function finishedNextSearch(state, action) {
	let { keysArr, media } = action.payload;
	let cleanKeysArr = keysArr;
	let newState = { ...state };

	newState.status = action.type;
	for (let i = 0; i < keysArr.length; i++) {
		let key = keysArr[i];
		if (newState.media[key]) {
			console.log("removing key", key, "at", i);
			cleanKeysArr = cleanKeysArr.filter(elem => elem !== key);
			media = copyObj(media, key);
			console.log(cleanKeysArr);
		}
	}
	newState.keysArr = [...newState.keysArr, ...cleanKeysArr];
	newState.media = { ...newState.media, ...media };
	newState.queryData = action.payload.queryData;
	//console.log(newState.queryData);
	return newState;
}

export const searchHOR = type => (state = defaultSearchState, action) => {
	switch (action.type) {
		case `${type}${T._BEGAN_SEARCH}`:
			return {
				...state,
				status: action.type
			};
		case `${type}${T._BEGAN_SEARCH_NEXT}`:
			return {
				...state,
				status: action.type
			};
		case `${type}${T._FINISHED_SEARCH}`:
			return finishedSearch(state, action);
		case `${type}${T._FINISHED_SEARCH_NEXT}`:
			return finishedNextSearch(state, action);
		case `${type}${T._ERRORED_SEARCH}`:
			return {
				...state,
				status: action.type,
				data: action.payload
			};
		case `${type}${T._ERRORED_SEARCH_NEXT}`:
			return {
				...state,
				status: action.type,
				data: action.payload
			};
		case `${type}${T._BEGAN_POST_MEDIA_USER}`:
			return {
				...state
			};
		case `${type}${T._SUCCESS_POST_MEDIA_USER}`: {
			let newState = { ...state };
			newState.media = { ...newState.media };
			newState.media[action.payload.CID] = {
				...newState.media[action.payload.CID]
			};
			newState.media[action.payload.CID].viewed = true;
			return newState;
		}
		case `${type}${T._ERRORED_POST_MEDIA_USER}`:
		default:
			return state;
	}
};
