const db = require("../db/index.js");

// Theoretically going to make a general object for queries. 

class Proto {
	constructor(type, postArgs) {
		this.type = type;
		this.postArgs = postArgs;
	}

	async findAll() {
        console.log('in find all ')
        console.log(this.type);
		let dbRes;
		try {
			dbRes = await db.query(`SELECT * FROM ${this.type} `);
		} catch (err) {
			// Catches any currently undefined errors.
			return {
				message: `There was an error in ${this.type}.fetchAll`,
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

	async findByID (id) {
		// Checks if the ID is an integer.
		if (Number.isInteger(parseInt(user_id)) === false)
			return { code: 406, data: "ID must be an integer" };

		let dbRes;
		try {
			dbRes = await db.query(
				`SELECT * FROM ${this.type} WHERE ${this.type}id = $1`,
				[id]
			);
		} catch (err) {
			// Catches any currently undefined errors.
			return {
				code: 500,
				message: `There was an error in ${this.type}.findByID`,
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
    
	// Fetch a user by ID
	// Posts a new user.
	async postElem (args) {
       
		args.forEach(elem => {
            names.push(elem);
            args.push() 
			if (elem === undefined) return { code: 406, data: "Missing Parameters" };
		});

		let dbRes;
		try {
			dbRes = await db.query( this.post.query, args);
		} catch (err) {
			// Checks if the username and email are already used.
			if (err.code === "23505")
				return {
					message: "That username or email is already in use.",
					code: 409,
					error: err
				};
			// Generic Error
			return {
				message: "Error in User.postUser",
				code: 500,
				error: err
			};
		}
		return {
			code: 201,
			data: dbRes.rows[0]
		};
	};

	async deleteElem (id) {
		// Checks if the id paramter is an int
		if (Number.isInteger(parseInt(id)) === false)
			return { code: 406, data: "ID must be an integer" };
		let dbRes;
		try {
			dbRes = await db.query(
				`DELETE FROM ${this.type} WHERE ${this.type}_id = $1`,
				[id]
			);
		} catch (err) {
			if (err.code === "23503")
				return { code: 403, data: "Foreign Key Constraint" };
			return {
				code: 500,
				message: `Error in third branch of ${this.type}.editUser`,
				error: err
			};
		}
		// If putting into undefined entry
		if (dbRes.rowCount === 0) return { code: 204, data: "Entry not found" };
		return { code: 200, data: dbRes };
	};
}

module.exports = Proto;
