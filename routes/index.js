// ./routes/index.js
const users = require('./user')
const media = require('./media')

module.exports = (app) => {
  app.use('/users', users)
  app.use('/media', media)
}