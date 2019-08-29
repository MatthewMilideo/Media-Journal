const SearchPageService = require("../services/SearchPageService");
const ItemService = require("../services/ItemService");

const SearchController = {};

SearchController.searchTMDB = (req, res) => {
	let { user_id, term, page, type } = req.query;
	SearchPageService.searchTMDB(user_id, term, type, page)
		.then(response => {
			console.log(response.data);
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

SearchController.searchGBooks = (req, res) => {
	let { user_id, term, index } = req.query;
	SearchPageService.searchGBooks(user_id, term, index)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

SearchController.getItem = (req, res) => {
	let { user_id, CID, type } = req.query;
	ItemService.get(user_id, CID, type)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

module.exports = SearchController;
