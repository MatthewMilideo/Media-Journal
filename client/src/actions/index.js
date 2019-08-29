import * as T from "../actions/types";
import {
	TMDBItemQuery,
	bookItemQuery,
	gameItemQuery
} from "./itemQueryHelpers";

import myData from "../api/myData";

import axios from "axios";

const server = axios.create({
	baseURL: "http://localhost:5000/"
});

/*  Real Actions  */

export const TMDBSearch = (user_id, term, type, page) => async dispatch => {
	console.log("in search");
	let next;
	page === 1 ? (next = "") : (next = T._NEXT);
	dispatch({ type: `${type}${T._BEGAN_SEARCH}${next}` });

	console.log(user_id, term, type, page);
	try {
		let res = await server.get("/search/TMDB", {
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
		console.log(error);
		console.log(error.message);
		dispatch({
			type: `${type}${T._ERRORED_SEARCH}${next}`,
			payload: error
		});
	}
};

export const BookSearch = (user_id, term, index) => async dispatch => {
	dispatch({ type: `${T.BOOK}${T._BEGAN_SEARCH}` });
	try {
		let res = await server.get("/search/books", {
			params: {
				user_id,
				term,
				index
			}
		});

		dispatch({
			type: `${T.BOOK}${T._FINISHED_SEARCH}`,

			payload: {
				data: res.data,
				prevQuery: term,
				prevElem: index,
				totalElems: res.data.queryData.totalItems
			}
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: `${T.BOOK}${T._ERRORED_SEARCH}`
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
		console.log(error);
		dispatch({
			type: `${T.ERRORED_ITEM}`,
			payload: error
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
