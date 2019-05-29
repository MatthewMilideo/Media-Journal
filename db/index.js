const { Pool } = require("pg");

// Pool Config needs to go in process.env once the DB is migrated to the cloud. 
const poolConfig = process.env.POOL || {
	user: "matthewmilideo",
	host: "localhost",
	database: "Media-Journal",
	password: "password",
	port: 5432
};

const pool = new Pool(poolConfig); 

module.exports = {
    query: (text, params) => pool.query(text, params)
  }
