const Media = require("../models/media_model");
const Notes = require("../models/notes_model");

const helpers = require("../models/helpers");

const NoteService = {};

// Given a list of media, this function counts the number of notes the user has written
// about each of them.

NoteService.Count = async function(CIDs, type, user_id) {
	// Check the arguments.
	if (!helpers.checkArgsType([user_id], [CIDs, type], type)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid CIDs, type, and user_id."
		});
	}

	let mediaMap = {};
	let CIDMap = {};

	try {
		// Get All Media associated with a given user.
		let userMedia = await Media.getMediaCIDBulkUser(CIDs, type, user_id);
		if (userMedia.status !== 200)
			return Promise.reject({
				status: 404,
				data: "The requested media_users were not found."
			});

		// Makes Key Value Arrays:
		// 1. media_ids -> CIDs
		// CIDs -> Notes.
		userMedia.data.forEach(elem => {
			mediaMap[elem.media_id] = {};
			mediaMap[elem.media_id].CID = elem.CID;
			CIDMap[elem.CID] = {};
			CIDMap[elem.CID].media_id = elem.media_id;
			CIDMap[elem.CID].notes = [];
		});

		// Get all of the user's notes for the media objects found above.
		let notes = await Notes.getMediaUserNotes(Object.keys(mediaMap), user_id);
		if (notes.status === 200) {
			notes.data.forEach(note => {
				let key = mediaMap[note.media_id].CID;
				CIDMap[key].notes.push(note);
			});
		}
		return CIDMap;
	} catch (error) {
		return error;
	}
};

module.exports = NoteService;
