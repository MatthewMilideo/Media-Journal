const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const helpers = require("./helpers");

const Media = {};

// Gets all Notes by all users
Media.getAllMedia = () => {
	return database
		.from("media")
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested media were not found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

// Get Media by [ {CID and Type} ]
Media.getByCID = IDs => {
	return database
		.from("media")
		.where(builder =>
			builder.whereIn(
				["media.CID", "media.type"],
				IDs.map(id => [id.CID, id.type])
			)
		)
		.select()
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested media were not found."
				};
			return { status: 200, data: data };
		})
		.catch(error => {
			return { status: 400, data: error.message, error };
		});
};

// Get Media from Media User by [ {CID, TYPE, USER}]
Media.getByUserID = IDs => {
	return database("media")
		.join("user_media", "media.id", "user_media.media_id")
		.select([
			"user_media.media_id",
			"media.title",
			"media.CID",
			"media.type",
			"user_media.user_id"
		])
		.where(builder =>
			builder.whereIn( ["user_media.user_id"], IDs)
		)
		.then(data => {
			if (data.length === 0) {
				return { status: 404, data: "The requested media were not found." };
			}
			return { status: 200, data };
		})
		.catch(error => {
			return Promise.reject({ status: 400, data: error.message, error });
		});
};

// Get Media from Media User by [ {CID, TYPE, USER}]
Media.getByCIDUser = IDs => {
	return database("media")
		.join("user_media", "media.id", "user_media.media_id")
		.select([
			"user_media.media_id",
			"media.title",
			"media.CID",
			"media.type",
			"user_media.user_id"
		])
		.where(builder =>
			builder.whereIn(
				["media.CID", "media.type", "user_media.user_id"],
				IDs.map(id => [id.CID, id.type, id.user_id])
			)
		)
		.then(data => {
			if (data.length === 0) {
				return { status: 404, data: "The requested media were not found." };
			}
			return { status: 200, data };
		})
		.catch(error => {
			return Promise.reject({ status: 400, data: error.message, error });
		});
};

// Get Media X Media_User from Media User by [ {media_ID, user_id }]
Media.getByMediaIDUser = IDs => {
	return database("media")
		.join("user_media", "media.id", "user_media.media_id")
		.select([
			"user_media.media_id",
			"media.title",
			"media.CID",
			"media.type",
			"user_media.user_id"
		])
		.where(builder =>
			builder.whereIn(
				["user_media.media_id", "user_media.user_id"],
				IDs.map(id => [id.media_id, id.user_id])
			)
		)
		.then(data => {
			if (data.length === 0) {
				return { status: 404, data: "The requested media were not found." };
			}
			return { status: 200, data };
		})
		.catch(error => {
			return Promise.reject({ status: 400, data: error.message, error });
		});
};

Media.postMedia = mediaObj => {
	return database("media")
		.insert(mediaObj, ["id", "title", "type", "CID"])
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			if (error.constraint === "media_cid_type_unique")
				return {
					status: 409,
					data:
						"There was a conflict during insertion. You must provide a unique piece of media.",
					error
				};
			return { status: 400, data: error.message, error };
		});
};

Media.deleteMedia = (type, CID) => {
	if (!(helpers.checkArgs([], [CID, type]) && helpers.checkMediaType(type))) {
		return Promise.reject({
			status: 400,
			data: "You must provide a valid type and CID."
		});
	}
	return database("media")
		.returning("*")
		.where({ type, CID })
		.del()
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested media was not found." };
			return { status: 200, data };
		})
		.catch(error => {
			if (error.constraint === "user_media_media_id_foreign")
				throw {
					status: 403,
					data: "A constraint prevented this request from being fulfilled.",
					error
				};
			throw { status: 400, data: error.message, error };
		});
};
module.exports = Media;
