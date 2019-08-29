module.exports = {

  test: {
    client: 'pg',
    connection: 'postgres://localhost/media_journal_test',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/dev2'
    }
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost/media_journal',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
};
