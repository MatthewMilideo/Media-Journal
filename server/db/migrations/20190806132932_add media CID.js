
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('media', function(table) {
          table.string('CID');
        })
      ]);
  
};


  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.table('media', function(table) {
        table.dropColumn('CID');
      })
    ]);
  };