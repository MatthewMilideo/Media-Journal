import * as T from "../actions/types";


import axios from "axios";

const server = axios.create({
	baseURL: "http://localhost:5000/"
});

/*  Real Actions  */

export const extSearch = (user_id, term, type, page) => async dispatch => {
	console.log("in search");
	let next;
	page === 1 ? (next = "") : (next = T._NEXT);
	dispatch({ type: `${type}${T._BEGAN_SEARCH}${next}` });

	console.log(user_id, term, type, page);
	try {
		let res = await server.get("/search/", {
			params: {
				user_id,
				term,
				type,
				page
			}
		});
		dispatch({
			type: `${type}${T._FINISHED_SEARCH}${next}`,
			payload: {
				data: res.data,
				prevQuery: term,
				prevElem: page,
				totalElems: res.data.queryData.total_pages
			}
		});
	} catch (error) {
		// Catch if my server is down.
		if (!error.response) {
			dispatch({
				type: `${T._ERRORED_SEARCH}${next}}`,
				payload: {
					status: 503,
					data: "The Server is down.",
					error: error
				}
			});
			return;
		}
		console.log(error);
		console.log(error.message);
		dispatch({
			type: `${type}${T._ERRORED_SEARCH}${next}`,
			payload: error
		});
	}
};

export const postMediaUser = (user_id, mediaObj) => async dispatch => {
	const { type, CID } = mediaObj;
	dispatch({ type: `${type}${T._BEGAN_POST_MEDIA_USER}` });
	try {
		let res = await server.post("/media_user/", {
			user_id,
			mediaObj
		});
		dispatch({
			type: `${type}${T._SUCCESS_POST_MEDIA_USER}`,
			payload: {
				user_id,
				type,
				CID
			}
		});
	} catch (error) {
		console.log(error);
		console.log(error.message);
		dispatch({
			type: `${type}${T._ERRORED_POST_MEDIA_USER}`,
			payload: error
		});
	}
};

export const getItem = (user_id, CID, type) => async dispatch => {
	console.log(user_id, CID, type);
	dispatch({ type: `${T.BEGAN_ITEM}`, payload: { type } });
	try {
		let res = await server.get("/search/item/", {
			params: {
				user_id,
				CID,
				type
			}
		});
		dispatch({
			type: `${T.FINISHED_ITEM}`,
			payload: {
				data: res.data,
				type: type
			}
		});
	} catch (error) {
		// Catch if my server is down.

		if (!error.response) {
			dispatch({
				type: `${T.ERRORED_ITEM}`,
				payload: {
					status: 503,
					data: "The Server is down.",
					error: error
				}
			});
			return;
		}
		dispatch({
			type: `${T.ERRORED_ITEM}`,
			payload: error
		});
	}
};

export const getNotes = IDs => async dispatch => {
	dispatch({ type: `${T.BEGAN_GET_NOTES}` });
	try {
		let res = await server.get("/search/notes/", {
			params: {
				IDs
			}
		});
		dispatch({
			type: `${T.FINISHED_GET_NOTES}`,
			payload: {
				notes: res.data,
				keysArr: res.data.keysArr
			}
		});
	} catch (error) {
		// Catch if my server is down.
		console.log(error.response);
		if (!error.response) {
			dispatch({
				type: `${T.ERRORED_GET_NOTES}`,
				payload: {
					status: 503,
					data: "The Server is down.",
					error: error
				}
			});
			return;
		}
		// If responding to a server defined error.
		dispatch({
			type: `${T.ERRORED_GET_NOTES}`,
			payload: {
				status: error.response.status,
				data: error.response.data,
				error: error.response.error
			}
		});
	}
};

export const editNote = (id, title, data) => async dispatch => {
	dispatch({ type: `${T.BEGAN_EDIT_NOTE}` });
	try {
		let res = await server.put("/notes/", {
			id,
			title,
			data
		});
		console.log(res);
		dispatch({
			type: `${T.FINISHED_EDIT_NOTE}`,
			payload: {
				id,
				title,
				data
			}
		});
	} catch (error) {
		// Catch if my server is down.
		if (!error.response) {
			dispatch({
				type: `${T.ERRORED_EDIT_NOTE}`,
				payload: {
					status: 503,
					data: "The Server is down.",
					error: error
				}
			});
			return;
		}
		dispatch({
			type: `${T.ERRORED_EDIT_NOTE}`,
			payload: {
				status: error.response.status,
				data: error.response.data,
				error: error.response.error
			}
		});
	}
};

/*
title, data, user_id, mediaObj
*/

export const postNote = (
	title,
	data,
	user_id,
	mediaObj,
	old_id
) => async dispatch => {
	dispatch({ type: `${T.BEGAN_POST_NOTE}` });
	try {
		let res = await server.post("/notes/", {
			title,
			data,
			user_id,
			mediaObj,
			id: old_id
		});
		console.log(res);

		//note_id: 28, media_id: 31, user_id: 61
		let noteObj = {
			note_id: res.data[0].note_id,
			media_id: res.data[0].media_id,
			user_id: res.data[0].user_id,
			title,
			data,
			media: mediaObj
		};

		dispatch({
			type: `${T.FINISHED_POST_NOTE}`,
			payload: {
				noteObj,
				old_id
			}
		});
	} catch (error) {
		// Catch if my server is down.
		if (!error.response) {
			dispatch({
				type: `${T.ERRORED_POST_NOTE}`,
				payload: {
					status: 503,
					data: "The Server is down.",
					error: error
				}
			});
			return;
		}
		dispatch({
			type: `${T.ERRORED_POST_NOTE}`,
			payload: {
				status: error.response.status,
				data: error.response.data,
				error: error.response.error
			}
		});
	}
};

export const addNote = () => {
	return { type: `${T.ADD_NOTE}` };
};

export const deleteNote = note => async dispatch => {
	dispatch({ type: `${T.BEGAN_DELETE_NOTE}` });
	try {
		if (!note.new) console.log(note.media_id);
		await server.delete("/notes/", {
			data: {
				media_id: note.media_id,
				note_id: note.note_id,
				user_id: note.user_id
			}
		});
		dispatch({
			type: `${T.FINISHED_DELETE_NOTE}`,
			payload: { note_id: note.note_id }
		});
	} catch (error) {
		console.log(error);
		// Catch if my server is down.
		if (!error.response) {
			dispatch({
				type: `${T.ERRORED_DELETE_NOTE}`,
				payload: {
					status: 503,
					data: "The Server is down.",
					error: error
				}
			});
			return;
		}
		dispatch({
			type: `${T.ERRORED_DELETE_NOTE}`,
			payload: {
				status: error.response.status,
				data: error.response.data,
				error: error.response.error
			}
		});
	}
};

/*  ~~~~~ Search Page Actions ~~~~~ */

export const searchBarActiveElem = active => {
	return {
		type: T.SEARCH_BAR_ACTIVE_CHANGE,
		payload: active
	};
};

export const searchBarText = text => {
	return {
		type: T.SEARCH_BAR_TEXT,
		payload: text
	};
};

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
