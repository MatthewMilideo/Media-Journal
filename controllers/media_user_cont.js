const Media_User = require("../models/media_user_model");
const helpers = require("../models/model_helpers");

// Instantiate the controller object
const Media_UserController = {};

Media_UserController.getMedia = (req, res) => {
	const { user_id } = req.query;
	if (helpers.checkParamsInt(user_id) === false)
		return res.status(400).send('You must provide a valid user_id.');
	Media_User.getMedia(user_id)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.message);
		});
};

Media_UserController.getUsers = (req, res) => {
	const { media_id } = req.query;
	if (helpers.checkParamsInt(media_id) === false)
		return res.status(400).send('You must provide a valid media_id.');
	Media_User.getUsers(media_id)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.message);
		});
};

// Undefined Below

Media_UserController.postMU = (req, res) => {
	const { media_id } = req.query;
	Media_User.find_MediaforUser(media_id, user_id)
		.then(data => {
			res.status(data.code).send(data.data);
		})
		.catch(error => {
			res.status(400).send(error.message);
		});
};

Media_UserController.deleteMU = (req, res) => {
	const { media_id } = req.query;
	Media_User.find_MediaforUser(media_id, user_id)
		.then(data => {
			res.status(data.code).send(data.data);
		})
		.catch(error => {
			res.status(400).send(error.message);
		});
};

module.exports = Media_UserController;
