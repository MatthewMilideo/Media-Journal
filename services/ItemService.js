const TMDB = require("../models/TMDB_model");
const gBooks = require("../models/gBooks_model");
const helpers = require("../models/helpers");
const MediaService = require("../services/MediaService");
const types = require("../types");

const ItemService = {};

ItemService.get = async function(user_id, CID, type) {
	/* Check the incoming arguments */
	if (!helpers.checkArgsType([], [user_id, CID, type], type))
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
		itemData.data.viewed = false;
		res = await MediaService.getByCIDUser({
			CID,
			type,
			user_id
		});
		if (res.status === 200) {
			itemData.data.viewed = true;
		}
	} catch (error) {
		return Promise.reject(error);
	}

	return { status: 200, data: itemData };
};

ItemService.formatGBooksResponse = response => {
	let returnData = {};
	returnData.queryData = {};
	returnData.queryData.totalItems = response.totalItems;
	returnData.results = response.totalItems;
	if (returnData.results === 0) return returnData;
	returnData.results = response.items.map(elem => {
		if (elem.volumeInfo.imageLinks) {
			if (elem.volumeInfo.imageLinks.thumbnail) {
				elem.image = elem.volumeInfo.imageLinks.smallThumbnail;
				elem.image = elem.image.replace("&zoom=5", "&zoom=3");
			}
		}
		return elem;
	});
	return returnData;
};

const monthObj = {
	0: "January",
	1: "Febuary",
	2: "March",
	3: "April",
	4: "May",
	5: "June",
	6: "July",
	7: "August",
	8: "September",
	9: "October",
	10: "November",
	11: "December"
};

const dayObj = {
	0: "Sunday",
	1: "Monday",
	2: "Tuesday",
	3: "Wednesday",
	4: "Thursday",
	5: "Friday",
	6: "Saturday",
	7: "Sunday"
};

const formatDate = date => {
	let d = new Date(date);
	let dayName = dayObj[d.getDay()];
	let day = d.getDate();
	let month = monthObj[d.getMonth()];
	let year = d.getFullYear();

	return dayName + ", " + month + " " + day + ", " + year;
};

const formatMoney = num => {
	if (num === 0) return null;

	let returnStr = "$";
	num = num.toString();
	let numLen = num.length - 1;
	let counter = 0;

	for (let i = numLen; i >= 0; i--) {
		counter++;
		if (counter === 3 && i != 0) {
			counter = 0;
			let str1 = num.slice(0, i);
			let str2 = num.slice(i, num.length);
			num = str1.concat(",", str2);
		}
	}
	returnStr = returnStr.concat(num);
	return returnStr;
};

module.exports = ItemService;
