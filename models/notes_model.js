const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);
const helpers = require("./helpers");

const Notes = {};

// Gets all Notes by all users
Notes.getAllNotes = () => {
	return database
		.from("notes")
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested notes were not found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

// Gets all notes by a given user
Notes.getUserNotes = user_id => {
	if (!helpers.checkArgs([user_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id."
		});
	return database
		.from("notes")
		.where("user_id", user_id)
		.select()
		.then(data => {
			return data.length === 0
				? { status: 404, data: "The requested notes were not found." }
				: { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

// Gets all Notes for a given piece of Media
Notes.getMediaNotes = media_id => {
	if (!helpers.checkArgs([media_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid media_id."
		});
	return database
		.from("notes")
		.join("media_note", "notes.id", "=", "media_note.note_id")
		.where("media_id", media_id)
		.select()
		.then(data => {
			return data.length === 0
				? { status: 404, data: "The requested notes were not found." }
				: { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

// Media_IDs must be an array.
Notes.getMediaUserNotes = (media_ids, user_id) => {
	if ( ! Array.isArray(media_ids)) media_ids = [media_ids];
	if (!helpers.checkArgs([media_ids, user_id])) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid media_ids and a user_id."
		});
	}
	return database("notes")
		.join("media_note", "notes.id", "=", "media_note.note_id")
		.select(["media_note.note_id", "notes.title", "notes.data", "notes.user_id", "media_note.media_id"])
		.where(builder => builder.whereIn("media_note.media_id", media_ids))
		.andWhere(builder => builder.where({ user_id }))
		.then(data => {
			return data.length === 0
				? { status: 404, data: "The requested notes were not found." }
				: { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

Notes.postNote = (title, data, user_id) => {
	if (!helpers.checkArgs([user_id], [title, data]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id, title, and data."
		});
	return database("notes")
		.insert(
			{
				title,
				data,
				user_id
			},
			["id", "title", "data", "user_id"]
		)
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			console.log(error);
			throw { status: 400, data: error.message, error };
		});
};

Notes.editNote = (note_id, note_title, note_data) => {
	if (!helpers.checkArgs([user_id], [title, data]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id, title, and data."
		});
	return database("notes")
		.where({ note_id })
		.update(
			{
				title: note_title,
				data: note_data
			},
			["id", "title", "data"]
		)
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			console.log(error);
			throw { status: 400, data: error.message, error };
		});
};

// Need to add to this later
Notes.deleteNote = async note_id => {
	if (!helpers.checkArgs([note_id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid note_id."
		});
	return database("notes")
		.returning("*")
		.where({ id: note_id })
		.del()
		.then(data => {
			return data.length === 0
				? { status: 404, data: "The requested note was not found." }
				: { status: 200, data };
		})
		.catch(error => {
			throw { status: 400, data: error.message, error };
		});
};

/*
Notes.get = (note_ids) => {
	// Gets all Notes by all users
	return database("notes").join('note_tag', 'notes.id', 'note_tag.note_id' )
		.select()
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
}
*/

module.exports = Notes;
