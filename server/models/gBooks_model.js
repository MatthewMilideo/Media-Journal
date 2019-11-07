const axios = require("axios");
const helpers = require("./helpers");
const KEY = process.env.GBOOKS_KEY;

const GBooks = axios.create({
	baseURL: "https://www.googleapis.com/books/v1/volumes"
});

const GBooksModel = {};

GBooksModel.search = async function(term, index = 0) {

	return GBooks.get("", {
		params: {
			q: term,
			startIndex: index,
			maxResults: 20,
			key: KEY,
			projection: "lite"
		}
	})
		.then(response => {
			response.data.index = index;
			if (response.data.totalItems === 0) {
				return {
					status: 404,
					data: "The requested books were not found."
				};
			}

			return { status: 200, data: response.data };
		})
		.catch(error => {
			if (!error.status) {
				return { status: error.response.status, data: error.message, error };
			} else {
				return { status: error.status, data: error.data };
			}
		});
};

GBooksModel.getBook = async function(id) {
	if (!helpers.checkArgs([], [id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid id."
		});
	return GBooks.get(id, { params: { key: KEY } })
		.then(response => {
			response = GBooksModel.formatItemResponse(response.data);
			return { status: 200, data: response };
		})
		.catch(error => {

			if (!error.status) {
				throw { status: error.response.status, data: error.message, error };
			} else {
				throw { status: error.status, data: error.data };
			}
		});
};

GBooksModel.formatItemResponse = response => {
	let returnData = {};
	returnData.id = response.id;
	returnData.title = response.volumeInfo.title;
	returnData.authors = response.volumeInfo.authors;
	returnData.publisher = response.volumeInfo.publisher;
	returnData.publishedDate = response.volumeInfo.publishedDate;
	returnData.description = response.volumeInfo.description;
	returnData.industryIdentifiers = response.volumeInfo.industryIdentifiers;
	returnData.pageCount = response.volumeInfo.pageCount;
	returnData.categories = response.volumeInfo.categories;
	returnData.printedPageCount = response.volumeInfo.printedPageCount;
	if (response.volumeInfo.imageLinks) {
		if (response.volumeInfo.imageLinks.smallThumbnail) {
			returnData.largeImage = response.volumeInfo.imageLinks.smallThumbnail;
			returnData.largeImage = returnData.largeImage.replace(
				"&zoom=5",
				"&zoom=3"
			);
			if (returnData.largeImage === undefined)
				returnData.largeImage =
					"https://images.unsplash.com/photo-1476081718509-d5d0b661a376?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2466&q=80";
		} else {
			returnData.largeImage =
				"https://images.unsplash.com/photo-1476081718509-d5d0b661a376?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2466&q=80";
			returnData.smallImage =
				"https://images.unsplash.com/photo-1476081718509-d5d0b661a376?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2466&q=80";
		}
	} else {
		returnData.largeImage =
			"https://images.unsplash.com/photo-1476081718509-d5d0b661a376?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2466&q=80";
		returnData.smallImage =
			"https://images.unsplash.com/photo-1476081718509-d5d0b661a376?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2466&q=80";
	}
	return returnData;
};

module.exports = GBooksModel;
