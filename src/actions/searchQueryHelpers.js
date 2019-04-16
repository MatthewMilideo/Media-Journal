import * as T from "./types";
import movieDB from "../api/movieDB";
import bookDB from "../api/bookDB";

import {buildCrudQuery} from './index'

import { TMDBFormatter, bookFormatter } from "./dataFormatters";
import { PopupContent } from "semantic-ui-react";



export const searchQueryBuilder = (type, ...args) => {
	const obj = {
		MOVIE: { query: args[0], page: 1 },
		TV_SEASON: { query: args[0], page: 1 },
		BOOK: {
			q: `${args[0]}+inauthor:${args[1]}`,
			startIndex: 0,
			maxResults: 20
		},
		GAME: "TODO"
	};
	return obj[type];
};

export const nextQueryBuilder = (type, curElem, totalElems, query) => {
	let params = {done: true};

	if (type === T.BOOK) {
		let maxResults;
		if (curElem < totalElems) {
			curElem + 20 <= totalElems
				? (maxResults = 20)
				: (maxResults = totalElems - curElem);
			curElem += maxResults;

			params = {
				q: query,
				maxResults: maxResults,
				startIndex: curElem
			};
			console.log("params", params);
		}
	} else if (type === T.GAME) {
	} else {
		curElem++;
		if (curElem <= totalElems) {
			params = { query, page: curElem };
		}
	}
	return params;
};

/* Experimental */
const checkNotes = (response) => {
	console.log('poop');

	response = response.map( elem => { 
		return {id: elem.ID} 
	});
	console.log('id list', response);

	buildCrudQuery('get', response );

} 

export const TMDBSearchQuery = (
	type,
	params,
	typeMod = ""
) => async dispatch => {
	let response;
	let loc = type === T.MOVIE ? "search/movie" : "search/tv";

	dispatch({
		type: `${type}${T._BEGAN_SEARCH}${typeMod}`,
		payload: { type, query: params.query }
	});

	try {
		response = await movieDB.get(loc, { params });
	} catch (err) {
		dispatch({ type: `${type}${T._ERRORED_SEARCH}` });
		return;
	}

	response = TMDBFormatter(response.data);
	let poop = checkNotes(response.results);
	console.log('poop');

	dispatch({
		type: `${type}${T._FINISHED_SEARCH}${typeMod}`,
		payload: {
			data: response.results,
			curElem: params.page,
			totalElems: response.total_pages
		}
	});
};

export const bookSearchQuery = (
	type,
	params,
	typeMod = ""
) => async dispatch => {
	let response;
	dispatch({
		type: `${type}${T._BEGAN_SEARCH}${typeMod}`,
		payload: { type: T.BOOK, query: params.q }
	});
	console.log(params);
	try {
		response = await bookDB.get("", { params });
	} catch (err) {
		dispatch({ type: `${type}${T._ERRORED_SEARCH}` });
		return;
	}
	response = bookFormatter(response.data);
	dispatch({
		type: `${type}${T._FINISHED_SEARCH}${typeMod}`,
		payload: {
			data: response.items,
			curElem: params.startIndex,
			totalElems: response.totalItems
		}
	});
};

export const gameSearchQuery = (params, typeMod = "") => async dispatch => {
	/*
	igdbQuery = () => {
		axios({
			//url: "https://api-v3.igdb.com/search",
			url: '/games',
			method: "POST",
			headers: {
				Accept: "application/json",
				"user-key": "b9798195419973a70280681d150e1b31"
			},
			data: 'search "Halo"; fields name;' 
		})
		
			.then(response => {
				console.log('igdb', response);
				console.log(response.data);
			})
			.catch(err => {
				console.error(err);
			});
	};
	*/
	return null;
};
