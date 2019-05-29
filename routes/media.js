const Router = require("express-promise-router");
const db = require("../db/index.js");

const router = new Router();

// export our router to be mounted by the parent application
module.exports = router;

async function postMediaTotal(req, res) {
	let mediaID;
	try {
		mediaID = await postMedia(req, res);
	} catch (err) {
		console.log("Media was not successfully added. ");
		return;
	}
	postMediaUserRelation(req, res, mediaID);
}

// Add a piece of media to the Media Table.
async function postMedia(req, res) {
	const { title, type, contentID } = req.body;
	let dbRes;
	let mediaID;
	try {
		dbRes = await db.query(
			'INSERT INTO "Media" ("Title", "Type", "ContentID") VALUES ($1, $2, $3) RETURNING "MediaID"',
			[title, type, contentID]
		);
		mediaID = dbRes.rows[0].MediaID;
	} catch (err) {
		if (err.code === "23505") console.log("Media is already in database.");
		else console.log("Other error code:", err.code);
		return;
	}
	return mediaID;
}

// Links a piece of Media and a User in the MediaUser Table.
async function postMediaUserRelation(req, res, mediaID) {
	console.log("test in second func", mediaID);
	const { userID } = req.body;
	try {
		dbRes = await db.query(
			'INSERT INTO "MediaUser"("MediaID", "UserID") VALUES ($1, $2) RETURNING *',
			[mediaID, userID]
		);
	} catch (err) {
		console.log("ERROR Code:", err.code);
		console.log(err);
		return;
	}
}

async function getMediaByID(req, res) {
	const { MediaID } = req.body;
	const { rows } = db.query(
		'SELECT "MediaID FROM "MediaUser" WHERE "UserID" = $1',
		[id]
	);
	return rows[0];
}

async function getMediaByUser(req, res){
  const { userID } = req.body;
	const { rows } = db.query(
		'SELECT * FROM "Media" INNER JOIN "MediaUser" ON "MediaUser"."MediaID" = "Media"."MediaID" WHERE "MediaUser"."UserID" = $1',
		[userID]
	);
	return rows;
}

router.post("/", postMediaTotal);

/*
// Gets All Media
router.get("/", async (req, res) => {
	const { type, userID, contentID } = req.body;
	console.log(req.body);
	let rows;
	try {
		rows = await db.query('SELECT * FROM "Media"');
		rows = rows.rows;
		if (rows.length === 0) {
			res.send(" No Users");
		}
	} catch (err) {
		console.log("ERROR");
	}
	res.send(rows);
});
*/

/*
//Get Media for a User
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	const { rows } = await db.query(
		'SELECT "MediaID FROM "MediaUser" WHERE "UserID" = $1',
		[id]
	);
	res.send(rows[0]);
});

//Get Single Piece of Media Given a MediaID
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	const { rows } = await db.query(
		'SELECT * FROM "Media" WHERE "MediaID" = $1',
		[id]
	);
	res.send(rows[0]);
});

//Gets a Single Piece of Media Given a UserID, a contentID, and a type.
router.get("/get", async (req, res) => {
	const { id } = req.params;
	const { rows } = await db.query(
		'SELECT * FROM "Media" WHERE "MediaID" = $1',
		[id]
	);
	res.send(rows[0]);
});



// Adds a new piece of media to the Database. 


/*
router.post("/", async (req, res) => {
	const { title, type, contentID, userID } = req.body;
	let dbRes;
	let mediaID;
	try {
		dbRes = await db.query(
			'INSERT INTO "Media" ("Title", "Type", "ContentID") VALUES ($1, $2, $3) RETURNING "MediaID"',
			[title, type, contentID]
		);
	} catch (err) {
		console.log("ERROR");
		return;
  }
  
  mediaID = dbRes.rows[0].MediaID;
  console.log(userID, mediaID);
	try {
		dbRes = await db.query(
			'INSERT INTO "MediaUser"("MediaID", "UserID") VALUES ($1, $2) RETURNING *',
			[mediaID, userID]
		);
	} catch (err) {
    console.log("ERROR");
		return;
	}
  res.send('added');
});
*/

//ToDo Remove a piece of Media from a User.
// Adds a piece of Media and adds Media Relation To a User
