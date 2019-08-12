const Notes_Tag = require("../models/notes_tag_model");

// Instantiate the controller object
const Notes_TagController = {};

// Controller method for handling a request for all quotes
Notes_TagController.findAll = (req, res) => {
	let response;
	// Uses the findAll method from Quote
	response = Notes_Tag.findAll();
	response.then(data => {
		console.log(data);
		res.status(data.code).send(data.data);
	});
};

Notes_TagController.findByNID = (req, res) => {
	let response;
	const { note_id } = req.body;
	response = Notes_Tag.findByNID(note_id);
	response.then(data => {
		//console.log(data);
		res.status(data.code).send(data.data);
	});
};

Notes_TagController.findByTID = (req, res) => {
	let response;
	const { tag_id } = req.body;
	response = Notes_Tag.findByTID(tag_id);
	response.then(data => {
		//console.log(data);
		res.status(data.code).send(data.data);
	});
};

Notes_TagController.findNT = (req, res) => {
	let response;
	const { tag_id, note_id} = req.body;
	response = Notes_Tag.findNT(tag_id, note_id);
	response.then(data => {
		console.log(data);
		res.status(data.code).send(data.data);
	});
};

Notes_TagController.postNT = (req, res) => {
	let response;
	const { tag_id, note_id } = req.body;
	console.log(req.body);
	response = Notes_Tag.postNT(tag_id, note_id);
	response.then(data => {
		console.log(data);
		res.status(data.code).send(data.data);
	});
};

Notes_TagController.deleteNT = (req, res) => {
	let response;
	const { tag_id, note_id } = req.body;
	response = Notes_Tag.deleteNT(tag_id, note_id);
	response.then(data => {
				console.log(data);
		res.status(data.code).send(data.data);
	});
};

module.exports = Notes_TagController;
