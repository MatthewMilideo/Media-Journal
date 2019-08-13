const db = require("../db/index.js");
const helpers = require("../models/model_helpers");

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const Media = {};

// Gets all Notes by all users
Media.getAllMedia = () => {
	return database
		.from("media")
		.select()
		.then(data => {
			if (data.length === 0) return { status: 404, data: "There is no media" };
			return { status: 200, data };
		})
		.catch(error => {
			throw error;
		});
};

// Gets all Notes by all users
Media.getMediaCID = (CID, type) => {
	return database
		.from("media")
		.select()
		.where({ CID, type })
		.then(data => {
			if (data.length === 0) {
				return { status: 404, data: "No media found." };
			}
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, message: error.message, error };
		});
};

Media.postMedia = (title, type, CID) => {
	return database("media")
		.insert({ title, type, CID }, ["id", "title", "type", "CID"])
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			if (error.constraint === "media_cid_type_unique")
				throw { status: 409, message: "The media must be unique.", error };
			throw { status: 400, message: error.message, error };
		});
};
module.exports = Media;
