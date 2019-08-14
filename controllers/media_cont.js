const Media = require("../models/media_model");

// Instantiate the controller object
const MediaController = {};

// Controller method for handling a request for all quotes

MediaController.getAllMedia = (req, res) => {
	Media.getAllMedia()
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};
MediaController.getMediaCID = (req, res) => {
	const { CID, type } = req.query;
	Media.getMediaCID(CID, type)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};
MediaController.postMedia = (req, res) => {
	const { title, type, CID } = req.body;
	Media.postMedia({title, type, CID})
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};
MediaController.deleteMedia = (req, res) => {
	const { type, CID } = req.body;
	Media.deleteMedia(type, CID)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

module.exports = MediaController;
