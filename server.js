//Static file declaration
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const mountRoutes = require('./routes')
const port = process.env.PORT || 5000;

const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);




const app = express();

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors({
  origin: 'http://localhost:3000'
}));
mountRoutes(app);

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

  app.listen(port, () => {
	console.log(`App running on port ${port}.`)
	})


module.exports = {
  app,
  database
}