const SearchPageService = require("../services/SearchPageService");

const TestController = {};

TestController.searchTMDB = (req, res) => {
	let { user_id, term, page, type } = req.query;
	SearchPageService.searchTMDB(user_id, term, page, type)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

module.exports = TestController;
