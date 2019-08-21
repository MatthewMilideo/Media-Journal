const Media_Note = require("../models/media_note_model");

const Media_NoteController = {};

Media_NoteController.getAllMN = (req, res) =>{
	Media_Note.getAllMN()
	.then( response => {
		res.status(response.status).send(response.data);
	})
	.catch(error =>{
		res.status(error.status).send(error.data)
	})
}

Media_NoteController.getMediaMN = (req, res) =>{
	const {note_id} = req.query;
	Media_Note.getMediaMN(note_id)
	.then( response => {
		res.status(response.status).send(response.data);
	})
	.catch(error =>{
		res.status(error.status).send(error.data)
	})
}

Media_NoteController.getNoteMN = (req, res) =>{
	const {media_id} = req.query;
	Media_Note.getNoteMN(media_id)
	.then( response => {
		res.status(response.status).send(response.data);
	})
	.catch(error =>{
		res.status(error.status).send(error.data)
	})
}

Media_NoteController.postMN = (req, res) => {
	const {note_id, media_id,} = req.body;
	Media_Note.postMN(note_id, media_id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

Media_NoteController.deleteMN = (req, res) =>{
	const {media_id, note_id} = req.body;
	Media_Note.deleteMN(media_id, note_id)
	.then( response => {
		res.status(response.status).send(response.data);
	})
	.catch(error =>{
		res.status(error.status).send(error.data)
	})
}

module.exports = Media_NoteController;
