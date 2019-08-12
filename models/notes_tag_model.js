const db = require("../db/index.js");
const helpers = require("./model_helpers");

const Notes_Tags = {};

// Gets all Notes_Tags Relations ...
Notes_Tags.findAll = async () => {
	let dbRes;
	try {
		dbRes = await db.query("SELECT * FROM notes_tag");
	} catch (err) {
		// Catches any currently undefined errors.
		return {
            message: "There was an error in Notes.fetchAll",
            data: err,
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

// Fetches all notes_tags relations for a given tag.
Notes_Tags.findNT = async (tag_id, note_id) => {
	// Checks if the ID is an integer.
	
	if (!helpers.checkParamsInt([tag_id, note_id]))
		return { code: 406, data: "ID must be an integer" };

	let dbRes;
	try {
		dbRes = await db.query("SELECT * FROM notes_tag WHERE note_id = $1 AND tag_id = $2", [
			note_id, tag_id
		]);
	} catch (err) {
		// Catches any currently undefined errors.
		return {
			code: 500,
			message: "There was an error in Notes_Tags.findNT",
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

// Fetches all Notes_Tags relations for a given tag.
Notes_Tags.findByNID = async note_id => {
	// Checks if the ID is an integer.
	if (Number.isInteger(parseInt(note_id)) === false)
		return { code: 406, data: "ID must be an integer" };

	let dbRes;
	try {
		dbRes = await db.query("SELECT * FROM notes_tag WHERE note_id = $1", [
			note_id
		]);
	} catch (err) {
		// Catches any currently undefined errors.
		return {
			code: 500,
			message: "There was an error in Notes_Tags.findByNID",
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

// Fetches all Notes_Tags relations for a given tag_id.
Notes_Tags.findByTID = async tag_id => {
	// Checks if the ID is an integer.
	if (Number.isInteger(parseInt(tag_id)) === false)
		return { code: 406, data: "ID must be an integer" };

	let dbRes;
	try {
		dbRes = await db.query("SELECT * FROM notes_tag WHERE tag_id = $1", [
			tag_id
		]);
	} catch (err) {
		// Catches any currently undefined errors.
		return {
			code: 500,
			message: "There was an error in Notes_Tags.findByMID",
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
// add Duplicate error 
// Posts a new Note.
Notes_Tags.postNT = async (tag_id, note_id) => {
	// Checks if the IDs are both defined and integers.
	if (!helpers.checkParamsInt([tag_id, note_id]))
		return { code: 406, data: "ID must be an integer" };

	let dbRes;
	try {
		dbRes = await db.query(
			"INSERT INTO notes_tag VALUES ($1, $2)",
			[note_id, tag_id]
		);
	} catch (err) {
		if (err.code === "23503")
			return { code: 403, data: "Foreign Key Constraint", data: err};

		// Generic Error
		return {
            message: "Error in Note.postNote",
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
Notes_Tags.deleteNT = async (tag_id, note_id)  => {
	// Checks if the IDs are both defined and integers.
	if (!helpers.checkParamsInt([tag_id, note_id]))
		return { code: 406, data: "ID must be an integer" };
	let dbRes;
	try {
		dbRes = await db.query('DELETE FROM notes_tag WHERE tag_id = $1 AND note_id = $2', [tag_id, note_id]);
	} catch (err) {
		if (err.code === "23503")
			return { code: 403, data: "Foreign Key Constraint" };
		return {
			code: 500,
			message: "Error in third branch of Notes_Tags.deleteMU",
			error: err
		};
	}
	// If putting into undefined entry
	if (dbRes.rowCount === 0) return { code: 204, data: "Entry not found" };
	return { code: 200, data: dbRes };
};

module.exports = Notes_Tags;
