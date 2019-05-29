const locPool = process.env.POOL || {
	user: 'matthewmilideo',
	host: 'localhost',
	database: 'Media-Journal',
	password: 'password',
	port: 5432,
  };


const Pool = require('pg').Pool
const pool = new Pool(locPool); 


  const getUsers = (request, response) => {
	pool.query('SELECT * FROM "Media"', (error, results) => {
	  if (error) {
		console.log(error);
	  }
	  response.status(200).json(results.rows)
	})
  }

  module.exports = {
    getUsers,
  }