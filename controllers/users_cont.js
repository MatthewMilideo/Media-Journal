const User = require("../models/users_model");
//const T = require("../client/src/actions/types");

const loginEmailErr = "CLIENT_ERR_LOGIN_EMAIL";
const loginEmailPassErr = "CLIENT_ERR_LOGIN_EMAILPASS";

const regEmailErr = "CLIENT_ERR_REG_EMAIL";
const regUserErr = "CLIENT_ERR_REG_USER";
const regEmailUserErr = "CLIENT_ERR_REG_EMAILUSER";
const regErr = "CLIENT_ERR_REG";

// Instantiate the controller object
const userController = {};

// Controller method for handling a request for all quotes
userController.findAll = (req, res) => {
	let response = User.findAll();
	response.then(res => {
		// console.log(res);
		res.status(res.status).send(res.data);
	});
};

userController.findByID = (req, res) => {
	const { user_id } = req.params;
	let response = User.findByID(user_id);
	response.then(res => {
		console.log(res);
		res.status(res.status).send(res.data);
	});
};

// The Client uses this function to verify email addresses. 
userController.findByEmail = async (req, res) => {
	const { user_email } = req.body;
	let response = await User.findByEmail(user_email);
	let { status, data } = response;
	res.status(status).send(data);
};

// The client uses this function to verify users.
userController.findByUsername = async (req, res) => {
	const { user_name } = req.body;
	let response = await User.findByUsername(user_name);
	console.log(response);
	let { status, data } = response;
	res.status(status).send(data);
};

// The client uses this function to verify users.
userController.login = async (req, res) => {
	const { user_email, password } = req.body;
	console.log(user_email, password);
	// Check if email is present in the list. I do this so I can tell the
	// user if this email exists in the DB.
	let response = await User.findByEmail(user_email);
	let { status } = response;
	if (status !== 200) {
		res.status(203).send(loginEmailErr);
		return;
	}

	// Once we see that the email exists we run the login function. If this fails
	// we tell the user there is an incorrect Email / Password combination.
	response = await User.login(user_email, password);
	status = response.status;
	if (status !== 200) {
		res.status(203).send(loginEmailPassErr);
		return;
	}

	// Take all the data besides the password.
	let returnData = {
		user_id: response.data.rows[0].user_id,
		user_name: response.data.rows[0].user_name,
		user_email: response.data.rows[0].user_email
	};

	// Send data to client.
	res.status(200).send(returnData);
};

userController.register = async (req, res) => {
	const { user_email, user_name, password } = req.body;
	console.log("params", user_email, user_name, password);
	let returnData = null;
	let status = null;

	/*
	let response = await User.findByEmail(user_email);
	console.log("status 1 ", response.status);
	if (response.status !== 204) {
		returnData = regEmailErr;
		status = 406;
	}

	response = await User.findByUsername(user_name);
	console.log("status 2 ", response.status);
	if (response.status !== 204) {
		status = 406;
		returnData === null
			? (returnData = regUserErr)
			: (returnData = regEmailUserErr);
	}
	
	console.log("returnData", returnData);
	if (returnData === null) {
		*/
		response = await User.postUser(user_name, user_email, password);
		status = response.status;
		//console.log(response);
		if (status !== 200) {
			//console.log("in second if response");
			res.status(status).send(regErr);
			return;
		}

		returnData = {
			user_id: response.data.rows[0].user_id,
			user_name: response.data.rows[0].user_name,
			user_email: response.data.rows[0].user_email
		};
//}

	res.status(status).send(returnData);
};

userController.postUser = (req, res) => {
	const { user_name, user_email, password } = req.body;
	let response = User.postUser(user_name, user_email, password);
	response.then(res => {
		res.status(res.code).send(res.data);
	});
};

userController.editUser = (req, res) => {
	const { user_id } = req.params;
	const { user_name, user_email } = req.body;
	let response = User.editUser(user_id, user_name, user_email);
	response.then(res => {
		res.status(res.code).send(res.data);
	});
};

userController.deleteUser = (req, res) => {
	const { user_id } = req.params;
	let response = User.deleteUser(user_id);
	response.then(res => {
		res.status(res.code).send(res.res);
	});
};

module.exports = userController;
