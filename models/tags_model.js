const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const Tags = {};

// Gets all Notes by all users
Tags.getAllTags = () => {
	return database
		.from("tags")
		.select()
		.then(data => {
			if (data.length === 0) return { status: 404, data: "There are no tags." };
			return { status: 200, data };
		})
		.catch(error => {
			throw {
				status: 400,
				data: "There was an error getting all tags.",
				error
			};
		});
};

// Gets all Notes by all users
Tags.getTagID = id => {
	return database
		.from("tags")
		.where({ id })
		.select()
		.then(data => {
			if (data.length === 0) return { status: 404, data: "There are no tags." };
			return { status: 200, data };
		})
		.catch(error => {
			throw {
				status: 400,
				data: "The title must be provided",
				error
			};
		});
};

// Gets all Notes by all users
Tags.postTag = title => {
	return database("tags")
		.insert({ title }, ["id", "title"])
		.then(data => {
			return { status: 201, data };
		})
		.catch(error => {
			if (error.constraint === "tags_title_unique")
				throw {
					status: 409,
					data: "Title already in use.",
					error
				};
			throw {
				status: 400,
				data: "There was an error getting the tag.",
				error
			};
		});
};

Tags.deleteTag = id => {
	return database("tags")
		.returning(["id", "title"])
		.where({ id })
		.del()
		.then(data => {
			if (data.length === 0) return { status: 404, data: "Tag not found." };
			return { status: 200, data };
		})
		.catch(error => {
			if (error.constraint === "note_tag_tag_id_foreign")
				throw {
					status: 403,
					data: "Foreign Key constraint",
					error
				};
			throw {
				status: 400,
				data: "There was an error getting the tag.",
				error
			};
		});
};

module.exports = Tags;
