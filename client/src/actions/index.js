import * as T from "../actions/types";

import axios from "axios";

const server = axios.create({
	baseURL: "http://localhost:5000/"
});

// Input: user_id: int, term: string, type: specific string, page: int
// Output: queryData: {information about the query}
// 		   media: {The media searched for},
//         keysArr: array containting ids for media obj.
// This function calls my API, tells it to query an external API,
// processes the data and adds information about the users interactions
// with it and returns that data.

export const extSearch = (user_id, term, type, page) => async dispatch => {
	// Checks if the search is an original search, or a request for more information
	// on a previous search.
	let next;
	page === 0 ? (next = "") : (next = T._NEXT);

	dispatch({ type: `${type}${T._BEGAN_SEARCH}${next}` });

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
				media: res.data.media,
				queryData: res.data.queryData,
				keysArr: res.data.keysArr
			}
		});
	} catch (error) {
		// Catch if my server is down.
		if (!error.response) {
			dispatch({
				type: `${type}${T._ERRORED_SEARCH}${next}`,
				payload: {
					serverStatus: 503,
					message: "The Server is down.",
					error: error
				}
			});
			return;
		}
		dispatch({
			type: `${type}${T._ERRORED_SEARCH}${next}`,
			payload: {
				serverStatus: error.response.status,
				message: error.response.data,
				error: error
			}
		});
	}
};

export const postMediaUser = (user_id, mediaObj) => async dispatch => {
	const { type, CID } = mediaObj;
	dispatch({ type: `${type}${T._BEGAN_POST_MEDIA_USER}` });
	try {
		let res = await server.post("/notes/media_user/", {
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
		dispatch({
			type: `${type}${T._ERRORED_POST_MEDIA_USER}`,
			payload: error
		});
	}
};

export const deleteMediaUser = (user_id, mediaObj) => async dispatch => {
	dispatch({ type: `${T._BEGAN_DELETE_MEDIA_USER}` });
	try {
		let res = await server.delete("/notes/media_user/", {
			data: {
				user_id,
				mediaObj
			}
		});

		dispatch({
			type: `${T._SUCCESS_DELETE_MEDIA_USER}`,
			payload: {
				user_id,
				CID: mediaObj.CID
			}
		});
	} catch (error) {
		dispatch({
			type: `${T._ERRORED_DELETE_MEDIA_USER}`,
			payload: error
		});
	}
};

export const getItem = (user_id, CID, type) => async (dispatch, getState) => {
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

export const getNotesUser = user_id => async dispatch => {
	dispatch({ type: `${T.BEGAN_GET_NOTES}` });
	try {
		let res = await server.get("/search/notesUser/", {
			params: {
				user_id
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

export const getMediaUser = user_id => async dispatch => {
	dispatch({ type: `${T.BEGAN_GET_MEDIA}` });
	try {
		let res = await server.get("/search/mediaUser/", {
			params: {
				user_id
			}
		});

		dispatch({
			type: `${T.FINISHED_GET_MEDIA}`,
			payload: {
				media: res.data,
				keysArr: res.data.keysArr
			}
		});
		console.log(res);
	} catch (error) {
		// Catch if my server is down.
		if (!error.response) {
			dispatch({
				type: `${T.ERRORED_GET_MEDIA}`,
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
			type: `${T.ERRORED_GET_MEDIA}`,
			payload: {
				status: error.response.status,
				data: error.response.data,
				error: error.response.error
			}
		});
	}
};

export const getNotesTags = (tag_ids, user_id) => async dispatch => {
	dispatch({ type: `${T.BEGAN_GET_NOTES_TAGS}` });
	try {
		let res = await server.get("/search/noteTags/", {
			params: {
				tag_ids,
				user_id
			}
		});
		console.log(res);
		dispatch({
			type: `${T.FINISHED_GET_NOTES_TAGS}`,
			payload: {
				notes: res.data,
				keysArr: res.data.keysArr
			}
		});
	} catch (error) {
		// Catch if my server is down.

		if (!error.response) {
			dispatch({
				type: `${T.ERRORED_GET_NOTES_TAGS}`,
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
			type: `${T.ERRORED_GET_NOTES_TAGS}`,
			payload: {
				status: error.response.status,
				data: error.response.data,
				error: error.response.error
			}
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

export const editNote = (
	id,
	title,
	data,
	addTags,
	rmTags,
	user_id
) => async dispatch => {
	dispatch({ type: `${T.BEGAN_EDIT_NOTE}` });
	try {
		let res = await server.put("/notes/", {
			id,
			title,
			data,
			addTags,
			rmTags,
			user_id
		});
		dispatch({
			type: `${T.FINISHED_EDIT_NOTE}`,
			payload: {
				id,
				title,
				data,
				tags: res.data.tags
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

export const postNote = (
	old_id,
	title,
	data,
	mediaObj,
	user_id,
	tags
) => async dispatch => {
	dispatch({ type: `${T.BEGAN_POST_NOTE}` });

	try {
		let res = await server.post("/notes/", {
			title,
			data,
			user_id,
			mediaObj,
			tags
		});

		//note_id: 28, media_id: 31, user_id: 61
		let noteObj = {
			note_id: res.data.note_id,
			media_id: res.data.media_id,
			user_id: res.data.user_id,
			note_title: title,
			data,
			type: mediaObj.type,
			media_title: mediaObj.title,
			tags: res.data.tags,
			errorTags: res.data.errorTags
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

export const addNoteTag = (tag, note_id) => {
	return { type: `${T.ADD_NOTE_TAG}`, payload: { tag, note_id } };
};

export const removeNoteTag = (tag, note_id) => {
	return { type: `${T.REMOVE_NOTE_TAG}`, payload: { tag, note_id } };
};

export const deleteNote = note => async dispatch => {
	if (note.new)
		return dispatch({
			type: `${T.FINISHED_DELETE_NOTE}`,
			payload: { note_id: note.note_id }
		});
	dispatch({ type: `${T.BEGAN_DELETE_NOTE}` });
	try {
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

// ~~~~~ Tag Actions ~~~~~

export const searchTag = string => async dispatch => {
	dispatch({ type: `${T.BEGAN_SEARCH_TAGS}` });
	try {
		let res = await server.get("/search/tags/", {
			params: {
				string
			}
		});
		dispatch({
			type: `${T.FINISHED_SEARCH_TAGS}`,
			payload: {
				tags: res.data
			}
		});
	} catch (error) {
		// Catch if my server is down.

		if (!error.response) {
			dispatch({
				type: `${T.ERRORED_SEARCH_TAGS}`,
				payload: {
					status: 503,
					data: "The server is down."
				}
			});
			return;
		}
		// If responding to a server defined error.
		dispatch({
			type: `${T.ERRORED_SEARCH_TAGS}`,
			payload: {
				status: error.response.status,
				data: error.response.data,
				error: error.response.error
			}
		});
	}
};

//  ~~~~~ Search Page Actions ~~~~~

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
