//Static file declaration
const express = require('express');
const jsonServer = require('json-server');
const middlewares = jsonServer.defaults();
const path = require('path')

const app = express();
const port = process.env.PORT || 5000;


var cors = require('cors')

app.use(cors())

// You may want to mount JSON Server on a specific end-point, for example /api
// Optiona,l except if you want to have JSON Server defaults
// server.use('/api', jsonServer.defaults()); 


const router = jsonServer.router('db.json');
app.use('/api', router);

//production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname, 'client/build/index.html'));
  })
}
//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/public/index.html'));
})



console.log('test');
//start server
app.listen(port, (req, res) => {
})












