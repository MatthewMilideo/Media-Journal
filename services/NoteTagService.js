const TagService = require("../services/TagService");
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
		return {
			status: 400,
			data: "You must provide valid noteID(s)."
		};

	return await NoteTag.getByNoteID(noteIDs);
};

NoteTagService.getByTagID = async function(tagIDs) {
	// If there is only a single userID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(tagIDs)) tagIDs = [tagIDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs(tagIDs))
		return {
			status: 400,
			data: "You must provide valid tagID(s)."
		};

	return await NoteTag.getByTagID(tagIDs);
};

NoteTagService.getByUserID = async function(userIDs) {
	// If there is only a single userID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(userIDs)) userIDs = [userIDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs(userIDs))
		return {
			status: 400,
			data: "You must provide valid userID(s)."
		};

	return await NoteTag.getByUserID(userIDs);
};

NoteTagService.getByMediaAndUserID = async function(IDs) {
	// If there is only a single ID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkNoteTagMU(IDs)) {
		return {
			status: 400,
			data: "You must provide valid ID(s)."
		};
	}
	return await media_notes.getByMediaAndUserID(IDs);
};

NoteTagService.getByNoteAndUserID = async function(IDs) {
	// If there is only a single ID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkNoteTagNU(IDs)) {
		return {
			status: 400,
			data: "You must provide valid ID(s)."
		};
	}

	return await media_notes.getByNoteAndUserID(IDs);
};

NoteTagService.getByNoteAndUserID = async function(IDs) {
	// If there is only a single ID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkNoteIDUserID(IDs)) {
		return {
			status: 400,
			data: "You must provide valid ID(s)."
		};
	}

	return await NoteTag.getByNoteAndUserID(IDs);
};

NoteTagService.getByTagAndUserID = async function(IDs) {
	// If there is only a single ID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkTagIDUserID(IDs)) {
		return {
			status: 400,
			data: "You must provide valid ID(s)."
		};
	}

	return await NoteTag.getByTagAndUserID(IDs);
};

NoteTagService.postNT = async function(noteID, tagID, userID) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([noteID, tagID, userID]))
		return {
			status: 400,
			data: "You must provide a valid noteID, tagID, and userID."
		};

	return await NoteTag.postNT(noteID, tagID, userID);
};

NoteTagService.postTagAndNT = async function(noteID, title, userID) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([noteID, userID], [title]))
		return {
			status: 400,
			data: "You must provide a valid noteID, userID, and title."
		};
	let res = await TagService.postTag(title);

	let tag_id = res.data[0].id;

	if (res.status === 409) {
		res = await TagService.getByTitle(title);
		tag_id = res.data[0].id;
	}

	if (res.status !== 201 && res.status !== 409 && res.status !== 200)
		return res;

	return await NoteTag.postNT(noteID, tag_id, userID);
};

NoteTagService.postTagAndNT2 = async function(noteID, title, userID) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([noteID, userID], [title]))
		return {
			status: 400,
			data: "You must provide a valid noteID, userID, and title."
		};
	let res = await TagService.postTag(title);

	if (res.status !== 201 && res.status !== 409 && res.status !== 200)
		return res;

	let noteTags = [];
	for (let i = 0; i < res.data.length; i++) {
		let tag_id = res.data[i].id;
		noteTags.push(await NoteTag.postNT(noteID, tag_id, userID));
	}
};

NoteTagService.deleteNT = async function(mediaID, noteID, userID) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([mediaID, noteID, userID]))
		return {
			status: 400,
			data: "You must provide a valid noteID, tagID, and userID."
		};

	return await NoteTag.deleteNT(mediaID, noteID, userID);
};

module.exports = NoteTagService;
