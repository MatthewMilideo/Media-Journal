const Tag = require("../models/tags_model");

// Instantiate the controller object
const TagController = {};

// Controller method for handling a request for all Tags
TagController.findAll = (req, res) => {
	let response;
	response = Tag.findAll();
	response.then(data => res.status(data.code).send(data.data));
};

// Finds tag given a tagID
TagController.findByID = (req, res) => {
	let response;
	const { tag_id } = req.params;
	response = Tag.findByID(tag_id);
	response.then(data => {
		console.log(data);
		res.status(data.code).send(data.data);
	});
};

TagController.postTag = (req, res) => {
	let response;
	const { tag_name,  } = req.body;
	response = Tag.postTag(tag_name);
	response.then(data => {
	//	console.log(data);
		res.status(data.code).send(data.data);
	});
};

TagController.deleteTag = (req, res) => {
	let response;
	const { tag_id } = req.params;
	response = Tag.deleteTag(tag_id);
	response.then(data => {
//		console.log(data);
		res.status(data.code).send(data.data);
	});
};

module.exports = TagController;
