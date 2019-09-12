const Tag = require("../models/tags_model");
const helpers = require("../models/helpers");
const types = require("../types");

const TagService = {};

TagService.getByID = async function(IDs) {
	if (!Array.isArray(IDs)) IDs = [IDs];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs(IDs))
		return {
			status: 400,
			data: "You must provide a valid ID."
		};

	return await Tag.getByID(IDs);
};

TagService.getByTitle = async function(titles) {
	if (!Array.isArray(titles)) titles = [titles];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([], titles))
		return {
			status: 400,
			data: "You must provide a valid title."
		};

	return await Tag.getByTitle(titles);
};

// Searching for tags like the one listed.
TagService.searchByTitle = async function(tags) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([], [title]))
		return {
			status: 400,
			data: "You must provide a valid title."
		};

	return await Tag.searchByTitle(title);
};

TagService.postTag = async function(tags) {
	if (!Array.isArray(tags)) tags = [tags];
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([], tags))
		return {
			status: 400,
			data: "You must provide a valid title."
		};

	let tagObj = {};
	tagObj.keysArr = [];
	tags.forEach(elem => {
		tagObj[elem] = {};
		tagObj[elem].title = elem;
		tagObj.keysArr.push(elem);
	});
	// Check if the tag is already inserted, and if it is remove that tag
	// from the list to be inserted.
	let res = await TagService.getByTitle(tags);
	let filteredTags = [];

	if (res.status !== 404) {
		let titles = res.data.map(elem => elem.title);
		tags = tags.filter(tag => {
			if (!titles.includes(tag)) return tag;
			filteredTags.push(tag);
		});
		if (tags.length === 0) return { status: 409, data: res.data };
	}

	tags = tags.map(title => {
		return { title };
	});

	let res2 = await Tag.postTag(tags);
	if (res2.status === 201 && res.status !== 404)
		res2.data = [...res.data, ...res2.data];
	return res2;
};

module.exports = TagService;
