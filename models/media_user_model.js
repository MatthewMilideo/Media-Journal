const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const Media_User = {};

// Gets all Media for a given user_id
Media_User.getMedia = (user_id) => {
	
	return database
		.from("user_media")
		.select('media_id')
		.where( {user_id} )
		.then(data => {
			if (data.length === 0){
				return { status: 404, data: "There is no media." };
			}
			return { status: 200, data };
		})
		.catch(error => {
			throw {status: 400, message: error.message};
		});
};


// Gets all Users for a given media_id
Media_User.getUsers = (media_id) => {
	return database
		.from("user_media")
		.select('user_id')
		.where( {media_id} )
		.then(data => {
			if (data.length === 0)
				return{ status: 404, data: "There are no users." };
			return { status: 200, data };
		})
		.catch(error => {
			throw {status: 400, message: error.message};
		});
};

// Gets all Users for a given media_id
Media_User.postMU = (user_id) => {
	return database
		.from("media_user")
		.select('media_id')
		.where( {media_id} )
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "There are no users" };
			return { status: 200, data };
		})
		.catch(error => {
			throw error;
		});
};

// Gets all Users for a given media_id
Media_User.deleteMU = (user_id) => {
	return database
		.from("media_user")
		.select('media_id')
		.where( {media_id} )
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "There are no users" };
			return { status: 200, data };
		})
		.catch(error => {
			throw error;
		});
};

module.exports = Media_User;
