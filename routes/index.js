// ./routes/index.js
const users = require('./users_route')
const media = require('./media_route')
const tags = require('./tags_route')

module.exports = (app) => {
  app.use('/users', users)
  app.use('/media', media)
  app.use('/tags', tags)
}