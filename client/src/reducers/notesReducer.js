import * as T from "../actions/types";

const defaultState = {
	status: null,
	error: null,
	currNotes: [],
	allNotes: {}
};

const newNoteState = (state, note_id) => {
	let newState = { ...state };
	newState.allNotes = { ...newState.allNotes };
	newState.allNotes[note_id] = { ...newState.allNotes[note_id] };
	return newState;
};

const noteEditState = (state, action) => {
	const { note_id } = action.payload;
	let newState = newNoteState(state, note_id);
	newState.allNotes[note_id].editState = !newState.allNotes[note_id].editState;
	return newState;
};

const editNoteTitle = (state, action) => {
	const { title, note_id } = action.payload;
	let newState = newNoteState(state, note_id);
	newState.allNotes[note_id].newTitle = title;
	return newState;
};

const editNoteData = (state, action) => {
	const { data, note_id } = action.payload;
	let newState = newNoteState(state, note_id);
	newState.allNotes[note_id].newData = data;
	return newState;
};

const discardNoteChanges = (state, action) => {
	const { note_id } = action.payload;
	let newState = newNoteState(state, note_id);
	newState.allNotes[note_id].newTitle = newState.allNotes[note_id].title;
	newState.allNotes[note_id].newData = newState.allNotes[note_id].data;
	newState.allNotes[note_id].editState = false;
	return newState;
};

const saveNoteChanges = (state, action) => {
	const { note_id, newTitle, newData } = action.payload;
	let newState = newNoteState(state, note_id);
	newState.allNotes[note_id].title = newTitle;
	newState.allNotes[note_id].data = newData;
	newState.allNotes[note_id].newTitle = newTitle;
	newState.allNotes[note_id].newData = newData;
	return newState;
};

export default (state = defaultState, action) => {
	switch (action.type) {
		case T.EDIT_NOTE_TITLE:
			return editNoteTitle(state, action);
		case T.EDIT_NOTE_DATA:
			return editNoteData(state, action);
		case T.DISCARD_NOTE_CHANGES:
			return discardNoteChanges(state, action);
		case T.NOTE_EDIT_STATE:
			return noteEditState(state, action);
        case T.BEG_SAVE_NOTE:
            return{
                ...state,
                status: action.type,
                error: null,
            }
        case T.FIN_SAVE_NOTE:
            return saveNoteChanges(state, action);
        case T.ERR_SAVE_NOTE:
            return{
                ...state,
                status: action.type,
                error: action.payload,
            }
		/* Get All Notes */
		case T.BEG_GET_ALL_NOTES:
			return {
				...state,
				status: action.type,
				error: null,
				currNotes: []
			};
		case T.FIN_GET_ALL_NOTES:
			return {
				...state,
				status: action.type,
				error: null,
				currNotes: action.payload.currNotes,
				allNotes: action.payload.allNotes
			};
		case T.ERR_GET_ALL_NOTES:
			return {
				...state,
				status: action.type,
				error: action.payload,
				currNotes: []
			};
		/* Get All Notes for Given User */
		case T.BEG_GET_USER_NOTES:
			return {
				...state,
				status: action.type,
				error: null,
				currNotes: []
			};
		case T.FIN_GET_USER_NOTES:
			return {
				...state,
				status: action.type,
				error: null,
				currNotes: action.payload.currNotes,
				allNotes: action.payload.allNotes
			};
		case T.ERR_GET_USER_NOTES:
			return {
				...state,
				status: action.type,
				error: action.payload,
				currNotes: []
			};
		/* Get All Notes for a Given piece of Media */
		case T.BEG_GET_MEDIA_NOTES:
			return {
				...state,
				status: action.type,
				error: null,
				currNotes: []
			};
		case T.FIN_GET_MEDIA_NOTES:
			return {
				...state,
				status: action.type,
				error: null,
				currNotes: action.payload.currNotes,
				allNotes: action.payload.allNotes
			};
		case T.ERR_GET_MEDIA_NOTES:
			return {
				...state,
				status: action.type,
				error: action.payload,
				currNotes: []
			};
		/* Get All Notes for a Given piece of Media */
		case T.BEG_GET_MEDIAUSER_NOTES:
			return {
				...state,
				status: action.type,
				error: null,
				currNotes: []
			};
		case T.FIN_GET_MEDIAUSER_NOTES:
			return {
				...state,
				status: action.type,
				error: null,
				currNotes: action.payload.currNotes,
				allNotes: action.payload.allNotes
			};
		case T.ERR_GET_MEDIAUSER_NOTES:
			return {
				...state,
				status: action.type,
				error: action.payload,
				currNotes: []
			};
		default:
			return state;
	}
};

export function _getNotesState(store) {
	return store;
}
