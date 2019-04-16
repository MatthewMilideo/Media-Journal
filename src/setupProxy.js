const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(proxy('/games', { target: 'https://api-v3.igdb.com', changeOrigin: true }));
  };
  