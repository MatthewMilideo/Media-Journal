const TMDB = require("../models/TMDB_model");
const helpers = require("../models/helpers");
const types = require("../types");

const SearchPageService = {};

SearchPageService.search = async function(term, page) {
	console.log("in service", term);
	if (!helpers.checkArgs([], [term]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid search term."
		});
	if (!page) page = 1;



	TMDB.searchMovie(term, page)
		.then(data => {
            let returnObj = {};
            returnObj.keysArr = [];
			const { results } = data;
			results.forEach(elem => {
				elem.type = types.MOVIE;
				returnObj[elem.id] = elem;
				returnObj.keysArr.push(elem.id);
            });
            return returnObj;
		})
		.then(data => {
            console.log(' in second then:', data)

        })
		.catch(error => {
			console.log(error);
		});
};

module.exports = SearchPageService;
