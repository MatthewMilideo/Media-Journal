const Media_Note = require("../models/media_note_model");
const helpers = require("../models/model_helpers")

const Media_NoteController = {};

Media_NoteController.postMediaNote = (req, res) => {
	const {media_id, note_id, mediaObj}
	Media_User.findAll();
	response.then(data => {
		res.status(data.code).send(data.data);
	});
};

module.exports = Media_UserController;
