const axios = require("axios");
const helpers = require("./helpers");
const KEY = process.env.GBOOKS_KEY;

const GBooks = axios.create({
	baseURL: "https://www.googleapis.com/books/v1/volumes"
});

const GBooksModel = {};

GBooksModel.searchBooks = async function(term, index = 0) {
	if (!helpers.checkArgs([index], [term]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid term and index."
		});
	return GBooks.get("", {
		params: { q: term, startIndex: index, maxResults: 20, key: KEY }
	})
		.then(response => {
			let returnData = GBooksModel.formatResponse(response.data);
			if (returnData.results === 0) {
				return Promise.reject({
					status: 404,
					data: "The requested books were not found."
				});
			}
			return { status: 200, data: returnData };
		})
		.catch(error => {
			if (!error.status) {
				throw { status: error.response.status, data: error.message, error };
			} else {
				throw { status: error.status, data: error.data };
			}
		});
};

GBooksModel.formatResponse = response => {
	let returnData = {};
	returnData.queryData = {};
	returnData.queryData.totalItems = response.totalItems;
	//console.log(returnData);
	returnData.results = response.totalItems;
	if (returnData.results === 0) return returnData;
	returnData.results = response.items.map(elem => {
		console.log(elem);
		if (elem.volumeInfo.imageLinks) {
			if (elem.volumeInfo.imageLinks.thumbnail)
				elem.image = elem.volumeInfo.imageLinks.thumbnail;
			}
		return elem;
	});
	return returnData;
};

GBooksModel.getBook = async function(id) {
	if (!helpers.checkArgs([], [id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid id."
		});
	return GBooks.get(id, { params: { key: KEY } })
		.then(response => {
			console.log(response.data);
			return { status: 200, data: response.data };
		})
		.catch(error => {
			console.log(error);
			if (!error.status) {
				throw { status: error.response.status, data: error.message, error };
			} else {
				throw { status: error.status, data: error.data };
			}
		});
};

module.exports = GBooksModel;
