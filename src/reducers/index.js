import { combineReducers } from "redux";
import * as T from "../actions/types";
import itemReducer, * as item from "./itemReducer";
import journalReducer, * as ents from "./journalReducer";
import {  searchHOR, journalHOR } from "./higherOrderReducers";

const types = [T.MOVIE, T.TV_SEASON, T.BOOK, T.GAME]; 

const defaultState = {
	status: null,
	type: null,
	query: null,
	data: [],
	curElem: null,
	totalElems: null
};

const defaultJournalState = {
	data: [],
	Status: null,
};

const empty = (state = defaultState, action) => state;
const empty2 = (state = defaultJournalState, action) => state;

let combineReducerObj = {}
types.map( t => combineReducerObj[t] = searchHOR(t, empty));
combineReducerObj[T.NOTE] = journalHOR(T.NOTE, empty2);
combineReducerObj[T.TAG] = journalHOR(T.TAG, empty2);

export default combineReducers({
	...combineReducerObj,
	item: itemReducer,
});

// ~~~~ Public Selectors ~~~~

export const getSearchData = (type, store) => {
	return store[type].data;
};

export const getStatus = (type, store) => {
	return store[type].status;
};

export const getSearch = (type, store) => {
	return { status: store[type].status, data: store[type].data };
};

export const getItemNotes = (store) => {
	return store[T.NOTE].data;
};

/*
export function getSearchStatus(store) {
	return search._getSearchStatus(store['search']);
}

export function getSearchData(store) {
	return search._getSearchData(store['search']);
}
*/

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
