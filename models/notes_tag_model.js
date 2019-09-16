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
			return {
				status: 400,
				data: error.message,
				error
			};
		});
};

Note_Tags.getByNoteID = noteIDs => {
	return database("note_tag")
		.join("tags", "note_tag.tag_id", "tags.id")
		.select([
			"note_tag.note_id",
			"note_tag.tag_id",
			"note_tag.user_id",
			"tags.title"
		])
		.where(builder => builder.whereIn("note_tag.note_id", noteIDs))
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested note_tags were not found."
				};
			return { status: 200, data: data };
		})
		.catch(error => {
			return { status: 400, data: error.message, error };
		});
};

Note_Tags.getByTagID = tagIDs => {
	return database("note_tag")
		.join("tags", "note_tag.tag_id", "tags.id")
		.select([
			"note_tag.note_id",
			"note_tag.tag_id",
			"note_tag.user_id",
			"tags.title"
		])
		.where(builder => builder.whereIn("note_tag.tag_id", tagIDs))
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested note_tags were not found."
				};
			return { status: 200, data: data };
		})
		.catch(error => {
			return { status: 400, data: error.message, error };
		});
};

Note_Tags.getByUserID = userIDs => {
	return database("note_tag")
		.join("tags", "note_tag.tag_id", "tags.id")
		.select([
			"note_tag.note_id",
			"note_tag.tag_id",
			"note_tag.user_id",
			"tags.title"
		])
		.where(builder => builder.whereIn("user_id", userIDs))
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested note_tags were not found."
				};
			return { status: 200, data: data };
		})
		.catch(error => {
			return { status: 400, data: error.message, error };
		});
};

Note_Tags.getByNoteAndUserID = ids => {
	return database("note_tag")
		.join("tags", "note_tag.tag_id", "tags.id")
		.select([
			"note_tag.note_id",
			"note_tag.tag_id",
			"note_tag.user_id",
			"tags.title"
		])
		.where(builder =>
			builder.whereIn(
				["note_tag.note_id", "note_tag.user_id"],
				ids.map(id => [id.note_id, id.user_id])
			)
		)
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested note_tags were not found."
				};
			return { status: 200, data: data };
		})
		.catch(error => {
			return { status: 400, data: error.message, error };
		});
};

Note_Tags.getByTagAndUserID = ids => {
	return database("note_tag")
		.join("tags", "note_tag.tag_id", "tags.id")
		.select([
			"note_tag.note_id",
			"note_tag.tag_id",
			"note_tag.user_id",
			"tags.title"
		])
		.where(builder =>
			builder.whereIn(
				["note_tag.tag_id", "note_tag.user_id"],
				ids.map(id => [id.tag_id, id.user_id])
			)
		)
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested note_tags were not found."
				};
			return { status: 200, data: data };
		})
		.catch(error => {
			return { status: 400, data: error.message, error };
		});
};

Note_Tags.getByAll = ids => {
	return database("note_tag")
		.join("tags", "note_tag.tag_id", "tags.id")
		.select(["note_tag.note_id", "note_tag.tag_id", "note_tag.user_id"])
		.where(builder =>
			builder.whereIn(
				["note_tag.note_id", "note_tag.user_id", "note_tag.tag_id"],
				ids.map(id => [id.note_id, id.user_id, id.tag_id])
			)
		)
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: []
				};
			return { status: 200, data: data };
		})
		.catch(error => {
			return { status: 400, data: error.message, error };
		});
};

Note_Tags.postNT = (note_id, tag_id, user_id) => {
	return database("note_tag")
		.insert({ note_id, tag_id, user_id }, ["note_id", "tag_id", "user_id"])
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			if (error.constraint === "note_tag_tag_id_foreign") {
				return {
					status: 404,
					data: "The tag required for this operation could not be found.",
					error
				};
			}
			if (error.constraint === "note_tag_note_id_foreign")
				return {
					status: 404,
					data: "The note required for this operation could not be found.",
					error
				};
			if (error.constraint === "note_tag_user_id_foreign") {
				return {
					status: 404,
					data: "The user required for this operation could not be found.",
					error
				};
			}
			if (error.constraint === "note_tag_pkey") {
				return {
					status: 409,
					data:
						"There was a conflict during insertion. You must provide a unique relation.",
					error
				};
			}
			return {
				status: 400,
				data: error.message,
				error
			};
		});
};

Note_Tags.deleteNT = (note_id, tag_id, user_id) => {
	return database("note_tag")
		.returning("*")
		.where({ note_id, tag_id, user_id })
		.del()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested note_tag was not found." };
			return { status: 200, data };
		})
		.catch(error => {
			return {
				status: 400,
				data: error.message,
				error
			};
		});
};

module.exports = Note_Tags;
