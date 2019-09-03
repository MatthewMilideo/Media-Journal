const media_notes = require("../models/media_note_model");
const helpers = require("../models/helpers");
const types = require("../types");

const MediaNoteService = {};

// Service to get all Media notes given a mediaID or an array of mediaIDs.

MediaNoteService.getByMediaID = async function(mediaIDs) {
	// If there is only a single mediaID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(mediaIDs)) mediaIDs = [mediaIDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs(mediaIDs))
		return Promise.reject({
			status: 400,
			data: "You must provide valid mediaID(s)."
		});

	let results = await media_notes.getByMediaID(mediaIDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

MediaNoteService.getByUserID = async function(userIDs) {
	// If there is only a single userID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(userIDs)) userIDs = [userIDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs(userIDs))
		return Promise.reject({
			status: 400,
			data: "You must provide valid mediaID(s)."
		});

	let results = await media_notes.getByUserID(userIDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

MediaNoteService.getByMediaAndUserID = async function(IDs) {
	// If there is only a single ID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkMediaNoteMU(IDs)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid ID(s)."
		});
	}

	let results = await media_notes.getByMediaAndUserID(IDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

MediaNoteService.getByNoteAndUserID = async function(IDs) {
	// If there is only a single ID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkMediaNoteNU(IDs)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid ID(s)."
		});
	}

	let results = await media_notes.getByNoteAndUserID(IDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

MediaNoteService.postMN = async function(mediaID, noteID, userID) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([mediaID, noteID, userID]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid mediaID, noteID, and userID."
        });
        
	let results = await media_notes.postMN(mediaID, noteID, userID);

	if (results.status !== 201) return Promise.reject(results);
	return results;
};

MediaNoteService.deleteMN = async function(mediaID, noteID, userID) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([mediaID, noteID, userID]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid mediaID, noteID, and userID."
        });
        
	let results = await media_notes.deleteMN(mediaID, noteID, userID);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

module.exports = MediaNoteService;
