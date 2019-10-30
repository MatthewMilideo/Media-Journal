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
	if (type === types.BOOK) {
		page = page * 20;
		return await gBooks.search(term, page);
	}
	if (page === 0) page = 1;
	return await TMDB.search(term, type, page);
};

SearchPageService.search = async function(user_id, term, type, page = 0) {
	console.log('user_id in search', user_id);
	// Check the incoming arguments.
	if (!helpers.checkArgsType([], [user_id, term, type], type))
		return {
			status: 400,
			data: "You must provide a valid user_id, search term and type."
		};
	console.log('got past first test')
	
	// Query External Database.
	let results = await SearchPageService.searchExt(term, type, page);
	if (results.status !== 200) return results;
	// Create the return objects
	if (type === types.BOOK) {
		results = SearchPageService.processGBooks(
			results.data,
			user_id,
			term,
			page
		);
	} else {
		results = SearchPageService.processTMDB(results.data, user_id, type, term);
	}

	//Get a list of all viewed media
	//.
	let results2 = await MediaService.getByCIDUser(results.searchArr);
	if (results2.status !== 200) return { status: 200, data: results };

	let IDtoCID = {};

	results2.data.forEach(elem => {
		results.media[elem.CID].viewed = true;
		IDtoCID[elem.media_id] = elem.CID;
	});
	let ids = Object.keys(IDtoCID);

	// Get a count of all notes for viewed media.
	results2 = await MediaNoteService.getByMediaID(ids);
	console.log(' results2', results2)

	if (results2.status !== 200) return { status: 200, data: results };

	results2.data.forEach(elem => {
		let theCID = IDtoCID[elem.media_id];
		results.media[theCID].noteCount += 1;
	});

	return { status: 200, data: results };
};

SearchPageService.processTMDB = function(data, user_id, type, term) {
	let returnObj = {};
	returnObj.queryData = {};
	returnObj.queryData.page = data.page;
	returnObj.queryData.total_results = data.total_results;
	returnObj.queryData.total_pages = data.total_pages;
	returnObj.queryData.term = term;
	returnObj.keysArr = [];
	returnObj.searchArr = [];
	returnObj.media = {};

	data.results.forEach(elem => {
		elem.CID = elem.id.toString(10);
		elem.type = type;
		elem["viewed"] = false;
		elem.noteCount = 0;
		returnObj.media[elem.id] = elem;
		returnObj.keysArr.push(elem.id);
		returnObj.searchArr.push({ CID: elem.id, user_id, type });
	});
	return returnObj;
};

SearchPageService.processGBooks = function(data, user_id, term, page) {
	let returnObj = {};
	let queryData = {};

	queryData.index = page * 20;
	queryData.page = page;

	queryData.total_results = data.totalItems;
	queryData.total_pages = Math.floor(data.totalItems / 20);
	queryData.term = term;
	if (data.totalItems % 20 !== 0) queryData.total_pages += 1;
	returnObj.queryData = queryData;

	returnObj.media = {};
	returnObj.keysArr = [];
	returnObj.searchArr = [];

	// Format the return object.
	data.items.forEach(book => {
		let elem = {};
		elem.id = book.id;

		elem.type = types.BOOK;
		elem["viewed"] = false;
		elem.noteCount = 0;
		if (book.volumeInfo.imageLinks) {
			if (book.volumeInfo.imageLinks.smallThumbnail) {
				elem.smallImage = book.volumeInfo.imageLinks.smallThumbnail;
				elem.largeImage = elem.smallImage.replace("&zoom=5", "&zoom=3");
			}
		}
		else {
			elem.largeImage =
				"https://images.unsplash.com/photo-1476081718509-d5d0b661a376?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2466&q=80";
			elem.smallImage =
				"https://images.unsplash.com/photo-1476081718509-d5d0b661a376?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2466&q=80";
		}
		elem = { ...elem, ...book.volumeInfo };
		returnObj.media[book.id] = elem;
		returnObj.keysArr.push(book.id);
		returnObj.searchArr.push({ CID: book.id, user_id, type: types.BOOK });
	});
	return returnObj;
};

module.exports = SearchPageService;
