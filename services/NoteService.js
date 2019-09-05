const Notes = require("../models/notes_model");
const MediaNoteService = require("../services/MediaNoteService");
const MediaService = require("../services/MediaService");

const helpers = require("../models/helpers");

const NoteService = {};

/* Input: [{CID, Type}]
   Output: [{Media}] from DB */
NoteService.getByID = async function(IDs) {
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([IDs])) {
		return {
			status: 400,
			data: "You must provide a valid note_id."
		};
	}
	return await Notes.getByID(IDs);
};

// Inserts Note //
NoteService.postNote = async function(title, data, user_id) {
	if (!helpers.checkArgs([user_id], [title, data]))
		return {
			status: 400,
			data: "You must provide a valid user_id, title, and data."
		};
	return await Notes.postNote(title, data, user_id);
};

// Inserts Note and Media Note //
NoteService.postNoteAndMN = async function(title, data, user_id, media_id) {
	let results = await NoteService.postNote(title, data, user_id);
	if (results.status !== 201) return results;
	let note_id = results.data[0].id;
	return await MediaNoteService.postMN(media_id, note_id, user_id);
};

// Inserts Note and Media Note //
NoteService.postNoteAll = async function(title, data, user_id, mediaObj) {
	let results = await MediaService.postMediaAndMU(mediaObj, user_id);

	let media_id = results.data[0].media_id;
	if (results.status === 409) {
		let tempResults = await MediaService.getByCID({
			type: mediaObj.type,
			CID: mediaObj.CID
		});
		media_id = tempResults.data[0].id;
	}
	if (results.status !== 201 && results.status !== 409) return results;
	return await NoteService.postNoteAndMN(title, data, user_id, media_id);
};



module.exports = NoteService;
