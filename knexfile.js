module.exports = {
	development: {
		client: "pg",
		connection: "postgresql://matthew:localhost:5432/matthew",
		migrations: {
			directory: "./db/migrations"
		},
		seeds: {
			directory: "./db/seeds/dev2"
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

