import { combineReducers } from "redux";
import userReducer, * as user from "./userReducer";
import searchBarReducer, * as search from './searchBarReducer'
import { searchHOR } from "./higherOrderReducers";

import * as T from "../actions/types";


import notesReducer, * as noteFuncs from "./notesReducer";
import itemReducer, * as item from "./itemReducer";
import * as ents from "./journalReducer";


let reducerObject = {}
reducerObject[T.MOVIE] = searchHOR(T.MOVIE);
reducerObject[T.TV] = searchHOR(T.TV);
reducerObject[T.BOOK] = searchHOR(T.BOOK);

export default combineReducers({
	...reducerObject, 
	user: userReducer,
	search: searchBarReducer,

	// Legacy
	item: itemReducer,
	notes: notesReducer,
});

// ~~~~ Public Selectors ~~~~


export function getSearchState(store) {
	return store['search'];
}

export function getMediaState(store, type) {
	return store[type];
}

// ~~~~~~ Notes Selector ~~~~~~~~~~

export function getNotesState(store) {
	return noteFuncs._getNotesState(store["notes"])
}

// ~~~~~Internal API User Selectors ~~~~~~~

export function getUserInfo(store) {
	return user._getUserInfo(store["user"]);
}

export function getUserErr(store) {
	return user._getUserErr(store["user"]);
}

export function getUser(store) {
	return user._getUser(store["user"]);
}



// ~~~~~~~~ Other Selectors ~~~~~~

export const getSearchData = (type, store) => {
	return store[type].data;
};

export const getStatus = (type, store) => {
	return store[type].status;
};

export const getSearch = (type, store) => {
	return { status: store[type].status, data: store[type].data };
};

export const getItemNotes = store => {
	return store[T.NOTE].data;
};

export function getItemStatus(store) {
	return item._getItemStatus(store["item"]);
}

export function getItemData(store) {
	return item._getItemData(store["item"]);
}

export const getCurItem = store => {
	return ents._getCurItem(store["ENTRIES"]);
};

// Entries
export const getTags = store => {
	return ents._getTags(store["ENTRIES"]);
};

export const getEntries = store => {
	return ents._getEntries(store["ENTRIES"]);
};

export const getCurNotes = store => {
	return ents._getCurNotes(store["ENTRIES"]);
};
