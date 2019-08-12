exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable("media", function(table) {
			table.increments("id").primary();
			table.string("title");
			table.string("type");
		}),

		knex.schema.createTable("notes", function(table) {
			table.increments("id").primary();
			table.string("title");
			table.text("data");
		}),

		knex.schema.createTable("tags", function(table) {
			table.increments("id").primary();
			table.string("title");
		}),

		knex.schema.createTable("users", function(table) {
			table.increments("id").primary();
			table.string("email");
			table.string("name");
			table.string("password");
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

		knex.schema.createTable("media_note", function(table) {
			table
				.integer("media_id")
				.references("id")
				.inTable("media");
			table
				.integer("note_id")
				.references("id")
                .inTable("notes");
            table.primary(["media_id", "note_id"]);
		}),

		knex.schema.createTable("note_tag", function(table) {
			table
				.integer("note_id")
				.references("id")
				.inTable("notes");
			table
				.integer("tag_id")
				.references("id")
                .inTable("tags");
            table.primary(["note_id", "tag_id"]);
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable("user_media"),
        knex.schema.dropTable("media_note"),
        knex.schema.dropTable("note_tag"),
		knex.schema.dropTable("media"),
        knex.schema.dropTable("tags"),
		knex.schema.dropTable("users"),
		knex.schema.dropTable("notes"),
        
	]);
};
