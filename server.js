//Static file declaration
const express = require("express");
const bodyParser = require('body-parser');
const mountRoutes = require('./routes')
const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/*
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
*/

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

mountRoutes(app);




  app.listen(port, () => {
	console.log(`App running on port ${port}.`)
	})

	


module.exports = app
	





