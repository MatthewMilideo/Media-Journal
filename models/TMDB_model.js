const axios = require("axios");

const helpers = require("./helpers");
const KEY = process.env.TMDB_KEY;
const T = require("../types");

const TMDB = axios.create({
	baseURL: "https://api.themoviedb.org/3"
});

const TMDBModel = {};

TMDBModel.searchMovie = function(term, page = 1) {
	if (!helpers.checkArgs([page], [term]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid term and page."
		});
	return TMDB.get("search/movie", {
		params: { api_key: KEY, query: term, page }
	})
		.then(response => {
			if (response.data.results.length === 0) {
				return Promise.reject({
					status: 404,
					data: "The requested movies were not found."
				});
			}
			response.data = TMDBModel.formatResponse(response.data)
			return { status: 200, data: response.data };
		})
		.catch(error => {
			if (error.response) {
				if (error.response.status === 422) {
					throw {
						status: 400,
						data: "You must provide a valid term and page.",
						error
					};
				} else {
					throw { status: error.response.status, data: error.message, error };
				}
			}
			throw {
				status: error.status,
				data: error.data
			};
		});
};

TMDBModel.searchTV = async function(term, page = 1) {
	if (!helpers.checkArgs([page], [term]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid term and page."
		});
	return TMDB.get("search/tv", { params: { api_key: KEY, query: term, page } })
		.then(response => {
			if (response.data.results.length === 0) {
				return Promise.reject({
					status: 404,
					data: "The requested tv shows were not found."
				});
			}
			response.data = TMDBModel.formatResponse(response.data)
			return { status: 200, data: response.data };
		})
		.catch(error => {
			if (error.response) {
				if (error.response.status === 422) {
					throw {
						status: 400,
						data: "You must provide a valid term and page.",
						error
					};
				} else {
					throw { status: error.response.status, data: error.message, error };
				}
			}
			throw {
				status: error.status,
				data: error.data
			};
		});
};

TMDBModel.getItem = function(id, type) {
	// Configuration
//	console.log(" in get item", id, type);
	let loc = type === T.MOVIE ? `/movie/${id}` : `/tv/${id}`;
	let append_to_response =
		type === T.MOVIE
			? "credits,images,release_dates,releases"
			: "credits,images";

	if (!helpers.checkArgsType([id], [], type)) {
//		console.log("in helpers");
		return Promise.reject({
			status: 400,
			data: "You must provide a valid id and type."
		});
	}

	return TMDB.get(loc, { params: { api_key: KEY, append_to_response } })
		.then(response => {
			return { status: 200, data: response.data };
		})
		.catch(error => {
			if (error.response) {
				throw { status: error.response.status, data: error.message, error };
			}

			throw {
				status: error.status,
				data: error.data
			};
		});
};

TMDBModel.formatResponse = response => {
	//console.log(response);
	response.results = response.results.map(elem => {
	//	console.log(elem.poster_path);
		elem.smallImage = `https://image.tmdb.org/t/p/w45${elem.poster_path}`
		elem.largeImage = `https://image.tmdb.org/t/p/w500${elem.poster_path}`
		if (!elem.poster_path){
	//		console.log('in if');
			elem.smallImage = 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=45&q=80'
			elem.largeImage = 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80'
		}
		
		return elem; 
	});
	return response; 
};

module.exports = TMDBModel;
