const axios = require("axios");

const KEY = process.env.TMDB_KEY;

const TMDB = axios.create({
	baseURL: "https://api.themoviedb.org/3",
	params: {
		api_key: KEY
	}
});

const TMDBModel = {};

TMDBModel.searchMovie = function(term, page) {
	return TMDB.get("search/movie", { params: { query: term, page } })
		.then(data => {
			return data.data;
		})
		.catch(error => {
			throw( {status: error.status, data: error.message, error});
		}); 
};

TMDBModel.searchTV = async function(term) {
	return TMDB.get("search/tv", { params: { query: term } })
		.then(data => {
			return data;
		})
		.catch(error => {
			throw( {status: error.status, data: error.message, error});
		}); 
};

module.exports = TMDBModel;

