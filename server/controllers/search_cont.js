const SearchPageService = require("../services/SearchPageService");
const ItemService = require("../services/ItemService");
const NoteService = require("../services/NoteService");
const MediaService = require("../services/MediaService");
const TagService = require("../services/TagService");

const SearchController = {};

SearchController.search = (req, res) => {
	let { user_id, term, page, type } = req.query;;
	page = parseInt(page);

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

SearchController.getMediaUser = (req, res) => {
	let { user_id } = req.query;
	MediaService.getByUserID2(user_id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			console.log(error);
			res.status(500).send(error);
		});
};

SearchController.getNotesByTag = (req, res) => {
	let { tag_ids, user_id } = req.query;
	NoteService.getbyTag(tag_ids, user_id)
		.then(response => {
			console.log("res", response);
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			console.log(error);
			res.status(500).send(error);
		});
};

SearchController.searchTags = (req, res) => {
	let { string } = req.query;
	TagService.searchByTitle(string)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

module.exports = SearchController;
