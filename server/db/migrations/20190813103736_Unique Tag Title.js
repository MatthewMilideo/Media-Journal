
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('tags', function(t) {
            t.unique('title')
          })
      ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('tags', function(t) {
            t.dropUnique(['title'])
          })
      ]);
  
};
