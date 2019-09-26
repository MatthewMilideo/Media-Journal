const SearchPageService = require("../services/SearchPageService");
const ItemService = require("../services/ItemService");
const NoteService = require("../services/NoteService");
const TagService = require ('../services/TagService')

const SearchController = {};

SearchController.search = (req, res) => {
	let { user_id, term, page, type } = req.query;
	user_id = parseInt(user_id);
	page = parseInt(page);
	//console.log('in cont'); 
	//console.log(typeof user_id , 'id'); 
	//console.log(typeof user_id , 'page'); 

	SearchPageService.search(user_id, term, type, page)
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
			res.status(500).send(error.data);
		});
};

SearchController.getNotesMedia = (req, res) => {
	let { IDs } = req.query;
	IDs = JSON.parse(IDs);

	NoteService.clientGetNotesMedia(IDs)
		.then(response => {

			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(500).send(error);
		});
};

SearchController.getNotesUser = (req, res) => {
	let { user_id } = req.query;

	NoteService.clientGetNotesUser(user_id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(500).send(error);
		});
};

SearchController.searchTags = (req, res) =>{
	let {string} = req.query;
	TagService.searchByTitle(string)
	.then(response => {

		res.status(response.status).send(response.data);
	})
	.catch(error => {
		res.status(error.status).send(error.data);
	});
}

module.exports = SearchController;
