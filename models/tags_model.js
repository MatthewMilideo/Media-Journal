const db = require("../db/index.js");

const Tag = {};

// Finds all tags
Tag.findAll = async () => {
	let dbRes;
	try {
		dbRes = await db.query("SELECT * FROM tags ");
	} catch (err) {
		// Catches any currently undefined errors.
		return {
			message: "There was an error in Tags.fetchAll",
			code: 500
		};
	}
	// Checks if any entries were found.
	if (dbRes.rowCount === 0) return { code: 204, data: "No entry found." };
	return {
		code: 200,
		data: dbRes.rows
	};
};

// Fetch a tag by ID
Tag.findByID = async tag_id => {
	// Checks if the ID is an integer.
	if (Number.isInteger(parseInt(tag_id)) === false)
		return { code: 406, data: "ID must be an integer" };

	let dbRes;
	try {
		dbRes = await db.query("SELECT * FROM tags WHERE tag_id = $1", [tag_id]);
	} catch (err) {
		// Catches any currently undefined errors.
		return {
			code: 500,
			message: "There was an error in Tag.findByID",
			error: err
		};
	}
	// Checks if any entries were found.
	if (dbRes.rows.length === 0) return { code: 204, data: "No entry found." };
	return {
		code: 200,
		data: dbRes.rows
	};
};


module.exports = Tag;
