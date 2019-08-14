const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const Media_Note = {};

Media_Note.postMediaNote = (note_id, media_id) => {
	return database("media_note")
		.insert({
			note_id,
			media_id,
		})
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			throw error;
		});
};

module.exports = Media_Note;
