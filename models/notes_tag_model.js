const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

// Import the input pareser
const helpers = require("./helpers");

const Note_Tags = {};

Note_Tags.getAllNT = () => {
	return database
		.from("note_tag")
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested note_tags were not found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw {
				status: 400,
				data: error.message,
				error
			};
		});
};

Note_Tags.getNoteNT = tag_id => {
	if (!helpers.checkArgs([tag_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid tag_id."
		});
	return database
		.from("note_tag")
		.where({ tag_id })
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested note_tag was not found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw {
				status: 400,
				data: error.message,
				error
			};
		});
};

Note_Tags.getTagNTBulk = note_ids => {
	if ( ! Array.isArray(note_ids)) note_ids = [note_ids];
	if (!helpers.checkArgs([note_ids])){
		console.log('rejected')
		return Promise.reject({
			status: 400,
			data: "You must provide valid note_ids."
		});
	}
	return database
		.from("note_tag")
		.where(builder => builder.whereIn("note_id", note_ids))
		.select()
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested note_tags were not found."
				};

			return { status: 200, data: data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

Note_Tags.getTagNT = note_id => {
	if (!helpers.checkArgs([note_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid note_id."
		});
	return database
		.from("note_tag")
		.where({ note_id })
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested note_tag was not found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw {
				status: 400,
				data: error.message,
				error
			};
		});
};

Note_Tags.postNT = (note_id, tag_id) => {
	if (!helpers.checkArgs([note_id, tag_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid note_id and tag_id."
		});
	return database("note_tag")
		.insert({ note_id, tag_id }, ["note_id", "tag_id"])
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			if (error.constraint === "note_tag_tag_id_foreign") {
				throw {
					status: 403,
					data: "A constraint prevented this request from being fulfilled.",
					error
				};
			}
			if (error.constraint === "note_tag_note_id_foreign")
				throw {
					status: 404,
					data: "The note_id required for this operation could not be found.",
					error
				};
			throw {
				status: 400,
				data: error.message,
				error
			};
		});
};

Note_Tags.deleteNT = (note_id, tag_id) => {
	if (!helpers.checkArgs([note_id, tag_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid note_id and tag_id."
		});
	return database("note_tag")
		.returning("*")
		.where({ note_id, tag_id })
		.del()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested note_tag was not found. " };
			return { status: 200, data };
		})
		.catch(error => {
			throw {
				status: 400,
				data: error.message,
				error
			};
		});
};

module.exports = Note_Tags;
