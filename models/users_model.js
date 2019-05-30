const db = require("../db/index.js");


const Proto = require("../models/proto_model");

let User2 = new Proto ('user', null)

const User = {};

// Finds all Users
User.findAll = async () => {
	let dbRes;
	try {
		dbRes = await db.query("SELECT * FROM users ");
	} catch (err) {
		// Catches any currently undefined errors. 
		return {
			message: "There was an error in User.fetchAll",
			code: 500
		};
	}
	// Checks if any entries were found. 
	if (dbRes.rowCount === 0) return { code: 204, data: "No entry found." };
	return {
		code: 200,
		data: dbRes.rows
	};
};

// Fetch a user by ID
User.findByID = async user_id => {
	// Checks if the ID is an integer. 
	if (Number.isInteger(parseInt(user_id)) === false)
		return { code: 406, data: "ID must be an integer" };

	let dbRes;
	try {
		dbRes = await db.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
		
	} catch (err) {
		// Catches any currently undefined errors. 
		return {
			code: 500,
			message: "There was an error in User.findByID",
			error: err
		};
	}
	// Checks if any entries were found. 
	if (dbRes.rows.length === 0) return { code: 204, data: "No entry found." };
	return {
		code: 200,
		data: dbRes.rows
	};
};

// Posts a new user. 
User.postUser = async (user_name, user_email) => {
	// Makes sure the request contains a user_name and user_email
	if (
		user_name === undefined ||
		user_email === undefined ||
		(user_email === undefined && user_name === undefined)
	)
		return { code: 406, data: "Missing Parameters" };

	let dbRes;
	try {
		dbRes = await db.query(
			"INSERT INTO users (user_name, user_email) VALUES ($1, $2) RETURNING user_id, user_name, user_email",
			[user_name, user_email]
		);
	} catch (err) {
		// Checks if the username and email are already used. 
		if (err.code === "23505")
			return {
				message: "That username or email is already in use.",
				code: 409,
				error: err
			};
		// Generic Error 
		return {
			message: "Error in User.postUser",
			code: 500,
			error: err
		};
	}
	return {
		code: 201,
		data: dbRes.rows[0]
	};
};
// Edits an existing user. 
User.editUser = async (user_id, user_name, user_email) => {
	// Checks if the id paramter is an int 
	if (Number.isInteger(parseInt(user_id)) === false)
		return { code: 406, data: "ID must be an integer" };
	// Checks if it is missing both paramters 
	if (user_name === undefined && user_email === undefined)
		return { code: 406, data: "Missing Parameters" };

	let dbRes;
	let query;
	let values; 
	// If it has user-name and user-email set query and values 
	if (user_name !== undefined && user_email !== undefined) {
		query =
			"UPDATE users SET user_name = $1, user_email = $2 WHERE user_id = $3";
		values = [ user_name, user_email, user_id]; 
	// if user name ... 
	} else if (user_name !== undefined) {
		query = "UPDATE users SET user_name = $1 WHERE user_id = $2";
		values = [ user_name, user_id]
	// if email ...
	} else {
		query = "UPDATE users SET user_email = $1 WHERE user_id = $2";
		values = [ user_email, user_id]
	}
	try {
		dbRes = await db.query(query, values);
	} catch (err) {
		// Return if email and name are not unique 
		if (err.code === "23505") return {code: 409, data: 'Email and Username must be unique values.'}
		return {
			code: 500, 
			message: "Error in third branch of User.editUser",
			error: err
		};
	}
	// If putting into undefined entry 
	if(dbRes.rowCount === 0 ) return { code: 204, data: 'Entry not found'}

	return {
		code: 200,
		data: dbRes.rows
	};
};

User.deleteUser = async (user_id) => {
		// Checks if the id paramter is an int 
	if (Number.isInteger(parseInt(user_id)) === false)
		return { code: 406, data: "ID must be an integer" };
	let dbRes;
	try {
		dbRes = await db.query("DELETE FROM users WHERE user_id = $1", [user_id]);
	} catch (err) {
		if ( err.code ==='23503') return {code: 403, data:'Foreign Key Constraint'}
		return {
			code: 500, 
			message: "Error in third branch of User.editUser",
			error: err
		};
	}
	// If putting into undefined entry 
	if(dbRes.rowCount === 0 ) return { code: 204, data: 'Entry not found'}
	return {code: 200, data: dbRes}
};

module.exports = User2;
