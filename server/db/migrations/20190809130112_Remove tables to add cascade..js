exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable("media_note"),
		knex.schema.dropTable("note_tag"),
        knex.schema.dropTable("notes")
    ]);	
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable("notes", function(table) {
			table.increments("id");
			table.string("title");
            table.string("data");
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
