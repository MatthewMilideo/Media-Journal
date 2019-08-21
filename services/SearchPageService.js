const TMDB = require("../models/TMDB_model");
const NoteService = require("./NoteService");
const helpers = require("../models/helpers");
const types = require("../types");

const SearchPageService = {};

SearchPageService.searchTMDB = async function(user_id, term, type, page) {
	// Check the incoming arguments.
	if (!helpers.checkArgsType([user_id], [term, type], type))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id, search term and type."
		});

	let queryFunc, errorString, res;

	if (type === types.MOVIE) {
		queryFunc = TMDB.searchMovie;
		errorString = "The requested movies were not found.";
	} else {
		queryFunc = TMDB.searchTV;
		errorString = "The requested televison shows were not found.";
	}

	// If no page is provided assume we are grabbing page 1.
	if (!page) page = 1;

	// Query the external database.
	try {
		res = await queryFunc(term, page);
	} catch (error) {
		return Promise.reject(error)
	}

	if (res.total_results === 0)
		return Promise.reject({
			status: 404,
			data: errorString
		});

	let returnObj = {};
	returnObj.keysArr = [];
	// Format the return object.
	res.data.results.forEach(elem => {
		elem.id = elem.id.toString(10);
		elem.type = types.MOVIE;
		elem["viewed"] = false;
		returnObj[elem.id] = elem;
		returnObj.keysArr.push(elem.id);
	});

	// Run the Notecount Service.
	// If it fails just return the data from the successful TMDB query.
	try {
		res = await NoteService.Count(returnObj.keysArr, type, user_id);
	} catch (error) {
		return { status: 200, data: returnObj };
	}

	// Combine the results of the NoteService call and the TMDB call.
	let keys = Object.keys(res);
	for (let i = 0; i < keys.length; i++) {
		returnObj[keys[i]].viewed = true;
		returnObj[keys[i]].notes = res[keys[i]].notes;
	}

	return { status: 200, data: returnObj };
};

SearchPageService.searchGBooks = async function(user_id, term, page, ) {
	// Check the incoming arguments.
	if (!helpers.checkArgs([user_id], [term]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id, search term and type."
		});

	let res;

	// If no page is provided assume we are grabbing page 1.
	if (!page) page = 0;

	// Query the external database.
	try {
	//	res = await (term, page);
	} catch (error) {
	//	return error;
	}
	/*
	if (res.total_results === 0)
		return Promise.reject({
			status: 404,
			data: errorString
		});

	let returnObj = {};
	returnObj.keysArr = [];

	// Format the return object.
	res.results.forEach(elem => {
		elem.id = elem.id.toString(10);
		elem.type = types.MOVIE;
		elem["viewed"] = false;
		returnObj[elem.id] = elem;
		returnObj.keysArr.push(elem.id);
	});

	// Run the Notecount Service.
	// If it fails just return the data from the successful TMDB query.
	try {
		res = await NoteService.Count(returnObj.keysArr, type, user_id);
	} catch (error) {
		return { status: 200, data: returnObj };
	}

	// Combine the results of the NoteService call and the TMDB call.
	let keys = Object.keys(res);
	for (let i = 0; i < keys.length; i++) {
		returnObj[keys[i]].viewed = true;
		returnObj[keys[i]].notes = res[keys[i]].notes;
	}
	*/

	return { status: 200, data: returnObj };
};

module.exports = SearchPageService;
