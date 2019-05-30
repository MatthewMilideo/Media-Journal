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

// Posts a new tag.
Tag.postTag = async tag_name => {
	// Makes sure the request contains a tag_name and 
	if (tag_name === undefined) return { code: 406, data: "Missing Tag Name" };

	let dbRes;
	try {
		dbRes = await db.query(
			"INSERT INTO tags (tag_name) VALUES ($1) RETURNING tag_id, tag_name",
			[tag_name]
		);
	} catch (err) {
		// Checks if the tag is already used
		if (err.code === "23505")
			return {
				message: "That tag is already in use.",
				code: 409,
				error: err
			};
		// Generic Error
		return {
			message: "Error in Tag.posttag",
			code: 500,
			error: err
		};
	}
	return {
		code: 201,
		data: dbRes.rows[0]
	};
};

// Need to add to this later 
Tag.deleteTag = async tag_id => {
	// Checks if the id paramter is an int
	if (Number.isInteger(parseInt(tag_id)) === false)
		return { code: 406, data: "ID must be an integer" };
	let dbRes;
	try {
		dbRes = await db.query("DELETE FROM tags WHERE tag_id = $1", [tag_id]);
	} catch (err) {
		if (err.code === "23503")
			return { code: 403, data: "Foreign Key Constraint" };
		return {
			code: 500,
			message: "Error in third branch of Tag.deleteTag",
			error: err
		};
	}
	// If putting into undefined entry
	if (dbRes.rowCount === 0) return { code: 204, data: "Entry not found" };
	return { code: 200, data: dbRes };
};

module.exports = Tag;
