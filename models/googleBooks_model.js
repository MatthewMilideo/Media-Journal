import axios from 'axios';

const KEY = process.env.GBOOKS_KEY; 

export default axios.create({
    baseURL: 'https://www.googleapis.com/books/v1/volumes', 
    params: {
        key: KEY,
    }
})

const TMDBModel = {};

TMDBModel.searchMovie = function(term, page) {
    return bookDB.get("", { params: {} });
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

