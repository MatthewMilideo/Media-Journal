import * as T from "./types";
import movieDB from "../api/movieDB";
import bookDB from "../api/bookDB";

import { TMDBFormatter, bookFormatter } from "./dataFormatters";

// The searchBar calls this function to complete a search.
// Input: Type | Queries from the input boxes
export const fetchSearchResult = (type, q1, q2) => dispatch => {
	switch (type) {
		case T.MOVIE:
			return dispatch(TMDBSearchQuery(type, { query: q1, page: 1 }));
		case T.TV:
			return dispatch(TMDBSearchQuery(type, { query: q1, page: 1 }));
		case T.BOOK:
			return dispatch(
				bookSearchQuery(type, {
					q: `${q1}`, //+inauthor:${args[1]}`,
					startIndex: 0,
					maxResults: 20
				})
			);
		case T.GAME:
			return "TODO";
		default:
			return;
	}
};

// The search page calls this function to load more content
// Input: Type
export const fetchNextPage = type => (dispatch, getState) => {
	let params = { done: true };
	// Get the information about previously loaded content.
	const { curElem, totalElems, query } = getState()[type];
	// Generates and formats the paramaters to request additional items.
	params = nextQueryBuilder(type, curElem, totalElems, query);
	// Chooses the correct search function from the configuration object.
	// If the params indicate that there is no need to search return.
	if (params.done === true) return;
	switch (type) {
		case T.MOVIE:
			return dispatch(TMDBSearchQuery(type, params, T._NEXT));
		case T.TV:
			return dispatch(TMDBSearchQuery(type, params, T._NEXT));
		case T.BOOK:
			return dispatch(bookSearchQuery(type, params, T._NEXT));
		case T.GAME:
			return "TODO";
		default:
			return;
	}
};

export const nextQueryBuilder = (type, curElem, totalElems, query) => {
	let params = { done: true };

	// Build Params for Each type of next query;
	switch (type) {
		case T.MOVIE: {
			curElem++;
			if (curElem <= totalElems) {
				return { query, page: curElem };
			}
			return params;
		}
		case T.TV: {
			curElem++;
			if (curElem <= totalElems) {
				return { query, page: curElem };
			}
			return params;
		}
		case T.BOOK: {
			let maxResults;
			if (curElem < totalElems) {
				curElem + 20 <= totalElems
					? (maxResults = 20)
					: (maxResults = totalElems - curElem);
				curElem += maxResults;

				return {
					q: query,
					maxResults: maxResults,
					startIndex: curElem
				};
			}
			return params;
		}
		case T.GAME: {
			return params;
		}
		default: 
			return; 
	}
};

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
		return err;
	}

	response = TMDBFormatter(response.data);

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

// TODO
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
				////console.log(('igdb', response);
				////console.log((response.data);
			})
			.catch(err => {
				console.error(err);
			});
	};
	*/
	return null;
};
