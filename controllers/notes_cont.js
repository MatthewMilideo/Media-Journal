const Notes = require("../models/notes_model");

const NoteService = require("../services/NoteService");
const MediaNoteService = require("../services/MediaNoteService");

const NotesController = {};

NotesController.editNote = (req, res) => {
	const { id, title, data } = req.body;
	NoteService.editNote(id, title, data)
		.then(response => res.status(response.status).send(response.data))
		.catch(error => res.status(error.status).send(error.message));
};

NotesController.postNote = async (req, res) => {
	const { title, data, user_id, mediaObj } = req.body;
	NoteService.ClientPostNoteAll(title, data, user_id, mediaObj)
		.then(response => res.status(response.status).send(response.data))
		.catch(error => res.status(error.status).send(error.message));
};

NotesController.deleteMN = (req, res) => {
	const { media_id, note_id, user_id } = req.body;
	MediaNoteService.deleteMN(media_id, note_id, user_id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

module.exports = NotesController;
