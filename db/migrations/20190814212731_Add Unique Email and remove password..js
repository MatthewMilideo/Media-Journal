exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('users', function(t) {
            t.dropColumn('password');
            t.unique('email');
          })
      ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('users', function(t) {
            t.string('password');
            t.dropUnique(['email'])

          })
      ]);
  
};

