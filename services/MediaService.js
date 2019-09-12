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

module.exports = MediaService;
