const db = require("../db/index.js");
const helpers = require("./model_helpers");

const User = {};

User.errors = {
	"23505": {
		status: 409,
		message: "That username or email is already in use."
	},
	"23503": { status: 403, message: "Foreign Key Constraint" }
};

User.query = async (query, values = null) => {
	let dbRes;
	try {
		dbRes = await db.query(query, values);
	} catch (err) {
		let errArr = Object.keys(User.errors);

		for (let i = 0; i < errArr.length; i++) {
			let { status, message } = User.errors[errArr[i]];
			if (err.code === errArr[i]) return helpers.modelRet(status, message, err);
		}
		return helpers.modelRet(500, "There was an error ", err);
	}
	//console.log('dbRes', dbRes);
	// Checks if any entries were found.
	return dbRes.rowCount === 0
		? helpers.modelRet(204, "No entry found", dbRes)
		: helpers.modelRet(200, "Success", dbRes);
};

// Returns all Users.
User.findAll = async () => {
	return User.query("SELECT * FROM users", null);
};

// Returns User given their email.
User.findByUsername = async user_name => {
	if (!helpers.checkParams([user_name]))
		return helpers.modelRet(406, "Must provide a valid user_name", null);
	return User.query("SELECT * FROM users WHERE user_name = $1", [user_name]);
};

// Returns User given their email.
User.findByEmail = async user_email => {
	if (!helpers.checkParams([user_email]))
		return helpers.modelRet(406, "Must provide a valid user_email.", null);
	return User.query("SELECT * FROM users WHERE user_email = $1", [user_email]);
};

// Logs a User In
User.login = async (user_email, password) => {
	let params = [user_email, password];
	// Validates Params
	if (!helpers.checkParams(params))
		return helpers.modelRet(406, "Must provide a user_name and password", null);
	return User.query(
		"SELECT * FROM users WHERE user_email = $1 AND password = crypt($2, password)",
		params
	);
};

User.postUser = async (user_name, user_email, password) => {
	let params = [user_name, user_email, password];
	if (helpers.checkParams(params) === false)
		return helpers.modelRet(406, "Must provide a valid user_name", null);
	return User.query(
		`INSERT INTO users (user_name, user_email, password) VALUES ($1, $2, crypt($3, gen_salt('bf', 8))) RETURNING user_id, user_name, user_email`,
		params
	);
};

User.editUser = async (user_id, user_name, user_email) => {
	// Checks if the id paramter is an int
	if (!helpers.checkParamsInt([user_id]))
		return helpers.modelRet(406, "ID must be an integer", null);
	// If both undefined.
	if (user_name === undefined && user_email === undefined)
		return helpers.modelRet(406, "Missing Params", null);
	let dbRes;
	let query;
	let values;
	// If it has user-name and user-email set query and values
	if (user_name !== undefined && user_email !== undefined) {
		query =
			"UPDATE users SET user_name = $1, user_email = $2 WHERE user_id = $3";
		values = [user_name, user_email, user_id];
		// if user name ...
	} else if (user_name !== undefined) {
		query = "UPDATE users SET user_name = $1 WHERE user_id = $2";
		values = [user_name, user_id];
		// if email ...
	} else {
		query = "UPDATE users SET user_email = $1 WHERE user_id = $2";
		values = [user_email, user_id];
	}
	return User.query(query, values);
};

User.deleteUser = async user_id => {
	// Checks if the id paramter is an int
	if (!helpers.checkParams([user_id]))
		return helpers.modelRet(406, "ID must be an int.", null);
	return User.query("DELETE FROM users WHERE user_id = $1", [user_id]);
};

module.exports = User;
