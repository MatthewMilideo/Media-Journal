import * as T from "../actions/types";

const defaultState = {
	notes: [],
	noteStatus: null,
	tags: [],
	tagStatus: null
};

export default (state = defaultState, action) => {
	let localNotes = state.notes; 
	let index; 

	switch (action.type) {
		case `${T.NOTE}${T._BEGAN_GET}`:
			return {
				...state,
				noteStatus: action.type,
				notes: []
			};
		case `${T.NOTE}${T._FINISHED_GET}`:
			//console.log( (action.payload.data);
			return {
				...state,
				noteStatus: action.type,
				notes: action.payload.data
			};
		case `${T.NOTE}${T._ERRORED_GET}`:
			return {
				...state,
				noteStatus: action.type,
				notes: []
			};
		case `${T.NOTE}${T._BEGAN_POST}`:
			return {
				...state,
				noteStatus: action.type
			};
		case `${T.NOTE}${T._FINISHED_POST}`:
			localNotes.push(action.payload);
			return {
				...state,
				noteStatus: action.type,
				notes: localNotes
			};
		case `${T.NOTE}${T._ERRORED_POST}`:
			return {
				...state,
				noteStatus: action.type
			};
		case `${T.NOTE}${T._BEGAN_PATCH}`:
			return {
				...state,
				noteStatus: action.type
			};
		case `${T.NOTE}${T._FINISHED_PATCH}`:
			let index = localNotes.findIndex(elem => elem.id === action.payload.id);
			if (index !== -1) localNotes[index] = action.payload.data;
			return {
				...state,
				noteStatus: action.type,
				notes: localNotes
			};
		case `${T.NOTE}${T._ERRORED_PATCH}`:
			return {
				...state,
				noteStatus: action.type
			};
		case `${T.NOTE}${T._BEGAN_DELETE}`:
			return {
				...state,
				noteStatus: action.type
			};
		case `${T.NOTE}${T._FINISHED_DELETE}`:
			localNotes = localNotes.filter(elem => { return elem.id !== action.payload.id});
			//console.log((localNotes);
			return {
				...state,
				noteStatus: action.type,
				notes: localNotes
			};
		case `${T.NOTE}${T._ERRORED_DELETE}`:
			return {
				...state,
				noteStatus: action.type
			};
		default:
			return state;
	}
};

export const _getTags = store => {
	return store.tags;
};

export const _getCurNotes = store => {
	return store.currNotes;
};

export const _getEntries = store => {
	return store.entries;
};

export const _getCurItem = store => {
	return store.curItem;
};
