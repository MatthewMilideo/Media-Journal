const db = require("../db/index.js");
const helpers = require("../models/model_helpers");

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const Notes = {};

// Gets all Notes by all users
Notes.getAllNotes = () => {
	return database
		.from("notes")
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "There are no notes." };
			return { status: 200, data };
		})
		.catch(error => {
			throw error;
		});
};

// Gets all notes by a given user
Notes.getUserNotes = user_id => {
	return database
		.from("notes")
		.where("user_id", user_id)
		.select()
		.then(data => {
			return data.length === 0
				? { status: 404, data: "No notes found." }
				: { status: 200, data };
		})
		.catch(error => {
			throw error;
		});
};

// Gets all Notes for a given piece of Media
Notes.getMediaNotes = media_id => {
	return database
		.from("notes")
		.join("media_note", "notes.id", "=", "media_note.note_id")
		.where("media_id", media_id)
		.select()
		.then(data => {
			return data.length === 0
				? { status: 404, data: "No notes found." }
				: { status: 200, data };
		})
		.catch(error => {
			throw error;
		});
};

// Gets all Notes by a given user for a given piece of Media
Notes.getMediaUserNotes = (media_id, user_id) => {
	return database
		.from("notes")
		.join("media_note", "notes.id", "=", "media_note.note_id")
		.where({ media_id, user_id })
		.select()
		.then(data => {
			return data.length === 0
				? { status: 404, data: "No notes found" }
				: { status: 200, data };
		})
		.catch(error => {
			throw error;
		});
};

Notes.postNote = (note_title, note_data, user_id) => {
	return database("notes")
		.insert(
			{
				title: note_title,
				data: note_data,
				user_id
			},
			["id", "title", "data", "user_id"]
		)
		.then(data => {
			//console.log(data);
			return { status: 201, data };
		})
		.catch(error => {
			throw error;
		});
};

Notes.editNote = (note_id, note_title, note_data) => {
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
			throw error;
		});
};

// Need to add to this later
Notes.deleteNote = async note_id => {
	return database("notes")
		.returning('*')
		.where({ id: note_id })
		.del()
		.then(data => {
			return { status: 200, data };
		})
		.catch(error => {
			console.log(error);
			throw error;
		});
};

module.exports = Notes;
