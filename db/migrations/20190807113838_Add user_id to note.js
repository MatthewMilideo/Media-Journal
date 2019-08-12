exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("notes", function(table) {
			table
				.integer("user_id")
				.references("id")
				.inTable("users");
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("notes", function(table) {
			table.dropColumn("user_id");
		})
	]);
};
