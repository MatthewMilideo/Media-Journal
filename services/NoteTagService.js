const TagService = require("../services/TagService");
const NoteTag = require("../models/notes_tag_model");
const helpers = require("../models/helpers");
const isEqual = require("lodash/isEqual");
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

NoteTagService.getByAll = async function(IDs) {
	// If there is only a single ID we wrap it in an array so the DB query functions properly.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkNTAll(IDs)) {
		return {
			status: 400,
			data: "You must provide valid ID(s)."
		};
	}
	return await NoteTag.getByAll(IDs);
};

NoteTagService.postNT = async function(IDs) {
	// Check that IDs is an array, and convert it into one if not.
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of every obj of the IDs array is an integer.
	if (!helpers.checkNTAll(IDs)) {
		return {
			status: 400,
			data: "You must provide valid ID(s)."
		};
	}
	let results = {};
	results.added = [];
	results.error = [];
	for (let NT of IDs) {
		let res = await NoteTag.postNT(NT.note_id, NT.tag_id, NT.user_id);
		res.status !== 200 && res.status !== 201 && res.status !== 409
			? results.error.push({ ...NT, ...res })
			: results.added.push(NT);
	}
	return { status: 200, data: results };
};

// Input: [ {note_id, user_id, title} ]
// Output: TBD

NoteTagService.postTagAndNT = async function(IDs) {
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkNoteTag(IDs))
		return {
			status: 400,
			data: "You must provide a valid noteID, userID, and title."
		};

	// Get the titles from the input and insert all tags.
	let titles = IDs.map(elem => elem.title);
	let tags = await TagService.postTag(titles);

	if (tags.status !== 201 && tags.status !== 200) return tags;
	// Generate an object for easy tag and map tag titles onto request object.
	let tagsObj = {};
	for (let tag of tags.data) {
		tagsObj[tag.title] = tag;
	}
	IDs.map(id => (id.tag_id = tagsObj[id.title].id));

	return await NoteTagService.postNT(IDs);
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
