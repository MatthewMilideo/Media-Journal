const db = require("../db/index.js");

const Media = {};

// Finds all Users
Media.findAll = async () => {
	let dbRes;
	try {
		dbRes = await db.query("SELECT * FROM media ");
	} catch (err) {
		// Catches any currently undefined errors.
		return {
			message: "There was an error in Media.fetchAll",
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

// Fetch Media by media_ID
Media.findByMID = async media_id => {
	// Checks if the media_id is an integer.
	if (Number.isInteger(parseInt(media_id)) === false)
		return { code: 406, data: "ID must be an integer" };
	let dbRes;
	try {
		dbRes = await db.query("SELECT * FROM media WHERE media_id = $1", [
			media_id
		]);
	} catch (err) {
		// Catches any currently undefined errors.
		return {
			code: 500,
			message: "There was an error in Media.findByID",
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

// Fetch Media by media_ID or content_ID
Media.findByCID = async (content_id, media_type) => {
    console.log('poopy');
	// If both or one of args is undefined return.
	if (
		(content_id === undefined && media_type === undefined) ||
		(content_id === undefined || media_type === undefined)
	)
		return { code: 406, data: "Missing Parameters" };

	let dbRes;
	try {
		dbRes = await db.query(
			"SELECT * FROM media WHERE content_id = $1 AND media_type = $2",
			[content_id, media_type]
		);
	} catch (err) {
		// Catches any currently undefined errors.
		return {
			code: 500,
			message: "There was an error in Media.findByContentID",
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


// Posts a new user.
Media.postMedia = async (content_id, media_type, media_title) => {
	// Makes sure the request contains a user_name and user_email
	if (
		content_id === undefined ||
		media_type === undefined ||
		media_title === undefined ||
		(content_id === undefined &&
			media_type === undefined &&
			media_title === undefined)
	)
		return { code: 406, data: "Missing Parameters" };

	let dbRes;
	try {
		dbRes = await db.query(
			"INSERT INTO media (content_id, media_type, media_title) VALUES ($1, $2, $3) RETURNING *",
			[content_id, media_type, media_title]
		);
	} catch (err) {
		// Checks if content_ID and Media Type are already in use 
		if (err.code === "23505")
			return {
				message: "That content ID and Mediatype are already in use",
				code: 409,
				error: err
			};
		// Generic Error
		return {
			message: "Error in Media.postMedia",
			code: 500,
			error: err
		};
	}
	return {
		code: 201,
		data: dbRes.rows[0]
	};
};

Media.deleteMedia = async media_id => {
	// Checks if the id paramter is an int
	if (Number.isInteger(parseInt(media_id)) === false)
        return { code: 406, data: "ID must be an integer" };
	let dbRes;
	try {
		dbRes = await db.query("DELETE FROM media WHERE media_id = $1", [media_id]);
	} catch (err) {
		if (err.code === "23503")
			return { code: 403, data: "Foreign Key Constraint" };
		return {
			code: 500,
			message: "Error in Media.deleteMedia",
			error: err
		};
	}
	// If putting into undefined entry
	if (dbRes.rowCount === 0) return { code: 204, data: "Entry not found" };
	return { code: 200, data: dbRes };
};

Media.deleteMediaByCID = async (content_id, media_type) => {
    if (
		(content_id === undefined && media_type === undefined) ||
		(content_id === undefined || media_type === undefined)
	)
		return { code: 406, data: "Missing Parameters" };
	let dbRes;
	try {
        console.log('in try');
		dbRes = await db.query("DELETE FROM media WHERE content_id = $1 AND media_type = $2", [content_id, media_type]);
	} catch (err) {
		if (err.code === "23503")
			return { code: 403, data: "Foreign Key Constraint" };
		return {
			code: 500,
			message: "Error in Media.deleteMedia",
			error: err
		};
	}
	// If putting into undefined entry
	if (dbRes.rowCount === 0) return { code: 204, data: "Entry not found" };
	return { code: 200, data: dbRes };
};

module.exports = Media;
