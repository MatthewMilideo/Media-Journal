const User = require("../models/users_model");

// Instantiate the controller object
const userController = {};

// Controller method for handling a request for all quotes
userController.findAll = (req, res) => {
	let response;
	// Uses the findAll method from Quote
	response = User.findAll();
	
	response.then(data => {
		console.log(data);
		res.status(data.code).send(data.data)
	}
		);
};

userController.findByID = (req, res) => {
	let response;
	const { user_id } = req.params;
	response = User.findByID(user_id);
	response.then(data => {
		//console.log(data);
		res.status(data.code).send(data.data);
	});
};

userController.postUser = (req, res) => {
	let response;
	const { user_name, user_email } = req.body;
	response = User.postUser(user_name, user_email);
	response.then(data => {
	//	console.log(data);
		res.status(data.code).send(data.data);
	});
};

userController.editUser = (req, res) => {
	let response;
	const { user_id } = req.params;
	const { user_name, user_email } = req.body;
	response = User.editUser(user_id, user_name, user_email);
	response.then(data => {
	//	console.log(data);
		res.status(data.code).send(data.data);
	});
};

userController.deleteUser = (req, res) => {
	let response;
	const { user_id } = req.params;
	response = User.deleteUser(user_id);
	response.then(data => {
//		console.log(data);
		res.status(data.code).send(data.data);
	});
};

module.exports = userController;
