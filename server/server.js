//Static file declaration
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mountRoutes = require("./routes");
const admin = require("./firebase-admin/admin");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT || 5001;
const environment = process.env.ENVIRONMENT;
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

const app = express();
app.options("*", cors());
let dirname2 = `${__dirname}/`;
app.use(express.static(path.join(dirname2, "../client/build")));
console.log(environment);
console.log(__dirname);
console.log(dirname2);

app.get("/", function(req, res) {
	res.sendFile("/usr/src/app/client/public/index.html");
});

async function verifyToken(req, res, next) {
	const idToken = req.headers.authorization;
	try {
		const decodedToken = await admin.auth().verifyIdToken(idToken);

		if (decodedToken) {
			req.body.uid = decodedToken.uid;

			return next();
		} else {
			return res.status(401).send("You are not authorized!");
		}
	} catch (e) {
		return res.status(401).send("You are not authorized!");
	}
}

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use("/notes", verifyToken);
app.use("/search/notes", verifyToken);
app.use("/search/notesUser", verifyToken);
app.use("/search/mediaUser", verifyToken);
app.use("/search/noteTags", verifyToken);
app.use("/search/tags", verifyToken);
mountRoutes(app);

if (app.get("env") === "development") {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error: err
		});
	});
}

app.listen(port, () => {});

module.exports = {
	app,
	database
};
