const axios = require("axios");

const helpers = require("./helpers");
const KEY = process.env.TMDB_KEY;
const TMDB = axios.create({
	baseURL: "https://api.themoviedb.org/3",
	params: {
		api_key: KEY
	}
});

const TMDBModel = {};

TMDBModel.searchMovie = function(term, page = 1) {
	if (!helpers.checkArgs([page], [term]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid term and page."
		});
	return TMDB.get("search/movie", { params: { query: term, page } })
		.then(response => {
			if (response.data.results.length === 0) {
				return Promise.reject({
					status: 404,
					data: "The requested movies were not found."
				});
			}
			return { status: 200, data: response.data };
		})
		.catch(error => {
			if (!error.status) {
				throw { status: error.response.status, data: error.message, error };
			} else {
				throw { status: error.status, data: error.data };
			}
		});
};

TMDBModel.searchTV = async function(term, page = 1) {
	if (!helpers.checkArgs([page], [term]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid term and page."
		});
	return TMDB.get("search/tv", { params: { query: term , page} })

		.then(response => {
			if (response.data.results.length === 0) {
				return Promise.reject({
					status: 404,
					data: "The requested tv shows were not found."
				});
			}
			return { status: 200, data: response.data };
		})
		.catch(error => {
			if (!error.status) {
				throw { status: error.response.status, data: error.message, error };
			} else {
				throw { status: error.status, data: error.data };
			}
		});
};

module.exports = TMDBModel;
