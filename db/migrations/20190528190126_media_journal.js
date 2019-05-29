exports.up = function(knex, Promise) {
    return knex.schema.createTable('users2', function(table){
      table.increments();
      table.string('email').notNullable().unique();
      table.string('name').notNullable();
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users2');
  };