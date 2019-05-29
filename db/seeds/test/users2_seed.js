
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users2').del()
    .then(function () {
      // Inserts seed entries
      return knex('users2').insert([
        {id: 1, name: 'Matthew', email: 'mmilideo@gmail.com'},
        {id: 2, name: 'Tyler', email: 'tylerb7@gmail.com'},
        {id: 3, name: 'MJ', email: 'maryjuilae@gmail.com'}
      ]);
    });
};
