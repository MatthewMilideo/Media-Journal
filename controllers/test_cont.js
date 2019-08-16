const SearchPageService = require("../services/SearchPageService");

const TestController = {};

TestController.searchPage = (req, res) => {
	let { term, page } = req.query;
	SearchPageService.search(term, page)
		.then(response => {
			//res.status(response.status).send(response.data);
		})
		.catch(error => {
			//res.status(error.status).send(error.data);
		});
};

module.exports = TestController;
