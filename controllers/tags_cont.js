const Tags = require("../models/tags_model");
const helpers = require("../models/model_helpers");

// Instantiate the controller object
const TagController = {};

// Controller method for handling a request for all Tags
TagController.getAllTags = (req, res) => {
	Tags.getAllTags()
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

TagController.getTagID = (req, res) => {
	const { id } = req.query;
	Tags.getTagID(id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

TagController.postTag = (req, res) => {
	const { title } = req.body;
	Tags.postTag(title)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

TagController.deleteTag = (req, res) => {
	const { id } = req.body;
	Tags.deleteTag(id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

module.exports = TagController;
