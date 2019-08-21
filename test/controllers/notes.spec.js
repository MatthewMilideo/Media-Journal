process.env.NODE_ENV = "test";

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../server.js");

chai.use(chaiHttp);

describe("Route: '/notes/ ", function() {
	beforeEach(function(done) {
		database.migrate.rollback().then(function() {
			database.migrate.latest().then(function() {
				return database.seed.run().then(function() {
					done();
				});
			});
		});
	});

	afterEach(function(done) {
		database.migrate.rollback().then(function() {
			done();
		});
	});

	/* ~~~~~~~~~~~~~~~~~~~~~~~ GET ALL NOTES TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

	describe("getAllNotes Route: /notes/", function() {
		it("getAll returns all three notes.", function(done) {
			chai
				.request(server.app)
				.get("/notes")
				.end(function(err, res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a("array");
					res.body.length.should.equal(4);
					res.body[0].should.have.property("title");
					res.body[0].title.should.equal("First Reformed - Note");
					res.body[0].should.have.property("data");
					res.body[0].data.should.equal(
						"First Reformed is a very good movie and I like it a lot. "
					);
					res.body[0].should.have.property("user_id");
					res.body[0].user_id.should.equal(1);
					done();
				});
		});

		it("getReturns 404 if there are no notes.");

		/*async () => {
        let requester = chai.request(server.app).keepOpen();
        await requester.delete("/notes/1");
        await requester.delete("/notes/2");
        await requester.delete("/notes/3");
        await requester.delete("/notes/4");
        let res = await requester.get("/notes");
        res.status.should.equal(404);

        requester.close();
        */
	});

	/* ~~~~~~~~~~~~~~~~~~~~~~~ GET USER NOTES TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

	describe("getUserNotes Route: /notes/", function() {
		it("getUserNotes 400 if no user_id is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/user")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid user_id.");
					done();
				});
		});
		it("getUserNotes 400 if non-int user_id is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/user")
				.query({ user_id: "test" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid user_id.");
					done();
				});
		});
		it("getUserNotes 404 if non-existent user is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/user")
				.query({ user_id: 100 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested notes were not found.");
					done();
				});
		});
		it("getUserNotes 200 if accurate user is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/user")
				.query({ user_id: 1 })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.equal(2);
					res.body[0].should.have.property("id");
					res.body[0].id.should.equal(1);
					res.body[0].should.have.property("title");
					res.body[0].title.should.equal("First Reformed - Note");
					res.body[1].should.have.property("id");
					res.body[1].id.should.equal(2);
					res.body[1].should.have.property("title");
					res.body[1].title.should.equal("First Reformed Note 2");
					done();
				});
		});
	});

	/* ~~~~~~~~~~~~~~~~~~~~~~~ GET MEDIA NOTES TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

	describe("getMediaNotes | Route: /notes/media", function() {
		it("getMediaNotes returns 400 when no arguments are is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/media")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid media_id.");
					done();
				});
		});
		it("getMediaNotes returns 400 when a non-integer media_id is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/media")
				.query({ media_id: "test" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid media_id.");
					done();
				});
		});
		it("getMediaNotes returns 404 when a non-existent media_id is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/media")
				.query({ media_id: 100 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested notes were not found.");
					done();
				});
		});
		it("getMediaNotes returns 200 when a user in the database is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/media")
				.query({ media_id: 1 })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.equal(2);
					res.body[0].should.have.property("id");
					res.body[0].id.should.equal(1);
					res.body[0].should.have.property("title");
					res.body[0].title.should.equal("First Reformed - Note");
					done();
				});
		});
	});

	/* ~~~~~~~~~~~~~~~~~~~~~~~ GET MEDIAUSER NOTE TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

	describe("getMediaUserNotes | Route: /notes/mediauser", function() {
		it("getMediaUserNotes returns 400 when no media_id or user_id is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide valid media_ids and a user_id."
					);
					done();
				});
		});
		it("getMediaUserNotes returns 400 when no media_id is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ user_id: 100 })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide valid media_ids and a user_id."
					);
					done();
				});
		});
		it("getMediaUserNotes returns 400 when no user_id is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: 100 })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide valid media_ids and a user_id."
					);
					done();
				});
		});
		it("getMediaUserNotes returns 400 when non int media_id and user_id are provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: "test1", user_id: "test1" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide valid media_ids and a user_id."
					);
					done();
				});
		});
		it("getMediaUserNotes returns 404 when user_id does not have records", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: 1, user_id: 100 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested notes were not found.");
					done();
				});
		});
		it("getMediaUserNotes returns 404 when media_id does not have records", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: 100, user_id: 1 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested notes were not found.");
					done();
				});
		});
		it("getMediaUserNotes returns 404 when media_id has records but user_id does not", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: 1, user_id: 2 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested notes were not found.");
					done();
				});
		});
		it("getMediaUserNotes returns 200 when media_id and user_id have records", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: 1, user_id: 1 })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.equal(2);
					res.body[0].should.have.property("id");
					res.body[0].id.should.equal(1);
					res.body[0].should.have.property("title");
					res.body[0].title.should.equal("First Reformed - Note");
					done();
				});
		});
	});

	/* ~~~~~~~~~~~~~~~~~~~~~~~ GET MEDIAUSER NOTE TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

	describe("getMediaUserNotesBulk | Route: /notes/mediauser", function() {
		it("getMediaUserNotes returns 400 when no media_id or user_id is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide valid media_ids and a user_id."
					);
					done();
				});
		});
		it("getMediaUserNotes returns 400 when no media_id is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ user_id: 100 })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide valid media_ids and a user_id."
					);
					done();
				});
		});
		it("getMediaUserNotes returns 400 when no user_id is provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: 100 })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide valid media_ids and a user_id."
					);
					done();
				});
		});
		it("getMediaUserNotes returns 400 when non int media_id and user_id are provided", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: "test1", user_id: "test1" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide valid media_ids and a user_id."
					);
					done();
				});
		});
		it("getMediaUserNotes returns 404 when user_id does not have records", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: 1, user_id: 100 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested notes were not found.");
					done();
				});
		});
		it("getMediaUserNotes returns 404 when media_id does not have records", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: 100, user_id: 1 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested notes were not found.");
					done();
				});
		});
		it("getMediaUserNotes returns 404 when media_id has records but user_id does not", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: 1, user_id: 2 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested notes were not found.");
					done();
				});
		});
		it("getMediaUserNotes returns 200 when media_id and user_id have records", function(done) {
			chai
				.request(server.app)
				.get("/notes/mediauser")
				.query({ media_ids: 1, user_id: 1 })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.equal(2);
					res.body[0].should.have.property("id");
					res.body[0].id.should.equal(1);
					res.body[0].should.have.property("title");
					res.body[0].title.should.equal("First Reformed - Note");
					done();
				});
		});
	});


	/* ~~~~~~~~~~~~~~~~~~~~~~~ POST NOTE TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */
	describe("postNote | /notes/", function() {
		it("postNote returns 400 when the user is not provided.", function(done) {
			chai
				.request(server.app)
				.post("/notes/")
				.send({
					media_id: 1,
					title: "The Sopranos is TV",
					data: "We love to watch the Mob Men!",
					mediaObj: {
						title: "Taxi Driver",
						type: "MOVIE",
						CID: "1234567891011121314"
					}
				})
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid id.");
					done();
				});
		});

		it("postNote returns 404 when the user isn't found", function(done) {
			chai
				.request(server.app)
				.post("/notes/")
				.send({
					media_id: 500,
					user_id: 50000,
					title: "The Sopranos is TV",
					data: "We love to watch the Mob Men!",
					mediaObj: {
						title: "Taxi Driver",
						type: "MOVIE",
						CID: "1234567891011121314"
					}
				})
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("The requested user was not found.");
					done();
				});
		});
		it("postNote returns 400 when there is no media object", function(done) {
			chai
				.request(server.app)
				.post("/notes/")
				.send({
					media_id: 500,
					user_id: 1,
					title: "The Sopranos is TV",
					data: "We love to watch the Mob Men!"
				})
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid mediaObj.");
					done();
				});
		});
		it("postNote returns 400 when there is an invalid media object.", function(done) {
			chai
				.request(server.app)
				.post("/notes/")
				.send({
					media_id: 500,
					user_id: 1,
					title: "The Sopranos is TV",
					data: "We love to watch the Mob Men!",
					mediaObj: {
						title: 4,
						type: "MOVIE",
						CID: "1234567891011121314"
					}
				})
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal(
						"You must provide a valid title, type, and CID."
					);
					done();
				});
		});
		it("When the title and data are not provided postNote returns 400 and removes the media user entry.", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester.post("/notes/").send({
				media_id: 3,
				user_id: 1,
				mediaObj: {
					title: "Hello",
					type: "MOVIE",
					CID: "1234567891011121314"
				}
			});
			res.should.have.status(400);
			res.body.should.be.a("object");
			res.text.should.equal(
				"You must provide a valid user_id, title, and data."
			);

			res = await requester.get("/media_user/media").query({ user_id: 1 });
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.length.should.equal(2);
			res.body[0].should.have.property("media_id");
			res.body[0].media_id.should.equal(1);
			res.body[1].should.have.property("media_id");
			res.body[1].media_id.should.equal(2);

			requester.close();
		});

		it("When postNote succeeds but the post media note fails");

		it("When the postNote succeds for existing media ", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester.post("/notes/").send({
				media_id: 1,
				user_id: 1,
				title: "New First Reformed Note",
				data: "I think Ethan Hawke did a good job in this movie.",
				mediaObj: {
					title: "First Reformed",
					type: "MOVIE",
					CID: "1234"
				}
			});
			// Check response
			res.should.have.status(201);
			res.body.should.be.a("array");
			res.body.length.should.equal(1);
			res.body[0].should.have.property("title");
			res.body[0].title.should.equal("New First Reformed Note");
			res.body[0].should.have.property("data");
			res.body[0].data.should.equal(
				"I think Ethan Hawke did a good job in this movie."
			);
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(5);

			// Check Media Notes
			res = await requester.get("/media_note/");
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.length.should.equal(5);
			res.body[4].should.have.property("media_id");
			res.body[4].media_id.should.equal(1);
			res.body[4].should.have.property("note_id");
			res.body[4].note_id.should.equal(5);

			// Check Notes
			res = await requester.get("/notes/");
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.length.should.equal(5);
			res.body[4].should.have.property("title");
			res.body[4].title.should.equal("New First Reformed Note");
			res.body[4].should.have.property("data");
			res.body[4].data.should.equal(
				"I think Ethan Hawke did a good job in this movie."
			);
			res.body[4].should.have.property("id");
			res.body[4].id.should.equal(5);

			requester.close();
		});

		it("When the postNote succeds for non-existent media ", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester.post("/notes/").send({
				media_id: 100,
				user_id: 1,
				title: "Taxi Driver Note",
				data: "I think Robert did a good job in this movie.",
				mediaObj: {
					title: "Taxi Driver",
					type: "MOVIE",
					CID: "12345"
				}
			});
			// Check response
			res.should.have.status(201);
			res.body.should.be.a("array");
			res.body.length.should.equal(1);
			res.body[0].should.have.property("title");
			res.body[0].title.should.equal("Taxi Driver Note");
			res.body[0].should.have.property("data");
			res.body[0].data.should.equal(
				"I think Robert did a good job in this movie."
			);
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(5);

			// Check Media
			res = await requester.get("/media/");
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.length.should.equal(4);
			res.body[3].should.have.property("id");
			res.body[3].id.should.equal(4);
			res.body[3].should.have.property("title");
			res.body[3].title.should.equal("Taxi Driver");

			// Check Media Notes
			res = await requester.get("/media_note/");
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.length.should.equal(5);
			res.body[4].should.have.property("media_id");
			res.body[4].media_id.should.equal(4);
			res.body[4].should.have.property("note_id");
			res.body[4].note_id.should.equal(5);

			// Check Notes
			res = await requester.get("/notes/");
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.length.should.equal(5);
			res.body[4].should.have.property("title");
			res.body[4].title.should.equal("Taxi Driver Note");
			res.body[4].should.have.property("data");
			res.body[4].data.should.equal(
				"I think Robert did a good job in this movie."
			);
			res.body[4].should.have.property("id");
			res.body[4].id.should.equal(5);

			requester.close();
		});
	});
	describe("deleteNote | /notes/", function() {
		it("deleteNote returns 400 when the note_id is not provided.", function(done) {
			chai
				.request(server.app)
				.delete("/notes/")
				.send({})
				.end(function(err, res) {
					res.should.have.status(400);

					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid note_id.");
					done();
				});
		});
		it("deleteNote returns 400 when the note_id is invalid ", function(done) {
			chai
				.request(server.app)
				.delete("/notes/")
				.send({ note_id: "test" })
				.end(function(err, res) {
					res.should.have.status(400);

					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid note_id.");
					done();
				});
		});
		it("deleteNote returns 404 when the note is not found ", function(done) {
			chai
				.request(server.app)
				.delete("/notes/")
				.send({ note_id: 1000 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("The requested note was not found.");
					done();
				});
		});
		it("deletes the Note and 200", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester.delete("/notes/").send({ note_id: 1 });

			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.should.have.length(1);
			res.body[0].should.have.property("title");
			res.body[0].title.should.equal("First Reformed - Note");
			res.body[0].should.have.property("data");
			res.body[0].data.should.equal(
				"First Reformed is a very good movie and I like it a lot. "
			);
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(1);

			res = await requester.get("/notes/");
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.length.should.equal(3);
			res.body[0].should.have.property("title");
			res.body[0].title.should.equal("First Reformed Note 2");
			res.body[0].should.have.property("data");
			res.body[0].data.should.equal(
				"I love the movie First Reformed. It is very good. "
			);
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(2);

			res = await requester.get("/media_note/");
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.length.should.equal(3);

			requester.close();
		});
	});
});
