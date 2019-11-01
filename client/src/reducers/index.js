import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import userReducer, * as user from "./userReducer";
import tagReducer, * as tag from "./tagReducer";
import viewedReducer from "./viewedReducer";
import searchBarReducer, * as search from "./searchBarReducer";
import { searchHOR } from "./higherOrderReducers";

import * as T from "../actions/types";

import notesReducer, * as noteFuncs from "./notesReducer";
import itemReducer, * as item from "./itemReducer";

let reducerObject = {};
reducerObject[T.MOVIE] = searchHOR(T.MOVIE);
reducerObject[T.TV] = searchHOR(T.TV);
reducerObject[T.BOOK] = searchHOR(T.BOOK);

export default combineReducers({
	...reducerObject,
	firebaseReducer,
	user: userReducer,
	search: searchBarReducer,
	tag: tagReducer,
	item: itemReducer,
	notes: notesReducer,
	viewed: viewedReducer
});

// ~~~~ Public Selectors ~~~~

export function getSearchState(store) {
	return store["search"];
}

export function getSearchActiveElem(store) {
	return search._getSearchActiveElem(store["search"]);
}

export function getMediaState(store, type) {
	return store[type];
}

// ~~~~~~ Notes Selector ~~~~~~~~~~

export function getNotesState(store) {
	return noteFuncs._getNotesState(store["notes"]);
}

export function getNotesKeysArr(store) {
	return noteFuncs._getNotesKeysArr(store["notes"]);
}

export function getNote(store, id) {
	return noteFuncs._getNote(store["notes"], id);
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

export function getSearchTags(store) {
	return tag._getSearchTags(store["tag"]);
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
