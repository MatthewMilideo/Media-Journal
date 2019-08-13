const Media = require("../models/media_model");

// Instantiate the controller object
const MediaController = {};

// Controller method for handling a request for all quotes

MediaController.getAllMedia = (req, res) => {
	Media.getAllMedia()
		.then(response => {
			res.status(response.status).send(response.data);
		})
		// This catch should happen if there is an error calling Note.findAll, not an error in Notes.findAll
		.catch(error => {
			res.status(400).send(error.message);
		});
};

const validTypes = ["MOVIE", "TV_SEASON", "BOOK", "GAME"];

MediaController.getMediaCID = (req, res) => {
	const { CID, type } = req.query;
	if (!validTypes.includes(type) || !CID) {
		return res.status(400).send("The title, and cID, must be provided.");
	}
	Media.getMediaCID(CID, type)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.message);
		});
};
MediaController.postMedia = (req, res) => {
	const { title, type, CID } = req.body;
	if (!title || !validTypes.includes(type) || !CID) {
		return res.status(400).send("The title, type, cID, must be provided.");
	}

	Media.postMedia(title, type, CID)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.message);
		});
};


module.exports = MediaController;
