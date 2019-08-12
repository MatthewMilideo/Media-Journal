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

MediaController.getUserMedia = (req, res) => {
	const {user_id} = req.query; 
	Media.getAllMedia()
		.then(response => {
			res.status(response.status).send(response.data);
		})
		// This catch should happen if there is an error calling Note.findAll, not an error in Notes.findAll
		.catch(error => {
			res.status(400).send(error.message);
		});
};


/*

// Controller method for handling a request for all quotes
MediaController.findAll = (req, res) => {
	let response;
	// Uses the findAll method from Quote
	response = Media.findAll();
	response.then(res=> res.status(res.status).send(res.data.rows));
};

MediaController.findByMID = (req, res) => {
	let response;
    const { media_id } = req.params;
	response = Media.findByMID(media_id);
	response.then(res=> {
		console.log(data);
		res.status(res.status).send(res.data.rows);
	});
};

MediaController.findByCID = (req, res) => {
    let response;
    const { content_id, media_type} = req.body;
	response = Media.findByCID(content_id, media_type);
	response.then(res=> {
		console.log(data);
		res.status(res.status).send(res.data.rows);
	});
};

MediaController.bulkFindByCID = (req, res) => {
    let response;
	const { content_ids, media_type} = req.body;
	console.log('body', req.body, 'params', req.params);
	response = Media.bulkFindByCID(content_ids, media_type);
	response.then(res=> {
		console.log(res);
		res.status(res.status).send(res.data.rows);
	});
};

MediaController.postMedia = (req, res) => {
	let response;
	const { content_id, media_type, media_title } = req.body;
	response =  Media.postMedia(content_id, media_type, media_title);
	response.then(res=> {
		console.log(data);
		res.status(res.status).send(res.data.rows);
	});
};


MediaController.postMediaAndRel = (req, res) => {
	let response;
	const { user_name, user_email } = req.body;
	response = User.postUser(user_name, user_email);
	response.then(res=> {
		console.log(data);
		res.status(res.status).send(res.data.rows);
	});
};



MediaController.deleteMedia = (req, res) => {
	let response;
	const { media_id } = req.params;
	response = Media.deleteMedia(media_id);
	response.then(res=> {
		console.log(data);
		res.status(res.status).send(res.data.rows);
	});
};

MediaController.deleteMediaByCID = (req, res) => {
	let response;
    const {content_id, media_type} = req.body; 
	response = Media.deleteMediaByCID(content_id, media_type);
	response.then(res=> {
		console.log(data);
		res.status(res.status).send(res.data.rows);
	});
};

*/


module.exports = MediaController;
