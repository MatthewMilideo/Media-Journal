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
			return { status: 400, data: error.message, error };
		});
};

Media_Note.getMediaMN = note_id => {
	if (!helpers.checkArgs([note_id]))
		return {
			status: 400,
			data: "You must provide a valid note_id."
		};
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
			return { status: 400, data: error.message, error };
		});
};

Media_Note.getByMediaID = media_ids => {
	return database
		.from("media_note")
		.where(builder => builder.whereIn("media_id", media_ids))
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
			return { status: 400, data: error.message, error };
		});
};

Media_Note.getByUserID = user_ids => {
	return database("media_note")
		.join("notes", "media_note.note_id", "notes.id")
		.select([
			"media_note.media_id",
			"media_note.note_id",
			"media_note.user_id",
			"notes.title",
			"notes.data"
		])
		.where(builder => builder.whereIn("media_note.user_id", user_ids))
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested media_notes were not found."
				};
			return { status: 200, data: data };
		})
		.catch(error => {
			return { status: 400, data: error.message, error };
		});
};

Media_Note.getByMediaAndUserID = ids => {
	return database("media_note")
		.join("notes", "media_note.note_id", "notes.id")
		.select([
			"media_note.media_id",
			"media_note.note_id",
			"media_note.user_id",
			"notes.title",
			"notes.data"
		])
		.where(builder =>
			builder.whereIn(
				["media_note.media_id", "media_note.user_id"],
				ids.map(id => [id.media_id, id.user_id])
			)
		)
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested media_notes were not found."
				};
			return { status: 200, data: data };
		})
		.catch(error => {
			return { status: 400, data: error.message, error };
		});
};

Media_Note.getByNoteAndUserID = ids => {
	return database("media_note")
		.join("notes", "media_note.note_id", "notes.id")
		.select([
			"media_note.media_id",
			"media_note.note_id",
			"media_note.user_id",
			"notes.title",
			"notes.data"
		])
		.where(builder =>
			builder.whereIn(
				["media_note.note_id", "media_note.user_id"],
				ids.map(id => [id.note_id, id.user_id])
			)
		)
		.then(data => {
			if (data.length === 0)
				return {
					status: 404,
					data: "The requested media_notes were not found."
				};
			return { status: 200, data: data };
		})
		.catch(error => {
			return { status: 400, data: error.message, error };
		});
};

Media_Note.postMN = (media_id, note_id, user_id) => {
	return database("media_note")
		.insert(
			{
				note_id,
				media_id,
				user_id
			},
			["note_id", "media_id", "user_id"]
		)

		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			switch (error.constraint) {
				case "media_note_media_id_foreign":
					return {
						status: 403,
						data: "The media required for this operation could not be found.",
						error
					};
				case "media_note_note_id_foreign":
					return {
						status: 404,
						data: "The note required for this operation could not be found.",
						error
					};
				case "media_note_user_id_foreign":
					return {
						status: 404,
						data: "The user required for this operation could not be found.",
						error
					};
				case "media_note_pkey":
					return {
						status: 409,
						data:
							"There was a conflict during insertion. You must provide a unique relation.",
						error
					};
				default:
					return { status: 400, data: "Error", error };
			}
		});
};

Media_Note.deleteMN = (media_id, note_id, user_id) => {
	return database("media_note")
		.returning("*")
		.where({ media_id, note_id, user_id })
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
			return { status: 400, data: error.message, error };
		});
};

Media_Note.keyValue = (data, key = "note_id") => {
	let returnObj = {};
	data.forEach(elem => {
		returnObj[elem[key]] = elem;
	});
	return noteObj;
};

module.exports = Media_Note;
