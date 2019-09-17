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
	let results2 = await NoteService.postNoteAndMN(
		title,
		data,
		user_id,
		media_id
	);

	if (results2.status !== 201) return results2;
	return results2;
};

// Inserts Note //
NoteService.editNote = async function(note_id, title, data) {
	if (!helpers.checkArgs([note_id], [title, data]))
		return {
			status: 400,
			data: "You must provide a valid note_id, title, and data."
		};
	return await Notes.editNote(note_id, title, data);
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
NoteService.ClientPostNoteAll = async function(
	title,
	data,
	user_id,
	mediaObj,
	tags
) {
	console.log("IN POST NOTE ALL");
	let media = await MediaService.postMediaAndMU(mediaObj, user_id);
	let media_id = media.data[0].media_id;
	if (media.status === 409) {
		let tempResults = await MediaService.getByCID({
			type: mediaObj.type,
			CID: mediaObj.CID
		});
		media_id = tempResults.data[0].id;
	}
	if (media.status !== 201 && media.status !== 409) return results;
	media = { ...mediaObj, ...media.data[0] };
	let note = await NoteService.postNoteAndMN(title, data, user_id, media_id);
	if (note.status !== 201) return note;
	let note_id = note.data[0].note_id;
	note = { ...note.data[0], media, title, data, user_id, tags: [] };

	tags = tags.map(tag => {
		return { note_id, user_id, title: tag.title };
	});

	let tagResult = await NoteTagService.postTagAndNT(tags);
	console.log("result of tags call", tagResult);
	if (tagResult.status !== 200) {
		let returnObj = { status: 200, data: note };
		console.log(returnObj);
		return returnObj;
	}
	console.log("result of tags call", tagResult);
	note.tags = tagResult.data.added;
	note.errorTags = tagResult.data.error;
	console.log("Note with the tags", note);
	return { status: 201, data: note };
};

module.exports = NoteService;
