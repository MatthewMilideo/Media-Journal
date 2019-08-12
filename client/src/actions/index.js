import * as T from "../actions/types";
import {
	TMDBItemQuery,
	bookItemQuery,
	gameItemQuery
} from "./itemQueryHelpers";

import myData from "../api/myData";

/* ~~~~~~ Sync Note Actions ~~~~~~~ */

export const noteEditState = note_id => {
	return {
		type: T.NOTE_EDIT_STATE,
		payload: { note_id }
	};
};

export const editNoteTitle = (note_id, title) => {
	return {
		type: T.EDIT_NOTE_TITLE,
		payload: { note_id, title }
	};
};

export const editNoteData = (note_id, data) => {
	return {
		type: T.EDIT_NOTE_DATA,
		payload: { note_id, data }
	};
};

export const discardNoteChanges = note_id => {
	return {
		type: T.DISCARD_NOTE_CHANGES,
		payload: { note_id }
	};
};

/* ~~~~~~ Async Notes Actions ~~~~~~~ */

const noteUpdate = (oldNotes, newNotes) => {
	for (let i = 0; i < newNotes.length; i++) {
		let id = newNotes[i].id;
		if (!oldNotes[id]) {
			console.log("in if");
			newNotes[i] = {
				...newNotes[i],
				newTitle: newNotes[i].title,
				newData: newNotes[i].data,
				editState: false
			};
			oldNotes[id] = newNotes[i];
		}
	}
	return oldNotes;
};

export const getAllNotes = () => async (dispatch, getState) => {
	let response;
	try {
		dispatch({ type: T.BEG_GET_ALL_NOTES });
		response = await myData.get(`/notes`);
	} catch (err) {
		console.log(err);
		dispatch({ type: T.ERR_GET_ALL_NOTES, payload: err });
		return;
	}

	let allNotes = getState().notes.allNotes;
	console.log("allNOtes", allNotes);
	let resNotes = response.data;
	allNotes = noteUpdate(allNotes, resNotes);
	let currNotes = resNotes.map(note => (note = note.id));

	dispatch({ type: T.FIN_GET_ALL_NOTES, payload: { allNotes, currNotes } });
};

export const getUserNotes = user_id => async (dispatch, getState) => {
	let response;
	try {
		dispatch({ type: T.BEG_GET_USER_NOTES });
		response = await myData.get(`/notes/user`, { params: { user_id } });
	} catch (err) {
		console.log(err);
		dispatch({ type: T.ERR_GET_USER_NOTES, data: err });
		return;
	}
	let allNotes = getState().notes.allNotes;
	let resNotes = response.data;
	allNotes = noteUpdate(allNotes, resNotes);
	let currNotes = resNotes.map(note => (note = note.id));

	dispatch({ type: T.FIN_GET_USER_NOTES, payload: { allNotes, currNotes } });
};

export const getMediaNotes = media_id => async dispatch => {
	let response;
	try {
		dispatch({ type: T.BEG_GET_MEDIA_NOTES });
		response = await myData.get(`/notes/media`, { params: { media_id } });
	} catch (err) {
		console.log(err);
		dispatch({ type: T.ERR_GET_MEDIA_NOTES, data: err });
		return;
	}
	console.log(response);
	dispatch({ type: T.FIN_GET_MEDIA_NOTES, data: response.data });
};

export const getMediaUserNotes = (media_id, user_id) => async dispatch => {
	let response;
	try {
		dispatch({ type: T.BEG_GET_MEDIAUSER_NOTES });
		response = await myData.get(`/notes/mediauser`, {
			params: { media_id, user_id }
		});
	} catch (err) {
		console.log(err);
		dispatch({ type: T.ERR_GET_MEDIAUSER_NOTES, data: err });
		return;
	}
	console.log(response);
	dispatch({ type: T.FIN_GET_MEDIAUSER_NOTES, data: response.data });
};

export const postNote = (
	note_title,
	note_data,
	media_id,
	user_id
) => async dispatch => {
	let response;
	try {
		dispatch({ type: T.BEG_POST_NOTE });
		response = await myData.post(`/notes/`, {
			note_title,
			note_data,
			media_id,
			user_id
		});
	} catch (err) {
		console.log(err);
		dispatch({ type: T.ERR_POST_NOTE, data: err });
		return;
	}
	console.log(response);
	dispatch({ type: T.FIN_POST_NOTE, data: response.data });
};

