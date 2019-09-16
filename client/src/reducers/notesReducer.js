import * as T from "../actions/types";

const defaultState = {
	status: null,
	error: {
		status: null,
		data: null,
		error: null
	},
	notes: { keysArr: [] }
};

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

const addNote = state => {
	let newState = { ...state };
	newState.status = T.ADD_NOTE;
	newState.notes = { ...newState.notes };
	newState.notes.keysArr = [...newState.notes.keysArr];
	let newID = getRandomInt(10000);
	while (newState.notes.keysArr.includes(newID)) newID = getRandomInt(1000);
	newState.notes[newID] = {
		note_id: newID,
		title: "",
		data: "",
		tags: [],
		new: true
	};
	newState.notes.keysArr.push(newID);
	return newState;
};

const addNoteTag = (state, action) => {
	const { tag, note_id } = action.payload;
	let newState = { ...state };
	newState.notes = { ...newState.notes };
	newState.notes[note_id] = { ...newState.notes[note_id] };
	console.log(note_id, newState.notes[note_id]);
	console.log(newState.notes[note_id].tags);
	newState.notes[note_id].tags = [...newState.notes[note_id].tags, tag];
	return newState;
};

const removeNoteTag = (state, action) => {
	console.log("in remove note tag", action);
	const { tag, note_id } = action.payload;
	let newState = { ...state };
	newState.notes = { ...newState.notes };
	newState.notes[note_id] = { ...newState.notes[note_id] };
	newState.notes[note_id].tags = newState.notes[note_id].tags.filter(elem => {
		if (elem.id !== tag.id) return elem;
	});
	return newState;
};

const editNote = (state, payload) => {
	const { id, title, data } = payload;
	let newState = { ...state };
	newState.status = T.FINISHED_EDIT_NOTE;
	newState.notes = { ...newState.notes };
	newState.notes[id] = { ...newState.notes[id] };
	newState.notes[id].title = title;
	newState.notes[id].data = data;
	newState.notes[id].note = false;
	return newState;
};

const copyObj = function(obj, rmKey) {
	let returnObj = {};
	let keys = Object.keys(obj);
	keys.forEach(key => {
		if (parseInt(key) !== rmKey) returnObj[key] = obj[key];
	});
	return returnObj;
};

const copyArr = function(arr, rmElem) {
	let returnArr = [];
	arr.forEach(elem => {
		if (elem !== rmElem) returnArr.push(elem);
	});
	return returnArr;
};

const postNote = (state, action) => {
	const { noteObj, old_id } = action.payload;
	console.log(noteObj,old_id);
	let newState = { ...state };
	newState.status = action.type;
	newState.notes = copyObj(newState.notes, old_id);
	newState.notes[noteObj.note_id] = noteObj;
	newState.notes.keysArr = newState.notes.keysArr.map(elem => {
		if (elem === old_id) return noteObj.note_id;
		return elem;
	});
	return newState;
};

const deleteNote = (state, action) => {
	const { note_id } = action.payload;
	let newState = { ...state };
	newState.status = action.type;
	newState.notes = copyObj(newState.notes, note_id);
	newState.notes.keysArr = copyArr(newState.notes.keysArr, note_id);
	return newState;
};

export default (state = defaultState, action) => {
	switch (action.type) {
		case T.ADD_NOTE:
			return addNote(state);
		case T.ADD_NOTE_TAG:
			return addNoteTag(state, action);
		case T.REMOVE_NOTE_TAG:
			return removeNoteTag(state, action);

		case T.BEGAN_GET_NOTES:
			return {
				...state,
				status: action.type,
				notes: {}
			};

		case T.FINISHED_GET_NOTES:
			return {
				...state,
				status: action.type,
				notes: action.payload.notes,
				error: null
			};
		case T.ERRORED_GET_NOTES:
			return {
				...state,
				status: action.type,
				notes: { keysArr: [] },
				error: {
					status: action.payload.status,
					data: action.payload.data,
					error: action.payload.error
				}
			};

		case T.BEGAN_EDIT_NOTE:
			return {
				...state,
				status: action.type
			};
		case T.FINISHED_EDIT_NOTE:
			return editNote(state, action.payload);
		case T.ERRORED_EDIT_NOTE:
			return {
				...state,
				status: action.type,
				data: action.payload.data,
				error: action.payload.error
			};

		case T.BEG_POST_NOTE:
			return { ...state, status: action.type };
		case T.FINISHED_POST_NOTE:
			return postNote(state, action);
		case T.ERRORED_POST_NOTE:
			return {
				...state
			};

		case T.BEGAN_DELETE_NOTE:
			return { ...state, status: action.type };
		case T.FINISHED_DELETE_NOTE:
			return deleteNote(state, action);
		case T.ERRORED_DELETE_NOTE:
			return { ...state, status: action.type };
		default:
			return state;
	}
};

export function _getNotesState(store) {
	return store;
}

export function _getNote(store, key) {
	if (!store.notes) return null;
	if (!store.notes[key]) return null;
	return store.notes[key];
}

export function _getNotesKeysArr(store) {
	return store === null ? store : store.keysArr;
}
