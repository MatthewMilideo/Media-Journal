const Media_Note = require("../models/media_note_model");
const Media = require("../models/media_model");

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
	const {note_id, media_id, mediaObj } = req.body;
	console.log(note_id, media_id);
	Media_Note.postMN(note_id, media_id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			// If the media object was not found, insert the media object.
			if (error.status === 403) {
				return (
					Media.postMedia(mediaObj)
						//reinsert Media_User
						.then(data => {
							return Media_User.postMU(data.data[0].id, note_id);
						})
						// Send Status
						.then(data => {
							return res.status(data.status).send(data.data);
						})
						// Catch any error
						.catch(err => {
							return res.status(err.status).send(err.data);
						})
				);
			}
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
