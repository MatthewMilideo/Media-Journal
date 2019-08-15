const User = require("../models/users_model");

// Instantiate the controller object
const userController = {};

// Controller method for handling a request for all quotes
userController.getAllUsers = (req, res) => {
	User.getAllUsers()
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

userController.getUserID = (req, res) => {
	const { id } = req.query;
	
	User.getUserID(id)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

// The Client uses this function to verify email addresses.
userController.getUserEmail = async (req, res) => {
	const { email } = req.query;
	User.getUserEmail(email)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

userController.postUser = async (req, res) => {
	const { email, name } = req.body;
	User.postUser(email, name)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

userController.editUser = (req, res) => {
	const { id, email, name } = req.body;
	User.editUser(id, email, name)
		.then(data => {
			res.status(data.status).send(data.data);
		})
		.catch(error => {
			res.status(error.status).send(error.data);
		});
};

userController.deleteUser = (req, res) => {
	const { id } = req.body;
	User.deleteUser(id)
	.then(data => {
		res.status(data.status).send(data.data);
	})
	.catch(error => {
		res.status(error.status).send(error.data);
	});
};

module.exports = userController;
