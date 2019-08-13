const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const Note_Tags = {};

Note_Tags.getAllNT = () => {
	return database
		.from("note_tag")
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "There are no note_tags." };
			return { status: 200, data };
		})
		.catch(error => {
			throw {
				status: 400,
				data: "There was an error getting all note_tags.",
				error
			};
		});
};

Note_Tags.getNoteNT = tag_id => {
	return database
		.from("note_tag")
		.where({ tag_id })
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "No notes were found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw {
				status: 400,
				data: "There was an error getting all note_tags.",
				error
			};
		});
};

Note_Tags.getTagNT = note_id => {
	return database
		.from("note_tag")
		.where({ note_id })
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "No tags were found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw {
				status: 400,
				data: "There was an error getting all note_tags.",
				error
			};
		});
};

Note_Tags.postNT = (note_id, tag_id) => {
	return database("note_tag")
		.insert({ note_id, tag_id }, ["note_id", "tag_id"])
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			if ((error.constraint === "note_tag_tag_id_foreign")) {
				throw {
					status: 409,
					data: "There was an error getting all note_tags.",
					error
				};
			}
			if ((error.constraint === "note_tag_note_id_foreign"))
				throw {
					status: 403,
					data: "That note does not exist.",
					error
				};
			throw {
				status: 400,
				data: "There was an error getting all note_tags.",
				error
			};
		});
};

Note_Tags.deleteNT = (note_id, tag_id) => {
	return database("note_tag")
		.returning("*")
		.where({ note_id, tag_id })
		.del()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "There are no note_tags." };
			return { status: 200, data };
		})
		.catch(error => {
			console.log(error);
			throw {
				status: 400,
				data: "There was an error getting all note_tags.",
				error
			};
		});
};

module.exports = Note_Tags;
