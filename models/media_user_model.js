const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const Media_User = {};

// Gets all Media for a given user_id
Media_User.getMedia = user_id => {
	return database
		.from("user_media")
		.select("media_id")
		.where({ user_id })
		.then(data => {
			if (data.length === 0) {
				return { status: 404, data: "There is no media." };
			}
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, message: error.message };
		});
};

// Gets all Users for a given media_id
Media_User.getUsers = media_id => {
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
						message:
							"You have to add the media in question to your viewed media!"
					};
				case "user_media_user_id_foreign":
					throw {
						status: 404,
						message:
							"The user_id is invalid, try making sure you are logged in."
					};
				case "user_media_pkey":
					throw { status: 409, message: "The entry already exists." };
				default:
					throw { status: 500, messsage: "Error" };
			}
		});
};

// Gets all Users for a given media_id
Media_User.deleteMU = (media_id, user_id) => {
	return database
		.returning("*")
		.from("user_media")
		.where({ media_id, user_id })
		.del()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "Media_User Entry was not found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, error };
		});
};

module.exports = Media_User;
