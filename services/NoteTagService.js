const NoteTag = require("../models/notes_tag_model");
const helpers = require("../models/helpers");
const types = require("../types");

const NoteTagService = {};

// Service to get all Media notes given a mediaID or an array of mediaIDs.

NoteTagService.getByNoteID = async function(noteIDs) {
	// If there is only a single mediaID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(noteIDs)) noteIDs = [noteIDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs(noteIDs))
		return Promise.reject({
			status: 400,
			data: "You must provide valid noteID(s)."
		});

	let results = await NoteTag.getByNoteID(noteIDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

NoteTagService.getByTagID = async function(tagIDs) {
	// If there is only a single userID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(tagIDs)) tagIDs = [tagIDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs(tagIDs))
		return Promise.reject({
			status: 400,
			data: "You must provide valid tagID(s)."
		});

	let results = await NoteTag.getByTagID(tagIDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

NoteTagService.getByUserID = async function(userIDs) {
	// If there is only a single userID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(userIDs)) userIDs = [userIDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs(userIDs))
		return Promise.reject({
			status: 400,
			data: "You must provide valid userID(s)."
		});

	let results = await NoteTag.getByUserID(userIDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

NoteTagService.getByMediaAndUserID = async function(IDs) {
	// If there is only a single ID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkNoteTagMU(IDs)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid ID(s)."
		});
	}

	let results = await media_notes.getByMediaAndUserID(IDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

NoteTagService.getByNoteAndUserID = async function(IDs) {
	// If there is only a single ID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkNoteTagNU(IDs)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid ID(s)."
		});
	}

	let results = await media_notes.getByNoteAndUserID(IDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};


NoteTagService.getByNoteAndUserID = async function(IDs) {
	// If there is only a single ID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkNoteIDUserID(IDs)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid ID(s)."
		});
	}

	let results = await NoteTag.getByNoteAndUserID(IDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

NoteTagService.getByTagAndUserID = async function(IDs) {
	// If there is only a single ID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkTagIDUserID(IDs)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid ID(s)."
		});
	}

	let results = await NoteTag.getByTagAndUserID(IDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

NoteTagService.postNT = async function(noteID, tagID, userID) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([noteID, tagID, userID]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid noteID, tagID, and userID."
		});

	let results = await NoteTag.postNT(noteID, tagID, userID);

	if (results.status !== 201) return Promise.reject(results);
	return results;
};

NoteTagService.deleteNT = async function(mediaID, noteID, userID) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([mediaID, noteID, userID]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid noteID, tagID, and userID."
		});

	let results = await NoteTag.deleteNT(mediaID, noteID, userID);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

module.exports = NoteTagService;
