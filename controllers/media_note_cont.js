const Media_Note = require("../models/media_note_model");

// Instantiate the controller object
const Media_NoteController = {};

// Stub - This function is not implemented correctly 
Media_NoteController.postMediaNote = (req, res) => {
	let response;
	// Uses the findAll method from Quote
	response = Media_User.findAll();
	response.then(data => {
		res.status(data.code).send(data.data);
	});
};

module.exports = Media_UserController;
