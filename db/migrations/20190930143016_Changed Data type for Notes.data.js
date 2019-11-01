exports.up = function(knex, Promise) {
	return Promise.all([
        knex.schema.alterTable("notes", function(table) {
            table
                .dropColumn('data')
		
        }),
        knex.schema.alterTable("notes", function(table) {
            table
                .string("data", 10000)
		
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.alterTable("notes", function(table) {
            table
                .dropColumn('data')

        }),
        knex.schema.alterTable("notes", function(table) {
            table
				.string("data", 255)
        })
        
        
        
	]);
};

