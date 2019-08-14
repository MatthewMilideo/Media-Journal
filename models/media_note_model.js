const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const helpers = require("./helpers");

const Media_Note = {};

Media_Note.getAllMN = () => {
	return database
		.from("media_note")
		.select()
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested media_notes were not found."
				};
			return { status: 200, data: data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

Media_Note.getMediaMN = note_id => {
	if (!helpers.checkArgs([note_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid note_id."
		});
	return database
		.from("media_note")
		.where({ note_id })
		.select()
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested media_note was not found."
				};

			return { status: 200, data: data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

Media_Note.getNoteMN = media_id => {
	if (!helpers.checkArgs([media_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid media_id."
		});
	return database
		.from("media_note")
		.where({ media_id })
		.select()
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested media_note was not found."
				};

			return { status: 200, data: data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

Media_Note.postMN = (note_id, media_id) => {
	if (!helpers.checkArgs([note_id, media_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid note_id and media_id."
		});
	return database("media_note")
		.insert({
			note_id,
			media_id
		})
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			switch (error.constraint) {
				case "media_note_media_id_foreign":
					throw {
						status: 403,
						data: "The media required for this operation could not be found.",
						error
					};
				case "media_note_note_id_foreign":
					throw {
						status: 404,
						data: "The note required for this operation could not be found.",
						error
					};
				case "media_note_pkey":
					throw {
						status: 409,
						data:
							"There was a conflict during insertion. You must provide a unique relation.",
						error
					};
				default:
					throw { status: 500, data: "Error", error };
			}
		});
};

Media_Note.deleteMN = (media_id, note_id) => {
	if (!helpers.checkArgs([media_id, note_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid media_id and note_id."
		});
	return database('media_note')
		.returning('*')
		.where({ media_id, note_id })
		.del()
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested media_note was not found."
				};

			return { status: 200, data: data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
	}



module.exports = Media_Note;
