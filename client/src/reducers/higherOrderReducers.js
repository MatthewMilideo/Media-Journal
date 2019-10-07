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
		
			cleanKeysArr = cleanKeysArr.filter(elem => elem !== key);
			media = copyObj(media, key);

		}
	}
	newState.keysArr = [...newState.keysArr, ...cleanKeysArr];
	newState.media = { ...newState.media, ...media };
	newState.queryData = action.payload.queryData;

	return newState;
}

function finishedPostNote(state, action) {
	let { type, CID } = action.payload;
	let newState = { ...state };
	 newState[type] = {...newState[type]};
	 newState[type] = {...newState[type].media};
	 if (newState[type].media[CID]){
		 newState[type].media[CID] = {...newState[type].media[CID] }
		 newState[type].media[CID].viewed = true; 
		 newState[type].media[CID].noteCount = newState[type].media[CID].noteCount += 1 ; 

	 }
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
		case `${T._ERRORED_POST_MEDIA_USER}`:
			return {
				...state
			};
		case `${T._BEGAN_DELETE_MEDIA_USER}`:
			return {
				...state
			};
		case `${T._SUCCESS_DELETE_MEDIA_USER}`: {
			let newState = { ...state };
			newState.media = { ...newState.media };
			newState.media[action.payload.CID] = {
				...newState.media[action.payload.CID]
			};
			newState.media[action.payload.CID].viewed = false;
			return newState;
		}
		case `${T._ERRORED_DELETE_MEDIA_USER}`:
			return {
				...state
			};
		//case `${T.FINISHED_POST_NOTE2}` :
		//	return finishedPostNote(state, action);
		default:
			return state;
	}
};
