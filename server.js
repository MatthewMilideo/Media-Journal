//Static file declaration
const express = require('express');
const jsonServer = require('json-server');
const middlewares = jsonServer.defaults()
const path = require('path')

const app = express();
const port = process.env.PORT || 5000;

console.log(middlewares);

app.use(middlewares);


const router = jsonServer.router(path.join(__dirname+'/api', 'db.json'))
app.use(router);

//production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  

  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname = 'client/build/index.html'));
  })
}


//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
})

//start server
app.listen(port, (req, res) => {
console.log( `server listening on port: ${port}`);
})








// You may want to mount JSON Server on a specific end-point, for example /api
// Optiona,l except if you want to have JSON Server defaults
// server.use('/api', jsonServer.defaults()); 



