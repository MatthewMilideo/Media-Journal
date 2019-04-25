import * as T from "../actions/types";
import { searchQueryBuilder, nextQueryBuilder } from "./searchQueryHelpers";
import {
	TMDBSearchQuery,
	bookSearchQuery,
	gameSearchQuery
} from "./searchQueryHelpers";
import {
	TMDBItemQuery,
	bookItemQuery,
	gameItemQuery
} from "./itemQueryHelpers";
import myData from "../api/myData";

const searchObj = {};
searchObj[T.MOVIE] = TMDBSearchQuery;
searchObj[T.TV_SEASON] = TMDBSearchQuery;
searchObj[T.BOOK] = bookSearchQuery;
searchObj[T.GAME] = gameSearchQuery;

// Input: Queries from Search
// Gets the type of search via get state.
// Builds the Params for the axios call. - function in searchQueryHelpers
// Chooses the right search function. - which are all defined in searchQueryHelpers
// Dispatches.
export const fetchSearchResult = (type, q1, q2) => (dispatch, getState) => {
	const params = searchQueryBuilder(type, q1, q2);
	const searchFunc = searchObj[type];

	if (params.done === true) return;

	dispatch(searchFunc(type, params));
};

// Nearly the same as above but for a next page query.
export const fetchNextPage = (type) => (dispatch, getState) => {
	const { curElem, totalElems, query } = getState()[type]
	const params = nextQueryBuilder(type, curElem, totalElems, query);
	const searchFunc = searchObj[type];

	if (params.done === true) return;

	dispatch(searchFunc(type, params, T._NEXT));
};

//TODO Build out game query builder.

const itemObj = {};
itemObj[T.MOVIE] = TMDBItemQuery;
itemObj[T.TV_SEASON] = TMDBItemQuery;
itemObj[T.BOOK] = bookItemQuery;
itemObj[T.GAME] = gameItemQuery;

// Fetches data for an individual item
export const fetchItem = (type, id) => dispatch => {
//	////console.log((' in fetch item' , type, id);
	const itemFunc = itemObj[type];
//	////console.log((itemFunc);

	dispatch(itemFunc(type, id));
};

export const buildCrudQuery = (type, qType, params, id = null) => dispatch => {
	let loc; 
	qType === T.NOTE ? loc = 'notes/' : loc = 'tags/'
//	////console.log((type, qType, params, id );
	
	const crudConfig = {
		get: { aType: T._GET, func: myData.get, loc, params: {params}, id: null},
		patch: {
			aType: T._PATCH,
			func: myData.patch,
			loc: `${loc}${id}`,
			params: params,
			id: id 
		},
		post: { aType: T._POST, func: myData.post, loc, params: params, id: null},
		put: { aType: T._PUT, func: myData.put, loc: `${loc}${id}`, params: params, id: id},
		delete: {
			aType: T._DELETE,
			func: myData.delete,
			loc: `${loc}${id}`,
			params: params,
			id: id 
		}
	};
	let config = crudConfig[type];
	console.log('build query config' , config);
	dispatch(journalQuery(config));
};

export const journalQuery = ( config ) => async dispatch => {

	const {aType, func, loc, params, id} = config; 
	//////console.log((aType,  loc, params, id);
	let response;

	dispatch({ type: `${T.NOTE}${T._BEGAN}${aType}` });

	//console.log('loc', loc, 'params', params);

	try {
		response = await func(loc, params);
	} catch (err) {
		//console.log(err);
		//console.log(response);
		dispatch({ type: `${T.NOTE}${T._ERRORED}${aType}` });
		return; 
	}
	console.log('response', response);
	dispatch({
		type: `${T.NOTE}${T._FINISHED}${aType}`,
		payload: {data: response.data, id}
	});
};





export const fetchTags = () => async dispatch => {
	let response;

	try {
		response = await myData.get("tags/");
	} catch (err) {
		////console.log((err);
	}
	dispatch({ type: "FETCH_TAGS", payload: response.data });
};

export const fetchTag = tag => async dispatch => {
//	////console.log(("in fetch tag");
//	////console.log((tag);
	let response;

	//let query = { params: { id: tag } };

	try {
		response = await myData.get(`tags/${tag}`);
	} catch (err) {
		////console.log(("Error");
		return "poop";
	}
//	////console.log(("did not error");
//	////console.log((response);
	return response;
};

export const addTag = tag => async dispatch => {
	let response;

	response = await dispatch(fetchTag(tag.id));
	if (response !== "poop") {
///		////console.log(("tag already added");
		return;
	}

	try {
		response = await myData.post(
			"tags",
			{
				id: tag.id,
				value: tag.value,
				text: tag.text
			},
			{ headers: { "Content-Type": "application/json" } }
		);
	} catch (err) {
		////console.log((err);
	}
	////console.log((response);
	dispatch({ type: "ADD_TAG", payload: response.data });
};
