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

	let res = await Tag.getByTitle(titles);
	if (res.status !== 200) return res;
	let tagObj = {};
	res.data.forEach(tag => {
		tagObj[tag.title] = tag;
	});
	res.data = tagObj;
	return res;
};

// Searching for tags like the one listed.
TagService.searchByTitle = async function(title) {
	// Check that every element of the mediaIDs array is a integer.
	if (!helpers.checkArgs([], [title]))
		return {
			status: 400,
			data: "You must provide a valid title."
		};

	return await Tag.searchByTitle(title);
};

// Input: Titles
// Output: { status: NUMBER, data: [tags] }
TagService.postTag = async function(tag_titles) {
	// Check the Input.
	if (!Array.isArray(tag_titles)) tag_titles = [tag_titles];
	if (!helpers.checkArgs([], tag_titles))
		return {
			status: 400,
			data: "You must provide a valid title."
		};

	let results = {};
	results.success = [];
	results.error = [];

	// Remove duplicates.
	tag_titles = [...new Set(tag_titles)]

	// Check if any tag_titles were already inserted. If they were
	// remove those titles from the tags to be inserted, and add those
	// tags to the results object.
	let res = await TagService.getByTitle(tag_titles);
	if (res.status !== 404 && res.status !== 200) return res;
	tag_titles = tag_titles.filter(title => {
		if (!res.data[title]) return title;
		results.success.push({ status: 200, data: res.data[title] });
	});

	// Attempt to insert all remaining tags, and put the results into the
	// return object.
	for (let title of tag_titles) {
		let { status, data } = await Tag.postTag(title);
		status !== 201 && status !== 409
			? results.error.push({ status, data: { message: data, title } })
			: status === 409
			? results.success.push({ status, data: { message: res.data, title } })
			: results.success.push({ status, data });
	}

	return { status: 200, data: results };
};

module.exports = TagService;
