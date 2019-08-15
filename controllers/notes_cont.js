const Notes = require("../models/notes_model");
const User = require("../models/users_model");
const Media = require("../models/media_model");
const Media_User = require("../models/media_user_model");
const Media_Note = require("../models/media_note_model");

const NotesController = {};

NotesController.getAllNotes = (req, res) => {
	Notes.getAllNotes()
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

NotesController.getUserNotes = (req, res) => {
	const { user_id } = req.query;
	Notes.getUserNotes(user_id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

NotesController.getMediaNotes = (req, res) => {
	const { media_id } = req.query;
	Notes.getMediaNotes(media_id)
		.then(response => res.status(response.status).send(response.data))
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

NotesController.getMediaUserNotes = (req, res) => {
	const { media_id, user_id } = req.query;
	Notes.getMediaUserNotes(media_id, user_id)
		.then(response => res.status(response.status).send(response.data))
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

NotesController.postNote = async (req, res) => {
	const { title, data, user_id, mediaObj } = req.body;
	let media_id;
	let media_userFlag = false;
	let postNoteRes = false;
	try {
		// Validate that the user is in the database.
		let response = await User.getUserID(user_id);
		// Throw an error if the user is not present. Eventually, this should
		// take the user to a sign-up page.
		if (response.status === 404)
			throw {
				status: response.status,
				data: response.data,
				error: response.error
			};
		// This validates the mediaObj before properties are pulled off it.
		if (!mediaObj)
			throw {
				status: 400,
				data: "You must provide a valid mediaObj."
			};


		// Checks if the piece of Media is in the database.
		response = await Media.getMediaCID(mediaObj.CID, mediaObj.type);
		// If the Media is not in the database, add it and a realtion between the media and
		// the user.
		if (response.status === 404) {
			response = await Media.postMedia(mediaObj);
			media_id = response.data[0].id;
			response = await Media_User.postMU(media_id, user_id);
			media_userFlag = true;
		}
		// If the media exists, verify that there is a Media_User relation,
		// and add one if it is not present.
		else {
			//check this
			media_id = response.data[0].id;
			response = await Media_User.getMU(media_id, user_id);
			if (response.status === 404) {
				response = await Media_User.postMU(media_id, user_id);
				media_userFlag = true;
			}
		}
		// Post the Note
		postNoteRes = await Notes.postNote(title, data, user_id);
		// Post a Note Media realtion
		response = await Media_Note.postMN(postNoteRes.data[0].id, media_id);
	} catch (error) {
		try {
			if (media_userFlag === true) {
				await Media_User.deleteMU(media_id, user_id);
			}
			if (postNoteRes !== false) {
				await Notes.deleteNote(postNoteRes.data[0].id);
			}
		} catch (error) {
			return  res.status(error.status).send(error.data);
		}
		return res.status(error.status).send(error.data);
	}

	res.status(postNoteRes.status).send(postNoteRes.data);
};

NotesController.editNote = (req, res) => {
	const { note_id, note_title, note_data } = req.body;
	Notes.editNote(note_id, note_title, note_data)
		.then(response => res.status(response.status).send(response.data))
		.catch(error => res.status(error.status).send(error.message));
};

NotesController.deleteNote = (req, res) => {
	const { note_id } = req.body;
	Notes.deleteNote(note_id)
		.then(response => {
			res.status(response.status).send(response.data)
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

module.exports = NotesController;