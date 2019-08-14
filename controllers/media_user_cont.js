const Media_User = require("../models/media_user_model");
const Media = require("../models/media_model");

// Instantiate the controller object
const Media_UserController = {};

Media_UserController.getAllMU = (req, res) => {
	Media_User.getAllMU()
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

Media_UserController.getMedia = (req, res) => {
	const { user_id } = req.query;
	Media_User.getMedia(user_id)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

Media_UserController.getUsers = (req, res) => {
	const { media_id } = req.query;
	Media_User.getUsers(media_id)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

// Have to finish Media Controller to finish this.
Media_UserController.postMU = (req, res) => {
	const { media_id, user_id, mediaObj } = req.body;
	Media_User.postMU(media_id, user_id)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			// If the media object was not found, insert the media object. 
			if (error.status === 403) {
				return Media.postMedia(mediaObj)
					//reinsert Media_User
					.then(data => {
						return Media_User.postMU(data.data[0].id, user_id);
					})
					.then(data => {
						return res.status(data.status).send(data.data);
					})
					// Catch any error
					.catch(err => {
						return res.status(err.status).send(err.data);
					});
			}

			res.status(error.status).send(error.data);
		});
};

Media_UserController.deleteMU = (req, res) => {
	const { media_id, user_id } = req.body;
	Media_User.deleteMU(media_id, user_id)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

module.exports = Media_UserController;
