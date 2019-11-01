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

// Input: note_id: The Note, user_id: The user
//		tag_ids: A single tag_id or an array of tag_ids which are being deleted.
// Output: An object with Status: 200 and Data:
//	{ success: containing all added tags,
//	error: containg all tags that failed to add }
NoteTagService.postNT = async function(note_id, user_id, tag_ids) {
	// Check that IDs is an array, and convert it into one if not.
	if (!Array.isArray(tag_ids)) tag_ids = [tag_ids];
	// Check that every element of every obj of the IDs array is an integer.
	if (!helpers.checkArgs([note_id, ...tag_ids], [user_id]))
		return {
			status: 400,
			message:
				"You must provide a valid noteID, userID, and at least one tag_id.",
			note_id,
			user_id,
			tag_ids
		};

	let results = {};
	results.success = [];
	results.error = [];
	for (let tag_id of tag_ids) {
		let res = await NoteTag.postNT(note_id, tag_id, user_id);
		res.status !== 200 && res.status !== 201 && res.status !== 409
			? results.error.push(res)
			: results.success.push(res);
	}
	return { status: 200, data: results };
};

NoteTagService.editNT = async function(
	note_id,
	user_id,
	add_tag_titles,
	rm_tag_ids
) {
	add_tag_titles = add_tag_titles.map(tag => {
		return tag.title;
	});
	rm_tag_ids = rm_tag_ids.map(tag => tag.tag_id);

	// Check that IDs is an array, and convert it into one if not.
	if (!Array.isArray(add_tag_titles)) add_tag_titles = [add_tag_titles];
	if (!Array.isArray(rm_tag_ids)) rm_tag_ids = [rm_tag_ids];
	// Check that every element of every obj of the IDs array is an integer.
	if (!helpers.checkArgs([note_id] , [user_id]))
		return {
			status: 400,
			data: {
				message: "You must provide a valid noteID, userID",
				note_id,
				user_id,
				add_tag_titles,
				rm_tag_ids
			}
		};

	let results = {};
	if (add_tag_titles.length !== 0) {
		let addRes = await NoteTagService.postTagAndNT(
			note_id,
			user_id,
			add_tag_titles
		);
		results.tags = addRes.data.tags;
		results.NTs = addRes.data.NTs;
	}

	if (rm_tag_ids.length !== 0) {
		let rmRes = await NoteTagService.deleteNT(note_id, user_id, rm_tag_ids);
		results.rm = rmRes.data;
	}

	let res = await NoteTagService.getByNoteAndUserID({ note_id, user_id });
	results.final = res;

	return { status: 200, data: results };
};

// Input: note_id: The Note, user_id: The user
//		tag_ids: A single tag_id or an array of tag_ids which are being deleted.
// Output: An object with Status: 200 and Data: { success: containing all added tags,
//	error: containg all tags that failed to be removed.}
NoteTagService.deleteNT = async function(note_id, user_id, tag_ids) {
	if (!Array.isArray(tag_ids)) tag_ids = [tag_ids];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([note_id, ...tag_ids], [user_id]))
		return {
			status: 400,
			data: "You must provide a valid note_id, user_id, and tag_ids."
		};
	let results = {};
	results.success = [];
	results.error = [];
	for (let tag_id of tag_ids) {
		let res = await NoteTag.deleteNT(note_id, user_id, tag_id);
		res.status !== 200
			? results.error.push({ ...res, note_id, user_id, tag_id })
			: results.success.push(res);
	}
	return { status: 200, data: results };
};

// Input: note_id: the note, user_id: the user,
//	tag_titles: an array of titles, or a single title.
// Output: An Object with status: 200 containing
// 	tags: {success: [ {status: number, data: tag } ] error: [ {status: number, data: tag } ]}
// 	NT: {success: [ {status: number, data: NT } ] error: [ {status: number, data: NT } ]}

NoteTagService.postTagAndNT = async function(note_id, user_id, tag_titles) {
	// Verify the input.
	if (!Array.isArray(tag_titles)) tag_titles = [tag_titles];
	if (!helpers.checkArgs([note_id] , [...tag_titles, user_id]))
		return {
			status: 400,
			data: {
				note_id,
				user_id,
				tag_titles,
				message: "You must provide a valid noteID, userID, and title."
			}
		};

	// Post All New Tags and Retireve all existing ones.
	let results = {};
	results.tags = (await TagService.postTag(tag_titles)).data;

	// Create both a list of all tag_ids and a id -> title map.
	tagObj = {};
	let tag_ids = results.tags.success.map(tag => {
		const { id, title } = tag.data;
		tagObj[id] = title;
		return id;
	});

	// Post NTs and append titles to result.
	results.NTs = (await NoteTagService.postNT(note_id, user_id, tag_ids)).data;
	results.NTs.success.map(NT => (NT.data.title = tagObj[NT.data.tag_id]));
	results.NTs.error.map(NT => (NT.data.title = tagObj[NT.data.tag_id]));

	return { status: 200, data: results };
};

module.exports = NoteTagService;
