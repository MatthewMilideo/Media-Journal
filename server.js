//Static file declaration
const express = require("express");
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const app = express();

const locPool = process.env.POOL || {
	user: 'matthewmilideo',
	host: 'localhost',
	database: 'Media-Journal',
	password: 'password',
	port: 5432,
  };


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

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

app.get('/', getUsers);



  app.listen(port, () => {
	console.log(`App running on port ${port}.`)
  })