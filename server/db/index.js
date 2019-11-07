const { Pool } = require("pg");

// Pool Config needs to go in process.env once the DB is migrated to the cloud. 
const poolConfig = process.env.POOL || {
	user: "matthew",
	host: process.env.POSTGRES_URL,
	database: "matthew",
	password: process.env.POSTGRES_PASS,
	port: 5432
};

console.log(process.env.POOL);

const pool = new Pool(poolConfig); 

module.exports = {
    query: (text, params) => pool.query(text, params)
  }




