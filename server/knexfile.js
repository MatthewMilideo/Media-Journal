module.exports = {
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
	production: {
		client: "pg",
		connection:{
		socketPath: '/var/run/postgresql',
		user: 'matthew',
		password: 'test',
		database: 'matthew',
		},
		migrations: {

			directory: "./db/migrations"
		},
		seeds: {
			directory: "./db/seeds/dev2"
		},
		useNullAsDefault: true
	}
};

