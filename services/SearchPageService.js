const TMDB = require("../models/TMDB_model");
const gBooks = require("../models/gBooks_model")
const NoteService = require("./NoteService");
const helpers = require("../models/helpers");
const types = require("../types");

const SearchPageService = {};

SearchPageService.searchTMDB = async function(user_id, term, type, page = 1) {
	// Check the incoming arguments.
	if (!helpers.checkArgsType([user_id, page], [term, type], type))
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

	// Query the external database.
	try {
		res = await queryFunc(term, page);
	} catch (error) {
		console.log(error);
		return Promise.reject(error)
	}

	
	let returnObj = {};
	returnObj.queryData = {}; 

	returnObj.queryData.page = res.data.page; 
	returnObj.queryData.total_results = res.data.total_results;
	returnObj.queryData.total_pages = res.data.total_pages;

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

SearchPageService.searchGBooks = async function(user_id, term, index = 0 ) {
	// Check the incoming arguments.
	if (!helpers.checkArgs([user_id, index], [term]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id, search term and index."
		});

	let res;

	// Query the external database.
	try {
		res = await gBooks.searchBooks(term, index);
	} catch (error) {
		return Promise.reject(error)
	}
	
	let returnObj = {};
	returnObj.queryData = res.data.queryData;
	returnObj.keysArr = [];

	// Format the return object.
	res.data.results.forEach(elem => {
		elem.type = types.BOOK;
		elem["viewed"] = false;
		returnObj[elem.id] = elem;
		returnObj.keysArr.push(elem.id);
	});

	// Run the Notecount Service.
	// If it fails just return the data from the successful TMDB query.
	try {
		res = await NoteService.Count(returnObj.keysArr, types.BOOK, user_id);
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

module.exports = SearchPageService;