export const saveNote = (
	note_id, 
	note_title,
	note_data,
) => async dispatch => {
	let response;
	try {
		dispatch({ type: T.BEG_SAVE_NOTE });
		response = await myData.put(`/notes/`, {
			note_id,
			note_title,
			note_data,
		});
	} catch (err) {
		console.log(err);
		dispatch({ type: T.ERR_SAVE_NOTE, data: err });
		return;
	}
	console.log(response);
	dispatch({ type: T.FIN_SAVE_NOTE, data: response.data });
};

/* ~~~~~~ Other Actions ~~~~~~~ */

export const getMedia = params => async dispatch => {
	console.log("in checkusername");

	let response;
	try {
		response = await myData.get(`users/name`);
	} catch (err) {
		dispatch({ type: T.REG_UNDEFINED, data: err.response });
		return;
	}
	response.status === 204
		? dispatch({ type: T.VALID_USER })
		: dispatch({ type: T.INVALID_USER });
};

export const checkUsername = params => async dispatch => {
	console.log("in checkusername");

	let response;
	try {
		response = await myData.post(`users/name`, params);
	} catch (err) {
		dispatch({ type: T.REG_UNDEFINED, data: err.response });
		return;
	}
	response.status === 204
		? dispatch({ type: T.VALID_USER })
		: dispatch({ type: T.INVALID_USER });
};

export const checkEmail = params => async dispatch => {
	let response;
	try {
		response = await myData.post(`users/email`, params);
	} catch (err) {
		dispatch({ type: T.REG_UNDEFINED, data: err.response });
		return;
	}
	response.status === 204
		? dispatch({ type: T.VALID_EMAIL })
		: dispatch({ type: T.INVALID_EMAIL });
};

export const loginUser = params => async dispatch => {
	let response;
	dispatch({
		type: T.BEGAN_LOGIN
	});
	try {
		response = await myData.post(`users/login`, params);
		console.log("response", response);
	} catch (err) {
		dispatch({
			type: T.ERRORED_LOGIN,
			payload: err.response.data
		});
		return;
	}
	if (response.status === 203) {
		dispatch({
			type: T.ERRORED_LOGIN,
			payload: response.data
		});
		return;
	}
	dispatch({
		type: T.FINISHED_LOGIN,
		payload: response.data
	});
};

export const registerUser = params => async dispatch => {
	let response;
	dispatch({ type: T.BEGAN_REGISTER });
	try {
		response = await myData.post(`users/register`, params);
	} catch (err) {
		dispatch({
			type: T.ERRORED_REGISTER,
			payload: err.response.data
		});
		return;
	}
	dispatch({
		type: T.FINISHED_REGISTER,
		payload: response.data
	});
};

export const logoutUser = () => {
	console.log("hello");
	return {
		type: T.LOGOUT
	};
};

const itemObj = {};
itemObj[T.MOVIE] = TMDBItemQuery;
itemObj[T.TV_SEASON] = TMDBItemQuery;
itemObj[T.BOOK] = bookItemQuery;
itemObj[T.GAME] = gameItemQuery;

// Fetches data for an individual item query
export const fetchItem = (type, id) => dispatch => {
	const itemFunc = itemObj[type];

	dispatch(itemFunc(type, id));
};

export const buildCrudQuery = (type, qType, params, id = null) => dispatch => {
	let loc;
	qType === T.NOTE ? (loc = "notes/") : (loc = "tags/");

	const crudConfig = {
		get: { aType: T._GET, func: myData.get, loc, params: { params }, id: null },
		patch: {
			aType: T._PATCH,
			func: myData.patch,
			loc: `${loc}${id}`,
			params: params,
			id: id
		},
		post: { aType: T._POST, func: myData.post, loc, params: params, id: null },
		put: {
			aType: T._PUT,
			func: myData.put,
			loc: `${loc}${id}`,
			params: params,
			id: id
		},
		delete: {
			aType: T._DELETE,
			func: myData.delete,
			loc: `${loc}${id}`,
			params: params,
			id: id
		}
	};
	let config = crudConfig[type];
	console.log("build query config", config);
	dispatch(journalQuery(config));
};

export const journalQuery = config => async dispatch => {
	const { aType, func, loc, params, id } = config;
	let response;

	dispatch({ type: `${T.NOTE}${T._BEGAN}${aType}` });

	try {
		response = await func(loc, params);
	} catch (err) {
		dispatch({ type: `${T.NOTE}${T._ERRORED}${aType}` });
		return;
	}
	console.log("response", response);
	dispatch({
		type: `${T.NOTE}${T._FINISHED}${aType}`,
		payload: { data: response.data, id }
	});
};
