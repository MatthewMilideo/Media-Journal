const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const helpers = require("./helpers");

const User = {};

// Returns all Users.
User.getAllUsers = () => {
	return database
		.from("users")
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested users were not found." };
			return { status: 200, data: data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

// Returns User given their email.
User.getUserID = id => {
	if (!helpers.checkArgs([id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid id."
		});
	return database("users")
		.where({ id })
		.select()
		.then(data => {
			if (data.length === 0)
				return ( { status: 404, data: "The requested user was not found." });
			return { status: 200, data: data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

User.getUserEmail = email => {
	if (!helpers.checkArgs([], [email]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid email."
		});
	return database("users")
		.where({ email })
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested user was not found." };
			return { status: 200, data: data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

// Logs a User In
User.postUser = async (email, name) => {
	if (!helpers.checkArgs([], [email, name]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid email and name."
		});
	return database("users")
		.insert({ email, name }, ["id", "email", "name"])
		.then(data => {
			return { status: 201, data: data };
		})
		.catch(error => {
			if (error.constraint === "users_email_unique")
				throw {
					status: 409,
					data:
						"There was a conflict during insertion. You must provide a unique email.",
					error
				};
			throw { status: 400, data: error.message, error };
		});
};

User.editUser = async (id, email, name) => {
	if (!helpers.checkArgs([id], [email, name]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid id, email, and name."
		});
	return database("users")
		.returning("*")
		.where({ id })
		.update({ email, name })
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested user was not found." };
			return { status: 200, data: data };
		})
		.catch(error => {
			if (error.constraint === "users_email_unique")
				throw {
					status: 409,
					data:
						"There was a conflict during insertion. You must provide a unique email.",
					error
				};
			throw { status: 400, data: error.message, error };
		});
};

User.deleteUser = id => {
	if (!helpers.checkArgs([id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid id."
		});
	return database("users")
		.returning("*")
		.where({ id })
		.del()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested user was not found." };
			return { status: 200, data: data };
		})
		.catch(error => {
			if (
				error.constraint === "user_media_user_id_foreign" ||
				error.constraint === "notes_user_id_foreign"
			)
				throw {
					status: 403,
					data: "A constraint prevented this request from being fulfilled.",
					error
				};
			throw { status: 400, data: error.message, error };
		});
};

module.exports = User;
