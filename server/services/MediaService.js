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

MediaService.getByUserID = async function(user_ids) {
	
	if (!Array.isArray(user_ids)) user_ids = [user_ids];
	
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([],user_ids)) {
		console.log('error');
		return Promise.reject({
			status: 400,
			data: "You must provide a valid user_id."
		});
	}

	let results = await media.getByUserID(user_ids); 
	if (results.status !== 200) return Promise.reject(results);

	let returnObj = {};
	returnObj.keysArr = [];
	results.data.forEach( elem => {
		returnObj[elem.CID] = elem;
		returnObj.keysArr.push(elem.CID); 
	}); 

	return {status: 200, data: returnObj};
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
	console.log('here');
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
	console.log('in Media Service', results)

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
	if (!helpers.checkArgs([media_id], [user_id])) {
		return {
			status: 400,
			data: "You must provide a valid media and user pair."
		};
	}
	return await mediaUser.postMU(media_id, user_id);
};

/* Inserts Media Obj */
MediaService.deleteMU = async function(mediaObj, user_id) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgsAndMedia([], [user_id], mediaObj)) {
		return {
			status: 400,
			data: "You must provide a valid media and user pair."
		};
	}

	/* Input: [{CID, type, user_id}] */
	let res = await MediaService.getByCIDUser({
		CID: mediaObj.CID,
		type: mediaObj.type,
		user_id
	});

	if (res.status != 200)
		return { status: 404, data: "Media User Relation Not Found." };
	media_id = res.data[0].media_id;
	return await mediaUser.deleteMU(media_id, user_id);
};

/* Inserts Media Obj and Media User */
MediaService.postMediaAndMU = async function(mediaObj, user_id) {
	if (!helpers.checkArgsAndMedia([], [user_id], mediaObj))
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

	let results2 = await MediaService.postMU(media_id, user_id);

	if (results2.status === 409) {
		results2.data = [];
		results2.data.push({ media_id, ...mediaObj });
	}

	return results2;
};

module.exports = MediaService;
