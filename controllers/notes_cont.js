const NoteService = require("../services/NoteService");
const MediaService = require("../services/MediaService");
const MediaNoteService = require("../services/MediaNoteService");

const NotesController = {};

NotesController.editNote = (req, res) => {
	const { id, title, data, addTags, rmTags, user_id } = req.body;
	NoteService.editNote(id, title, data, addTags, rmTags, user_id)
		.then(response => res.status(response.status).send(response.data))
		.catch(error => res.status(error.status).send(error.message));
};

NotesController.postNote = async (req, res) => {
	const { title, data, user_id, mediaObj, tags } = req.body;
	NoteService.postNoteAll(title, data, user_id, mediaObj, tags)
		.then(response => res.status(response.status).send(response.data))
		.catch(error => res.status(error.status).send(error.message));
};

NotesController.postMediaUser = async (req, res) => {
	const { user_id, mediaObj } = req.body;
	MediaService.postMediaAndMU(mediaObj, user_id)
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
