exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.alterTable("media_note", function(table) {
			table
				.integer("user_id")
				.references("id")
				.inTable("users");
			table.dropPrimary();
			table.primary(["media_id", "note_id", "user_id"]);
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.alterTable("media_note", function(table) {
            table.dropPrimary();
			table.dropColumn("user_id");
            table.primary(["media_id", "note_id"]);
		})
	]);
};
