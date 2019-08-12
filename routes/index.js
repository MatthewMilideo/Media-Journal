// ./routes/index.js
const users = require('./users_route')
const media = require('./media_route')
const tags = require('./tags_route')
const notes = require('./notes_route')
const notes_tag = require('./notes_tag_route')
const media_user = require('./media_user_route')


module.exports = (app) => {
  app.use('/users', users)
  app.use('/media', media)
  app.use('/tags', tags)
  app.use('/notes', notes)
  app.use('/media_user', media_user)
  app.use('/note_tag', notes_tag)

}