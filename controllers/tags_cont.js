const Tags = require("../models/tags_model");
const helpers = require("../models/model_helpers")

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
	if (!helpers.checkParamsInt([id]))
		return res.status(400).send('The id must be provided.');
	Tags.getTagID(id).then(response => {
		res.status(response.status).send(response.data);
	});
};

TagController.postTag = (req, res) => {
	const { title } = req.body;
	if (!helpers.checkParams([title]))
		return res.status(400).send('The title must be provided.');
	Tags.postTag(title)
	.then(response => {
		return res.status(response.status).send(response.data);
	})
	.catch( error => {
		return res.status(error.status).send(error.data);
	})
};

TagController.deleteTag = (req, res) => {
	const { id } = req.body;
	if (!helpers.checkParamsInt([id])) 
		return res.status(400).send('The id must be provided.');
	Tags.deleteTag(id)
	.then(response => {
		return res.status(response.status).send(response.data);
	})
	.catch( error => {
		return res.status(error.status).send(error.data);
	})
};

module.exports = TagController;
