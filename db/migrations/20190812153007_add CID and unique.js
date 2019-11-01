
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('media', function(t) {
            t.unique(['CID', 'type'])
          })
      ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('media', function(t) {
            t.dropUnique(['CID', 'type'])
          })
      ]);
  
};
