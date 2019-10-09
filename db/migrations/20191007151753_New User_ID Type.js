exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable("media_note"),
		knex.schema.dropTable("note_tag"),
        knex.schema.dropTable("user_media"),
        knex.schema.dropTable("notes"),
		knex.schema.dropTable("users")
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable("users", function(table) {
			table.increments("id").primary();
			table.string("email");
			table.unique("email");
			table.string("name");
		}),

		knex.schema.createTable("user_media", function(table) {
			table
				.integer("user_id")
				.references("id")
				.inTable("users");
			table
				.integer("media_id")
				.references("id")
				.inTable("media");
			table.primary(["user_id", "media_id"]);
		}),

		knex.schema.createTable("notes", function(table) {
			table.increments("id");
			table.string("title");
			table.string("data", 10000);

			table
				.integer("user_id")
				.references("id")
				.inTable("users");
		}),
		knex.schema.createTable("media_note", function(table) {
			table
				.integer("media_id")
				.references("id")
				.inTable("media");
			table
				.integer("note_id")
				.references("id")
				.inTable("notes")
				.onDelete("CASCADE");

			table
				.integer("user_id")
				.references("id")
				.inTable("users");
			table.primary(["media_id", "note_id", "user_id"]);
		}),
		knex.schema.createTable("note_tag", function(table) {
			table
				.integer("note_id")
				.references("id")
				.inTable("notes")
				.onDelete("CASCADE");

			table
				.integer("tag_id")
				.references("id")
				.inTable("tags");

			table
				.integer("user_id")
				.references("id")
				.inTable("users");

			table.primary(["tag_id", "note_id", "user_id"]);
		})
	]);
};
