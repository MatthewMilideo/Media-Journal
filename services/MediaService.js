const media = require("../models/media_model");
const mediaUser = require("../models/media_user_model");

const helpers = require("../models/helpers");
const types = require("../types");

/*
const notes = require("../models/notes_model");
const noteTags = require("../models/notes_tag_model");
const tags = require("../models/tags_model");
const MediaNoteService = require("../services/MediaNoteService");
*/

const MediaService = {};

/* Input: [{CID, Type}]
   Output: [{Media}] from DB */
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

/* Input: [{CID, type, user_id}]
   Output: [{Media JOIN Media User}] from DB */
MediaService.getByCIDUser = async function(IDs) {
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkCIDTypeUser(IDs)) {
		return {
			status: 400,
			data: "You must provide a valid CID, type, and user object(s)."
		};
	}
	return await media.getByCIDUser(IDs);
};

/* Input: [{media_id, user_id}]
   Output: [{Media JOIN Media User}] from DB */
MediaService.getByMediaIDUser = async function(IDs) {
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkMediaIDUserID(IDs)) {
		return Promise.reject({
			status: 400,
			data: "You must provide a valid media_id and user object(s)."
		});
	}
	let results = await media.getByMediaIDUser(IDs);

	if (results.status !== 200) return Promise.reject(results);
	return results;
};

/* Inserts Media Obj */
MediaService.postMedia = async function(mediaObj) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkMediaObj(mediaObj)) {
		return {
			status: 400,
			data: "You must provide a valid mediaObj."
		};
	}
	return await media.postMedia(mediaObj);
};

/* Inserts Media Obj */
MediaService.postMU = async function(media_id, user_id) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([media_id, user_id])) {
		return {
			status: 400,
			data: "You must provide a valid media and user pair."
		};
	}
	return await mediaUser.postMU(media_id, user_id);
};

/* Inserts Media Obj and Media User */
MediaService.postMediaAndMU = async function(mediaObj, user_id) {
	if (!helpers.checkArgsAndMedia([user_id], [], mediaObj))
		return {
			status: 400,
			data: "You must provide a valid user_id mediaObj pair."
		};
	let results = await MediaService.postMedia(mediaObj);

	let media_id = results.data[0].id;
	if (results.status === 409) {
		let tempResults = await MediaService.getByCID({
			type: mediaObj.type,
			CID: mediaObj.CID
		});
		media_id = tempResults.data[0].id;
	}

	// If the element wasn't inserted or already present.
	if (results.status !== 201 && results.status !== 409) {
		return results;
	}

	return await MediaService.postMU(media_id, user_id);
};

/*
MediaService.getMedia = async function(user_id, mediaObj) {
	let returnObject = {};
	returnObject.keysArr = [];

	/* Check the incoming arguments 
	if (!helpers.checkArgsAndMedia([user_id], [], mediaObj))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id, and mediaObj."
		});

	const { CID, type } = mediaObj;
	let mediaID, res;

	/* Check if the media object exists. 
       If not return 404 if it does continue
    

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

	/* Check if the media has notes for this user 
	try {
		console.log(mediaID, user_id);

		res = await notes.getMediaUserNotes(mediaID, user_id);
		console.log("media user notes", res);
		/* If no notes were found we return 200 with the media ID
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
	/* Check if there are tags for found notes 
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

	/*  Reconfigure existing data into return data 

	let tagNames = res.data;
	let tagObj = {};
	let noteObject = {};

	// Convert Tags into Key Value Pairs
	tagNames = tagNames.forEach(tag => (tagObj[tag.id] = tag.title));

	/* 
       Input: Tags for the notes found above | Tag key value pairs
       Output: Object Note_ID => Tags
    
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
   */

module.exports = MediaService;
