exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.alterTable("note_tag", function(table) {
			table
				.integer("user_id")
				.references("id")
				.inTable("users");
			table.dropPrimary();
			table.primary(["tag_id", "note_id", "user_id"]);
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.alterTable("note_tag", function(table) {
			table.dropPrimary();
			table.dropColumn("user_id");
		
		})
	]);
};
