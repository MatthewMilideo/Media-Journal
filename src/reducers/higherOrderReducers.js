import * as T from "../actions/types";

const defaultSearchState = {
	status: null,
	type: null,
	query: null,
	data: [],
	curElem: null,
	totalElems: null
};

export const empty = (state = defaultSearchState, action) => state;

export const searchHOR = (type, reducer) => (state, action) => {
	switch (action.type) {
		case `${type}${T._BEGAN_SEARCH}`:
			return {
				...defaultSearchState,
				status: action.type,
				type: action.payload.type,
				query: action.payload.query
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
				curElem: action.payload.curElem,
				totalElems: action.payload.totalElems
			};
		case `${type}${T._FINISHED_SEARCH_NEXT}`:
			return {
				...state,
				status: action.type,
				data: [...state.data, ...action.payload.data],
				curElem: action.payload.curElem
			};
		case `${type}${T._ERRORED_SEARCH}`:
			return {
				status: action.type
			};
		default:
			return reducer(state, action);
	}
};

const defaultJournalState = {
	allData: [],
	data: [],
	Status: null
};

export const journalHOR = (type, reducer) => (state, action) => {
	//console.log(state, action);
	let index;
	let localCurNotes;
	let localAllNotes;
	if (state) {
		localCurNotes = state.data;
		localAllNotes = state.allData;
	}

	switch (action.type) {
		case T.NOTE_STATUS:
			index = localCurNotes.findIndex(elem => elem.id === action.payload.id);
			if (index !== -1) localCurNotes[index].status = action.payload.status;
			return {
				...state,
				data: []
			};
		case `${type}${T._BEGAN_PUT}`:
			return {
				...state,
				status: action.type
			};
		case `${type}${T._FINISHED_PUT}`:
			console.log(action.payload.data);
			return {
				...state,
				status: action.type,
				data: [...state.data, action.payload.data]
			};
		case `${type}${T._ERRORED_PUT}`:
			return {
				...state,
				status: action.type
			};

		case `${type}${T._BEGAN_GET}${T._ALL}`:
			return {
				...state,
				status: action.type,
				data: []
			};
		case `${type}${T._FINISHED_GET}${T._ALL}`:
			console.log(action.payload.data);
			return {
				...state,
				status: action.type,
				data: action.payload.data
			};
		case `${type}${T._ERRORED_GET}${T._ALL}`:
			return {
				...state,
				status: action.type,
				data: []
			};

		case `${type}${T._BEGAN_GET}`:
			return {
				...state,
				status: action.type,
				data: []
			};
		case `${type}${T._FINISHED_GET}`:
			console.log(action.payload.data);
			return {
				...state,
				status: action.type,
				data: action.payload.data
			};
		case `${type}${T._ERRORED_GET}`:
			return {
				...state,
				status: action.type,
				data: []
			};
		case `${type}${T._BEGAN_POST}`:
			return {
				...state,
				status: action.type
			};
		case `${type}${T._FINISHED_POST}`:
			localCurNotes.push(action.payload);
			return {
				...state,
				status: action.type,
				data: localCurNotes
			};
		case `${type}${T._ERRORED_POST}`:
			return {
				...state,
				status: action.type
			};
		case `${type}${T._BEGAN_PATCH}`:
			return {
				...state,
				status: action.type
			};
		case `${type}${T._FINISHED_PATCH}`:
			index = localCurNotes.findIndex(elem => elem.id === action.payload.id);
			if (index !== -1) localCurNotes[index] = action.payload.data;
			return {
				...state,
				status: action.type,
				data: localCurNotes
			};
		case `${type}${T._ERRORED_PATCH}`:
			return {
				...state,
				status: action.type
			};
		case `${type}${T._BEGAN_DELETE}`:
			return {
				...state,
				status: action.type
			};
		case `${type}${T._FINISHED_DELETE}`:
			localCurNotes = localCurNotes.filter(elem => {
				return elem.id !== action.payload.id;
			});
			console.log(localCurNotes);
			return {
				...state,
				status: action.type,
				data: localCurNotes
			};
		case `${type}${T._ERRORED_DELETE}`:
			return {
				...state,
				status: action.type
			};
		default:
			return reducer(state, action);
	}
};
