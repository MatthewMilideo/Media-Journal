const Notes = require("../models/notes_model");
const MediaService = require("../services/MediaService");
const MediaNoteService = require("./MediaNoteService");
const NoteTagService = require("../services/NoteTagService");

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

// Inserts Note //
NoteService.deleteNote = async function(note_id) {
	if (!helpers.checkArgs([note_id]))
		return {
			status: 400,
			data: "You must provide a valid note_id."
		};
	return await Notes.deleteNote(note_id, title, data);
};

// New Function. 
NoteService.clientGetNotesUser = async function(user_id) {
	if (!helpers.checkArgs([user_id], []))
		return {
			status: 400,
			data: "You must provide a valid user_id."
		};

	console.log(user_id);
	let res = await MediaNoteService.getByUserID(user_id);
	if (res.status !== 200) return res;
	
	let mediaNotes = {};
	mediaNotes.keysArr = [];
	console.log(res.data);
	let requestData = res.data.map(elem => {
		mediaNotes[elem.note_id] = elem;
		mediaNotes[elem.note_id]["tags"] = [];
		mediaNotes.keysArr.push(elem.note_id);
		return { note_id: elem.note_id, user_id: elem.user_id };
	});

	console.log(requestData);

	let noteTags = await NoteTagService.getByNoteAndUserID(requestData);

	if (noteTags.status !== 200) return { status: 200, data: mediaNotes };
	noteTags = noteTags.data;
	noteTags.forEach(elem => {
		if (mediaNotes[elem.note_id]) mediaNotes[elem.note_id].tags.push(elem);
	});

	return { status: 200, data: mediaNotes };
};

NoteService.clientGetNotesMedia = async function(IDs) {
	if (!Array.isArray(IDs)) IDs = [IDs];
	let res = await MediaService.getByCIDUser(IDs);
	if (res.status !== 200) return res;

	let media = {};
	media.keysArr = [];
	let requestData = res.data.map(elem => {
		media[elem.media_id] = elem;
		media.keysArr.push(elem.media_id);
		return { media_id: elem.media_id, user_id: elem.user_id };
	});

	res = await MediaNoteService.getByMediaAndUserID(requestData);
	if (res.status !== 200) return res;

	mediaNotes = {};
	mediaNotes.keysArr = [];
	requestData = res.data.map(elem => {
		mediaNotes[elem.note_id] = elem;
		mediaNotes[elem.note_id]["media"] = media[elem.media_id];
		mediaNotes[elem.note_id]["tags"] = [];
		mediaNotes.keysArr.push(elem.note_id);
		return { note_id: elem.note_id, user_id: elem.user_id };
	});

	let noteTags = await NoteTagService.getByNoteAndUserID(requestData);

	if (noteTags.status !== 200) return { status: 200, data: mediaNotes };
	noteTags = noteTags.data;
	noteTags.forEach(elem => {
		if (mediaNotes[elem.note_id]) mediaNotes[elem.note_id].tags.push(elem);
	});

	return { status: 200, data: mediaNotes };
};

// Input { title: string, data: string, user_id int,
// 		 mediaObj: { CID: string, type: type (specific string), title: string },
// 		 Tags: [ strings ] }
//  ~~~~~~~~~~
// Output: TBD
NoteService.postNoteAll = async function(title, data, user_id, mediaObj, tags) {
	console.log(arguments);
	// Add the Media and MU.
	console.log('after post mediaObj and user_id', mediaObj, user_id);
	let media = await MediaService.postMediaAndMU(mediaObj, user_id);
	if (media.status !== 201 && media.status !== 409) return media;
	media = media.data[0];
	console.log('after post media and mu mn');
	// Add the Note and MN
	let note = await NoteService.postNoteAndMN(
		title,
		data,
		user_id,
		media.media_id
	);
	if (note.status !== 201) return note;
	console.log('after post note mn');
	note = { ...note.data[0], media, title, data, user_id, tags: [] };
	// Add Tags and Note Tags
	tags = tags.map(tag => (tag = tag.title));
	let tagResult = await NoteTagService.postTagAndNT(
		note.note_id,
		user_id,
		tags
	);

	console.log('after tag 1');

	if (tagResult.status !== 200) return { status: 200, data: note };
	note.tags = tagResult.data.NTs.success.map(elem => {
		return {
			tag_id: elem.data.tag_id,
			title: elem.data.title,
			note_id: note.note_id,
			user_id
		};
	});

	console.log('after final tag 1');

	return { status: 201, data: note };
};

// Edits the note.
NoteService.editNote = async function(
	note_id,
	title,
	data,
	addTags,
	rmTags,
	user_id
) {
	if (!Array.isArray(addTags)) addTags = [addTags];
	if (!Array.isArray(rmTags)) rmTags = [rmTags];
	if (!helpers.checkArgs([note_id, user_id], [title, data]))
		return {
			status: 400,
			data: "You must provide a valid note_id, title, and data."
		};
	let res = await Notes.editNote(note_id, title, data, user_id);
	if (res.status !== 201) return res;
	res.data = res.data[0];
	res.data.tags = [];

	let res2 = await NoteTagService.editNT(note_id, user_id, addTags, rmTags);
	if (res2.data.final.status === 404) return res;
	res.data.tags = res2.data.final.data;
	return res;
};

module.exports = NoteService;
