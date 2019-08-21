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
				return { status: 404, data: "The requested media was not found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

// Gets all Notes by all users
Media.getMediaCID = (CID, type) => {
	if (!(helpers.checkArgs([], [CID, type]) && helpers.checkMediaType(type))) {
		return Promise.reject({
			status: 400,
			data: "You must provide a valid CID and type."
		});
	}
	return database
		.from("media")
		.select()
		.where({ CID, type })
		.then(data => {
			if (data.length === 0) {
				return { status: 404, data: "The requested media was not found." };
			}
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};


// Gets all Notes by all users
Media.getMediaCIDBulk = (CIDs, type) => {
	if (!Array.isArray(CIDs)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid CIDs."
		});
	}
	if (
		!(helpers.checkArgs([], [...CIDs, type]) && helpers.checkMediaType(type))
	) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid CIDs and type."
		});
	}
	return database("media")
		.where(builder => builder.whereIn("CID", CIDs))
		.andWhere(builder => builder.where({ type }))
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

// Gets all Notes by all users
Media.getMediaCIDBulkUser = (CIDs, type, user_id) => {
	if (!Array.isArray(CIDs)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid CIDs."
		});
	}
	if (
		!(helpers.checkArgs([user_id], [...CIDs, type]) && helpers.checkMediaType(type))
	) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid CIDs, type, and user_id."
		});
	}
	
	return database("media").join('user_media', 'media.id', 'user_media.media_id' )
		.select(['user_media.media_id', 'media.title', 'media.CID'])
		.where(builder => builder.whereIn("media.CID", CIDs))
		.andWhere(builder => builder.where({ type }))
		.andWhere(builder => builder.where({ 'user_media.user_id': user_id }))
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

// Gets all Notes by all users
Media.getCIDBulk = (ids, type) => {
	if (!Array.isArray(ids)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid ids."
		});
	}
	if (
		!(helpers.checkArgs([user_id, ids], [type]) && helpers.checkMediaType(type))
	) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid ids and type."
		});
	}

	
	return database("media").join('user_media', 'media.id', 'user_media.media_id' )
		.select(['user_media.media_id', 'media.title', 'media.CID'])
		.where(builder => builder.whereIn("media.CID", CIDs))
		.andWhere(builder => builder.where({ type }))
		.andWhere(builder => builder.where({ 'user_media.user_id': user_id }))
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
	if (!helpers.checkMediaObj(mediaObj)) {
		return Promise.reject({
			status: 400,
			data: "You must provide a valid title, type, and CID."
		});
	}
	return database("media")
		.insert(mediaObj, ["id", "title", "type", "CID"])
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			if (error.constraint === "media_cid_type_unique")
				return Promise.reject({
					status: 409,
					data:
						"There was a conflict during insertion. You must provide a unique piece of media.",
					error
				});
			return Promise.reject({ status: 400, data: error.message, error });
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
