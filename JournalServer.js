//Static file declaration
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mountRoutes = require("./routes");
const port = 3000;

const environment = "production";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

const admin = require("./firebase-admin/admin");

const app = express();
app.disable("x-powered-by");
const path = require("path");


app.use(express.static(path.join(__dirname, "client/build")));
app.get("/*", function(req, res) {
	res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.use(cors({}));

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
