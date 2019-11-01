const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

const helpers = require("./helpers");

const Tags = {};

// Gets all Notes by all users
Tags.getAllTags = () => {
	return database
		.from("tags")
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested tags were not found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw {
				status: 400,
				data: error.message,
				error
			};
		});
};

Tags.getByID = id => {
	return database
		.from("tags")
		.whereIn("tags.id", id)
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested tag was not found." };
			return { status: 200, data };
		})
		.catch(error => {
			throw {
				status: 400,
				data: error.message,
				error
			};
		});
};

Tags.getByTitle = title => {
	return database("tags")
		.where(builder => builder.whereIn("tags.title", title))
		.select()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested tag was not found." };
			return { status: 200, data };
		})
		.catch(error => {
			return {
				status: 400,
				data: error.message,
				error
			};
		});
};

Tags.searchByTitle = title => {
	return database("tags")
		.where("title", "like", `%${title}%`)
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested tag was not found." };
			return { status: 200, data };
		})
		.catch(error => {
			return {
				status: 400,
				data: error.message,
				error
			};
		});
};

Tags.postTag = title => {
	return database("tags")
		.returning("*")
		.insert({ title })
		.then(data => {
			return { status: 201, data: data[0] };
		})
		.catch(error => {
			if (error.constraint === "tags_title_unique")
				return {
					status: 409,
					data:
						"There was a conflict during insertion. You must provide a unique title.",
					error
				};
			return {
				status: 400,
				data: { title, message: error.message },
				error
			};
		});
};

Tags.deleteTag = id => {
	if (!helpers.checkArgs([id]))
		return Promise.reject({
			status: 400,
			data: "You must provide a valid id."
		});
	return database("tags")
		.returning(["id", "title"])
		.where({ id })
		.del()
		.then(data => {
			if (data.length === 0)
				return { status: 404, data: "The requested tag was not found." };
			return { status: 200, data };
		})
		.catch(error => {
			if (error.constraint === "note_tag_tag_id_foreign")
				throw {
					status: 403,
					data: "A constraint prevented this request from being fulfilled.",
					error
				};
			throw {
				status: 400,
				data: error.message,
				error
			};
		});
};

module.exports = Tags;
