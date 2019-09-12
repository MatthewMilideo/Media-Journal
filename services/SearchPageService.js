const TMDB = require("../models/TMDB_model");
const gBooks = require("../models/gBooks_model");
const MediaService = require("./MediaService");
const MediaNoteService = require("./MediaNoteService");

const helpers = require("../models/helpers");
const types = require("../types");

const SearchPageService = {};

SearchPageService.searchExt = async function(term, type, page = 0) {
	if (!helpers.checkArgsType([], [term, type], type))
		return {
			status: 400,
			data: "You must provide a valid term, type, and page."
		};
	if (type === types.BOOK) return await gBooks.search(term, page);
	if (page === 0) page = 1;
	return await TMDB.search(term, type, page);
};

SearchPageService.search = async function(user_id, term, type, page = 0) {
	// Check the incoming arguments.
	if (!helpers.checkArgsType([user_id], [term, type], type))
		return {
			status: 400,
			data: "You must provide a valid user_id, search term and type."
		};

	// Query External Database.
	let results = await SearchPageService.searchExt(term, type, page);
	if (results.status !== 200) return results;
	// Create the return objects
	if (type === types.BOOK) {
		results = SearchPageService.processGBooks(results.data, user_id);
	} else {
		results = SearchPageService.processTMDB(results.data, user_id, type);
	}

	//Get a list of all viewed media.
	let results2 = await MediaService.getByCIDUser(results.searchArr);

	if (results2.status !== 200) return { status: 200, data: results };

	let IDtoCID = {};

	results2.data.forEach(elem => {
		results[elem.CID].viewed = true;
		IDtoCID[elem.media_id] = elem.CID;
	});

	let ids = Object.keys(IDtoCID);

	// Get a count of all notes for viewed media.
	results2 = await MediaNoteService.getByMediaID(ids);

	if (results2.status !== 200) return { status: 200, data: results };

	results2.data.forEach(elem => {
		let theCID = IDtoCID[elem.media_id];
		results[theCID].noteCount += 1;
	});

	return { status: 200, data: results };
};

SearchPageService.processTMDB = function(data, user_id, type) {
	let returnObj = {};
	returnObj.queryData = {};
	returnObj.queryData.page = data.page;
	returnObj.queryData.total_results = data.total_results;
	returnObj.queryData.total_pages = data.total_pages;
	returnObj.keysArr = [];
	returnObj.searchArr = [];

	data.results.forEach(elem => {
		elem.CID = elem.id.toString(10);
		elem.type = type;
		elem["viewed"] = false;
		elem.noteCount = 0;
		returnObj[elem.id] = elem;
		returnObj.keysArr.push(elem.id);
		returnObj.searchArr.push({ CID: elem.id, user_id, type });
	});
	return returnObj;
};

SearchPageService.processGBooks = function(data, user_id) {
	let returnObj = {};
	returnObj.queryData = data.queryData;
	returnObj.keysArr = [];

	// Format the return object.
	data.results.forEach(elem => {
		elem.CID = elem.id;
		elem.type = types.BOOK;
		elem["viewed"] = false;
		elem.noteCount = 0;
		returnObj[elem.id] = elem;
		returnObj.keysArr.push(elem.id);
		returnObj.searchArr.push({ CID: elem.id, type });
	});
	return returnObj;
};

module.exports = SearchPageService;
