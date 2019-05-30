const Media = require("../models/media_model");

// Instantiate the controller object
const MediaController = {};

// Controller method for handling a request for all quotes
MediaController.findAll = (req, res) => {
	let response;
	// Uses the findAll method from Quote
	response = Media.findAll();
	response.then(data => res.status(data.code).send(data.data));
};

MediaController.findByMID = (req, res) => {
	let response;
    const { media_id } = req.params;
	response = Media.findByMID(media_id);
	response.then(data => {
		console.log(data);
		res.status(data.code).send(data.data);
	});
};

MediaController.findByCID = (req, res) => {
    let response;
    const { content_id, media_type} = req.body;
	response = Media.findByCID(content_id, media_type);
	response.then(data => {
		console.log(data);
		res.status(data.code).send(data.data);
	});
};

MediaController.postMedia = (req, res) => {
	let response;
	const { content_id, media_type, media_title } = req.body;
	response =  Media.postMedia(content_id, media_type, media_title);
	response.then(data => {
		console.log(data);
		res.status(data.code).send(data.data);
	});
};

/*
MediaController.postMediaAndRel = (req, res) => {
	let response;
	const { user_name, user_email } = req.body;
	response = User.postUser(user_name, user_email);
	response.then(data => {
		console.log(data);
		res.status(data.code).send(data.data);
	});
};

*/

MediaController.deleteMedia = (req, res) => {
	let response;
	const { media_id } = req.params;
	response = Media.deleteMedia(media_id);
	response.then(data => {
		console.log(data);
		res.status(data.code).send(data.data);
	});
};

MediaController.deleteMediaByCID = (req, res) => {
	let response;
    const {content_id, media_type} = req.body; 
	response = Media.deleteMediaByCID(content_id, media_type);
	response.then(data => {
		console.log(data);
		res.status(data.code).send(data.data);
	});
};


module.exports = MediaController;
