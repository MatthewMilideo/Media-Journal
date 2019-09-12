const TMDB = require("../models/TMDB_model");
const gBooks = require("../models/gBooks_model");
const helpers = require("../models/helpers");
const MediaService = require("../services/MediaService");
const types = require("../types");

const ItemService = {};

ItemService.get = async function(user_id, CID, type) {
	/* Check the incoming arguments */
	if (!helpers.checkArgsType([user_id], [CID, type], type))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id, CID and type."
		});

	let queryFunc, errorString, res, itemData, notes;

	if (type === types.MOVIE) {
		queryFunc = TMDB.getItem;
		errorString = "The requested movie was not found.";
	} else if (type === types.TV) {
		queryFunc = TMDB.getItem;
		errorString = "The requested televison show was not found.";
	} else {
		queryFunc = gBooks.getBook;
		errorString = "The requested book was not found.";
	}

	try {
		itemData = await queryFunc(CID, type);
	} catch (error) {
		return Promise.reject(error);
	}

	try {
		notes = await MediaService.getByCIDUser({ CID, type, user_id });
		if (notes.status === 200) {
			itemData.data.notes = notes.data;
			return itemData;
		}
	} catch (error) {
		return Promise.reject(error);
	}
	return { status: 200, data: itemData };
};

module.exports = ItemService;
