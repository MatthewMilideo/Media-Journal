const db = require("../db/index.js");
const helpers = require("../models/model_helpers");

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const Media = {};

// Gets all Notes by all users
Media.getAllMedia = () => {
	console.log('in the model');
	return database
		.from("media")
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "There is no media" };
			return { status: 200, data };
		})
		.catch(error => {
			throw error;
		});
};

// Gets all Notes by all users
Media.getUserMedia = () => {
	return database
		.from("media")
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "There is no media" };
			return { status: 200, data };
		})
		.catch(error => {
			throw error;
		});
};




/*
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


Media.errors = {
	"23505": {
		status: 409,
		message: " " // Undefined at the moment.
	},
	"23503": { status: 403, message: "Foreign Key Constraint" }
};

Media.findAll = async () => {
	return helpers.query("SELECT * FROM media ", null, Media.errors);
};

// Fetch Media by media_ID
Media.findByMID = async media_id => {
	// Checks if the media_id is an integer.
	if (helpers.checkParamsInt(media_id) === false)
		return { code: 406, data: "ID must be an integer" };
	return helpers.query(
		"SELECT * FROM media WHERE media_id = $1",
		[media_id],
		Media.errors
	);
};

// Fetch Media by media_ID or content_ID
Media.findByCID = async (content_id, media_type) => {
	// Makes sure all args are defined.
	if (helpers.checkParams([content_id, media_type]) === false)
		return { code: 406, data: "Missing Parameters" };
	return helpers.query(
		"SELECT * FROM media WHERE content_id = $1 AND media_type = $2",
		[content_id, media_type],
		Media.errors
	);
};

// Fetch Media by media_ID or content_ID
Media.bulkFindByCID = async (content_ids, media_type) => {
	// Makes sure all args are defined.
	if (helpers.checkParamsInt( [content_ids] ) === false)
	{ 
		console.log('in if');
		return { code: 406, data: "Missing Parameters" };
	}
	if (helpers.checkParams( [media_type] ) === false)
		return { code: 406, data: "Missing Parameters" };

	let queryPart = '';
	for( let i = 0; i < content_ids.length; i++){
		queryPart += `$${i + 1}`

		if( i !== content_ids.length -1){
			queryPart += `, `
		}
	}
	console.log(queryPart);
	let query = `SELECT json_build_object(
		m.content_id, json_build_object(
			'media_id', m.media_id,
			'user_id', media_user.user_id))
	FROM media_user
	RIGHT JOIN(
		SELECT media_title, media_id, content_id 
		FROM media 
		WHERE content_id IN ( ${queryPart}) AND media_type = '${media_type}' 
		) m
	on media_user.media_id = m.media_id`
	console.log(query);


	return helpers.query(
		query,
		[content_ids, media_type],
		Media.errors
	);
};

// Posts a new user.
Media.postMedia = async (content_id, media_type, media_title) => {
	// Makes sure all args are defined.
	if (helpers.checkParams([content_id, media_type, media_title]) === false)
		return { code: 406, data: "Missing Parameters" };
	return helpers.query(
		"INSERT INTO media (content_id, media_type, media_title) VALUES ($1, $2, $3) RETURNING *",
		[content_id, media_type, media_title],
		Media.errors
	);
};

Media.deleteMedia = async media_id => {
	// Checks if the id paramter is an int
	if (helpers.checkParamsInt(media_id))
		return { code: 406, data: "ID must be an integer" };
	return helpers.query(
		"DELETE FROM media WHERE media_id = $1",
		[media_id],
		Media.errors
	);
};

Media.deleteMediaByCID = async (content_id, media_type) => {
	if (helpers.checkParams([content_id, media_type] === false))
		return { code: 406, data: "Missing Parameters" };
	return helpers.query(
		"DELETE FROM media WHERE content_id = $1 AND media_type = $2",
		[content_id, media_type],
		Media.errors
	);
};

/*

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
*/
module.exports = Media;
