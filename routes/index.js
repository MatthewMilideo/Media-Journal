// ./routes/index.js

const search = require("./search_route");
const notes = require("./notes_route");
const users = require("./users_route");

module.exports = app => {
	app.use("/journal/search", search);
	app.use("/journal/notes", notes);
	app.use("/journal/user", users);
};
