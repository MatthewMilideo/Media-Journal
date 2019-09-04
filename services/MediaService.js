const tags = require("../models/tags_model");
const media = require("../models/media_model");
const notes = require("../models/notes_model");
const noteTags = require("../models/notes_tag_model");
const mediaUser = require("../models/media_user_model");
const helpers = require("../models/helpers");
const types = require("../types");

const MediaNoteService = require("../services/MediaNoteService");

const MediaService = {};

MediaService.getByCID = async function(IDs) {
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkCIDType(IDs)) {
		return Promise.reject({
			status: 400,
			data: "You must provide a valid CID type pair(s)."
		});
	}
	let results = await media.getByCID(IDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

/* This function verifies that the given media is in the database,
and that the given user has viewed it. */

MediaService.verifyMedia = async function(user_id, mediaObj) {
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkMediaIDUserID(IDs)) {
		return Promise.reject({
			status: 400,
			data: "You must provide valid ID(s)."
		});
	}
};

// Service to walk through the step of posting a Media User Relation.
MediaService.postMU = async function(user_id, mediaObj) {
	// Check the incoming arguments.

	if (!helpers.checkArgsAndMedia([user_id], [], mediaObj))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id, and mediaObj.",
			user_note:
				"The user_id or media provided were invalid. Make sure that you are properly logged in and then try adding the media again."
		});

	const { CID, type } = mediaObj;
	let mediaID, itemData;
	try {
		itemData = await media.getMediaCID(CID, type);
		if (itemData.status !== 200) {
			itemData = await media.postMedia(mediaObj);
		}
		mediaID = itemData.data[0].id;
	} catch (error) {
		error.data.user_note =
			"There was an error either retrieving the media or inserting it into the database.";
		return Promise.reject(error);
	}

	try {
		itemData = await mediaUser.getMU(mediaID, user_id);
		if (itemData.status === 200) {
			return itemData;
		}
	} catch (error) {
		error.data.user_note =
			"There was an error checking if the media was already marked as viewed.";
		return Promise.reject(error);
	}

	try {
		console.log(mediaID, user_id);
		itemData = await mediaUser.postMU(mediaID, user_id);
	} catch (error) {
		console.log(error);
		error.data.user_note =
			"There was an error adding the relation to the database. Please try again later.";
		return Promise.reject(error);
	}
	console.log("final itemData ", itemData);
	return itemData;
};

MediaService.getMedia = async function(user_id, mediaObj) {
	let returnObject = {};
	returnObject.keysArr = [];

	/* Check the incoming arguments */
	if (!helpers.checkArgsAndMedia([user_id], [], mediaObj))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id, and mediaObj."
		});

	const { CID, type } = mediaObj;
	let mediaID, res;

	/* Check if the media object exists. 
       If not return 404 if it does continue
    */

	try {
		res = await media.getMediaCID(CID, type);
		if (res.status !== 200) {
			return res;
		}
		mediaID = res.data[0].id;
		console.log("media", res);
	} catch (error) {
		error.data.user_note =
			"There was an error either retrieving the media or inserting it into the database.";
		return Promise.reject(error);
	}

	/* Check if the media has a relation to the user 
       if they do not, then the code returns 404 as 
       above
    */
	try {
		res = await mediaUser.getMU(mediaID, user_id);
		if (res.status !== 200) {
			return res;
		}
		console.log("media_user", res);
	} catch (error) {
		error.data.user_note =
			"There was an error checking if the media was already marked as viewed.";
		return Promise.reject(error);
	}

	let noteList, noteIDs;

	/* Check if the media has notes for this user */
	try {
		console.log(mediaID, user_id);

		res = await notes.getMediaUserNotes(mediaID, user_id);
		console.log("media user notes", res);
		/* If no notes were found we return 200 with the media ID*/
		if (res.status === 404) {
			res.status = 200;
			res.data = { media_id: mediaID };
			return res;
		}

		noteList = res.data;
		noteIDs = noteList.map(note => note.note_id);
	} catch (error) {
		console.log(error);
		error.data.user_note =
			"There was an error adding the relation to the database. Please try again later.";
		return Promise.reject(error);
	}

	let curTags, tagIDs;
	/* Check if there are tags for found notes */
	try {
		res = await noteTags.getTagNTBulk(noteIDs);
		console.log("tags", res);
		if (res.status === 404) {
			res.status = 200;

			noteList.forEach(note => {
				const id = note.note_id;
				returnObject[id] = note;
				returnObject.keysArr.push(id);
			});
			returnObject.media_id = mediaID;

			res.data = returnObject;
			return res;
		}
		console.log("tags", res);
		curTags = res.data;
		tagIDs = curTags.map(tag => tag.tag_id);
	} catch (error) {
		console.log(error);
		return Promise.reject(error);
	}

	try {
		res = await tags.getTagIDBulk(tagIDs);
		if (res.status === 404) {
			res.status = 200;
			res.data = { notes: noteList, media_id: mediaID };
			return res;
		}
	} catch (error) {
		return Promise.reject(error);
	}

	/*  Reconfigure existing data into return data */

	let tagNames = res.data;
	let tagObj = {};
	let noteObject = {};

	// Convert Tags into Key Value Pairs
	tagNames = tagNames.forEach(tag => (tagObj[tag.id] = tag.title));

	/* 
       Input: Tags for the notes found above | Tag key value pairs
       Output: Object Note_ID => Tags
    */
	curTags.forEach(tag => {
		tag.title = tagObj[tag.tag_id];
		if (!noteObject[tag.note_id]) noteObject[tag.note_id] = [];
		noteObject[tag.note_id].push({ tag_id: tag.tag_id, title: tag.title });
	});

	noteList.forEach(note => {
		const id = note.note_id;
		returnObject[id] = { ...note, tags: noteObject[id] };
		returnObject.keysArr.push(id);
	});
	returnObject.media_id = mediaID;

	console.log(returnObject);

	return { status: 200, data: returnObject };
};

module.exports = MediaService;
