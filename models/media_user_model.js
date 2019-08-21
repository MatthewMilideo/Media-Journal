const helpers = require("./helpers");

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const Media_User = {};

// Gets all Media_User Entries.
Media_User.getAllMU = user_id => {
	return database
		.from("user_media")
		.select()
		.then(data => {
			if (data.length === 0) {
				return { status: 404, data: "The requested media_users were not found." };
			}
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, message: error.message };
		});
};

// Gets all Media for a given user_id
Media_User.getMUBulk = (media_ids, user_id) => {
	if (!Array.isArray(media_ids)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid media_ids."
		});
	}
	if (!helpers.checkArgs([user_id, ...media_ids]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id and media_ids."
		});
	return database("user_media")
		.select("media_id")
		.where(builder => builder.whereIn("media_id", media_ids))
		.andWhere(builder => builder.where({ user_id }))
		.then(data => {
			if (data.length === 0) {
				return { status: 404, data: "The requested media_users were not found." };
			}
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, message: error.message };
		});
};

// Gets all Media for a given user_id
Media_User.getMU = (media_id, user_id) => {
	//console.log(media_id, user_id)
	if (!helpers.checkArgs([user_id, media_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id and media_id."
		});
	return database
		.from("user_media")
		.select("media_id")
		.where({ user_id, media_id})
		.then(data => {
			if (data.length === 0) {
				return { status: 404, data: "The requested media_user was not found." };
			}
			return { status: 200, data:'' };
		})
		.catch(error => {
			throw { status: 400, message: error.message };
		});
};

// Gets all Media for a given user_id
Media_User.getMedia = user_id => {
	if (!helpers.checkArgs([user_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id."
		});
	return database
		.from("user_media")
		.select("media_id")
		.where({ user_id })
		.then(data => {
			if (data.length === 0) {
				return { status: 404, data: "The requested media_user was not found." };
			}
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, message: error.message };
		});
};

// Gets all Users for a given media_id
Media_User.getUsers = media_id => {
	if (helpers.checkArgs([media_id]) === false)
		return Promise.reject({
			status: 400,
			data: "You must provide a valid media_id."
		});
	return database
		.from("user_media")
		.select("user_id")
		.where({ media_id })
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "There are no users." };
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, message: error.message };
		});
};

// Gets all Users for a given media_id
Media_User.postMU = (media_id, user_id) => {
	if (helpers.checkArgs([media_id, user_id]) === false)
		return Promise.reject({
			status: 400,
			data: "You must provide a valid media_id and user_id."
		});
	return database("user_media")
		.insert(
			{
				media_id,
				user_id
			},
			["media_id", "user_id"]
		)
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			switch (error.constraint) {
				case "user_media_media_id_foreign":
					throw {
						status: 403,
						data: "The media required for this operation could not be found.",
						error
					};
				case "user_media_user_id_foreign":
					throw {
						status: 404,
						data: "The user required for this operation could not be found.",
						error
					};
				case "user_media_pkey":
					throw { status: 409, data: "There was a conflict during insertion. You must provide a unique relation.", error };
				default:
					throw { status: 500, data: "Error", error };
			}
		});
};

// Gets all Users for a given media_id
Media_User.deleteMU = (media_id, user_id) => {
	if (helpers.checkArgs([media_id, user_id]) === false)
		return Promise.reject({
			status: 400,
			data: "You must provide a valid media_id and user_id."
		});
	return database
		.returning("*")
		.from("user_media")
		.where({ media_id, user_id })
		.del()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested media_user was not found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, error };
		});
};

module.exports = Media_User;
