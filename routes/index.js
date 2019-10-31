// ./routes/index.js

const search = require("./search_route");
const notes = require("./notes_route");
const users = require("./users_route");

module.exports = app => {
	app.use("/search", search);
	app.use("/notes", notes);
	app.use("/user", users);
};
