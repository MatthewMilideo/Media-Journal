const Media_User = require("../models/media_user_model");
const helpers = require("../models/model_helpers");

// Instantiate the controller object
const Media_UserController = {};

Media_UserController.getMedia = (req, res) => {
	const { user_id } = req.query;
	if (helpers.checkParamsInt(user_id) === false)
		return res.status(400).send("You must provide a valid user_id.");
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
		return res.status(400).send("You must provide a valid media_id.");
	Media_User.getUsers(media_id)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.message);
		});
};

const checkMediaObj = obj => {
	const typeArr = ["MOVIE", "TV_SEASON", "BOOK", "GAME"];
	if (!obj) return false;
	if (!obj.type) return false;
	if (!typeArr.includes(obj.type)) return false;
	if (!obj.title) return false;
	if (!obj.CID) return false;
	return true;
};

// Have to finish Media Controller to finish this.
Media_UserController.postMU = (req, res) => {
	const { media_id, user_id, mediaObj } = req.body;
	if (!helpers.checkParamsInt(media_id, user_id))
		return res
			.status(400)
			.send("You must provide a valid media_id and user_id.");
	if (!checkMediaObj(mediaObj))
		return res.status(400).send("You must provide a valid mediaObj");
	Media_User.postMU(media_id, user_id)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.message);
		});
};

Media_UserController.deleteMU = (req, res) => {
	const { media_id, user_id } = req.body;
	if (!helpers.checkParamsInt([media_id, user_id]))
		return res
			.status(400)
			.send("You must provide a valid media_id and user_id.");
	Media_User.deleteMU(media_id, user_id)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.message);
		});
};

module.exports = Media_UserController;
