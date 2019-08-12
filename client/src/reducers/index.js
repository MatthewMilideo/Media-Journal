import { combineReducers } from "redux";

import notesReducer, * as noteFuncs from "./notesReducer";

import * as T from "../actions/types";
import itemReducer, * as item from "./itemReducer";
import * as ents from "./journalReducer";
import userReducer, * as user from "./userReducer";
import { searchHOR, journalHOR } from "./higherOrderReducers";

const types = [T.MOVIE, T.TV_SEASON, T.BOOK, T.GAME];

const defaultState = {
	status: T.UNLOADED,
	type: null,
	query: null,
	data: [],
	curElem: null,
	totalElems: null
};

const defaultJournalState = {
	data: [],
	Status: null
};

const empty = (state = defaultState, action) => state;
const empty2 = (state = defaultJournalState, action) => state;

let combineReducerObj = {};
types.map(t => (combineReducerObj[t] = searchHOR(t, empty)));
combineReducerObj[T.NOTE] = journalHOR(T.NOTE, empty2);
combineReducerObj[T.TAG] = journalHOR(T.TAG, empty2);

export default combineReducers({
	...combineReducerObj,
	item: itemReducer,
	user: userReducer,
	notes: notesReducer
});

// ~~~~ Public Selectors ~~~~

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
