const Notes = require("../models/notes_model");
const Media_Note = require("../models/media_note_model.js");
const helpers = require("../models/model_helpers");

const errorObj = {
	"23503": {
		status: 400,
		message: "There was an error becasue of a Foreign Key Constraint"
	},
	"42703": {
		status: 400,
		message: "There was an error because a specified column does not exist!"
	}
};

const errorHandling = error => {
	let response = errorObj[error.code];
	return !response ? { status: 500, message: "There was an error" } : response;
};

// Instantiate the controller object
const NotesController = {};

// Controller method for handling a request for all quotes
NotesController.getAllNotes = (req, res) => {
	Notes.getAllNotes()
		.then(response => {
			res.status(response.status).send(response.data);
		})
		// This catch should happen if there is an error calling Note.findAll, not an error in Notes.findAll
		.catch(error => {
			res.status(400).send(error.message);
		});
};

NotesController.getUserNotes = (req, res) => {
	const { user_id } = req.query;
	if (helpers.checkParamsInt(user_id) === false) {
		res.status(400).send("The user_id must be an integer.");
		return;
	}
	Notes.getUserNotes(user_id)
		.then(response => res.status(response.status).send(response.data))
		// This catch should happen if there is an error calling Note.findAll, not an error in Notes.findAll
		.catch(error => {
			console.log("Error in NotesController.getUserNotes:", error);
			res.status(500).send(error.message);
		});
};

NotesController.getMediaNotes = (req, res) => {
	const { media_id } = req.query;
	if (helpers.checkParamsInt(media_id) === false) {
		res.status(400).send("The media_id must be an integer.");
		return;
	}
	Notes.getMediaNotes(media_id)
		.then(response => res.status(response.status).send(response.data))
		.catch(error => {
			console.log("Error in NotesController.getMediaNotes:", error);
			res.status(500).send(error.message);
		});
};

NotesController.getMediaUserNotes = (req, res) => {
	const { media_id, user_id } = req.query;
	if (helpers.checkParamsInt([media_id, user_id]) === false) {
		res.status(400).send("The media_id and user_id must be integers.");
		return;
	}
	//console.log(media_id, user_id);
	Notes.getMediaUserNotes(media_id, user_id)
		.then(response => res.status(response.status).send(response.data))
		.catch(error => {
			console.log("Error in NotesController.getMediaUserNotes:", error);
			res.status(500).send(error.message);
		});
};

NotesController.postNote = (req, res) => {
	const { note_title, note_data, media_id, user_id } = req.body;
	// Check that data is okay 
	if (helpers.checkParamsInt([media_id, user_id]) === false) {
		res.status(400).send("The media_id and user_id must be integers");
		return;
	}
	if (!note_title || !note_data) {
		res.status(400).send("The note_title and note_data must be defined");
		return;
	}
	// Insert Post
	Notes.postNote(note_title, note_data, user_id)
		.then(response => {
			const note_id = response.data[0].id;

			addMediaNote(note_id, media_id)
				.then(result => {
					if (result.status === 201) {
						res.status(201).send(response.data);
					} else {
						res.status(result.status).send(result.data);
						// I probably have to remove the note if it doesn't get added to this table but I am going to table
						// working on that logic for now.
					}
				})
				.catch(error => {});
		})
		.catch(error => {
			console.log("Error in NotesController.postNote:", error);
			res.status(500).send(error.message);
		});
};

const addMediaNote = (note_id, media_id) => {
	if (helpers.checkParamsInt([note_id, media_id]) === false)
		return { status: 400, data: "The note_id and media_id must be integers." };
	return Media_Note.postMediaNote(note_id, media_id)
		.then(response => {
			return { status: response.status, data: response.data };
		})
		.catch(error => {
			throw error;
		});
};

NotesController.editNote = (req, res) => {
	const { note_id, note_title, note_data } = req.body;
	if (
		helpers.checkParamsInt([note_id]) === false &&
		(!note_title || !note_data)
	) {
		res
			.status(400)
			.send(
				"The note_id must be an integer, and the note_title and note_data must be defined and non-empty."
			);
		return;
	}
	Notes.editNote(note_id, note_title, note_data)
		.then(response => res.status(response.status).send(response.data))
		.catch(error => res.status(500).send(error.message));
};

NotesController.deleteNote = (req, res) => {
	const { note_id } = req.params;

	if (helpers.checkParamsInt([note_id]) === false)
		res.status(400).send("The note_id must be an integer");

	Notes.deleteNote(note_id)
		.then(response => res.status(response.status).send(response.data))
		.catch(error => {
			res.status(500).send(error.message);
		});
};

module.exports = NotesController;
