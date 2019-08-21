process.env.NODE_ENV = "test";

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../server.js");

chai.use(chaiHttp);

describe("Route: '/media_user/ ", function() {
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
	

	describe("getAllMN | /media_note/", function() {
		it("getAllMN returns 404 when there are no media_notes.");

		it("getAllMN returns 200 when there are media_notes.", function(done) {
			chai
				.request(server.app)
				.get("/media_note/")
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.equal(4);
					res.body[0].should.have.property("media_id");
					res.body[0].media_id.should.equal(1);
					res.body[0].should.have.property("note_id");
					res.body[0].note_id.should.equal(1);
					done();
				});
		});
	});
	describe("getMediaMN | /media_note/media", function() {
		it(" getMediaMN returns 400 if the note_id was not provided.", function(done) {
			chai
				.request(server.app)
				.get("/media_note/media")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid note_id.");
					done();
				});
		});
		it(" getMediaMN returns 400 if the note_id was not valid.", function(done) {
			chai
				.request(server.app)
				.get("/media_note/media")
				.query({ note_id: "hullo" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid note_id.");
					done();
				});
		});
		it("getMediaMN returns 404 if there is no data", function(done) {
			chai
				.request(server.app)
				.get("/media_note/media")
				.query({ note_id: 500 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("The requested media_note was not found.");
					done();
				});
		});
		it("getMediaMN returns 200 if the note_id was valid.", function(done) {
			chai
				.request(server.app)
				.get("/media_note/media")
				.query({ note_id: 2 })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.equal(2);
					res.body[0].should.have.property("media_id");
					res.body[0].media_id.should.equal(1);
					res.body[0].should.have.property("note_id");
					res.body[0].note_id.should.equal(2);
					done();
				});
		});
	});

	describe("getNoteMN | /media_note/note", function() {
		it("getNoteMN should return 400 when no args are provided", function(done) {
			chai
				.request(server.app)
				.get("/media_note/note")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid media_id.");
					done();
				});
		});

		it("getnoteMN should return 400 when no args are provided", function(done) {
			chai
				.request(server.app)
				.get("/media_note/note")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid media_id.");
					done();
				});
		});
		it("getnoteMN returns 400 if a valid media_id was not provided.", function(done) {
			chai
				.request(server.app)
				.get("/media_note/note")
				.query({ media_id: "hello" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid media_id.");
					done();
				});
		});
		it("getnoteMN returns 404 if no media_note is found", function(done) {
			chai
				.request(server.app)
				.get("/media_note/note")
				.query({ media_id: 9001 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("The requested media_note was not found.");
					done();
				});
		});
		it(" getnoteMN returns 200 if the media_note is found", function(done) {
			chai
				.request(server.app)
				.get("/media_note/note")
				.query({ media_id: 1 })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.equal(2);
					res.body[0].should.have.property("media_id");
					res.body[0].media_id.should.equal(1);
					res.body[0].should.have.property("note_id");
					res.body[0].note_id.should.equal(1);
					done();
				});
		});
	});


	describe("postMN | /media_note/", function() {
		const validMediaObj = {
			title: "First Reformed",
			type: "MOVIE",
			CID: "1234"
		};

		const invalidMediaObj = {
			title: "The Movie",
			type: "MOVIE",
			CID: ""
		};

		it("postMN returns 400 when note_id and or media_id are missing.", function(done) {
			chai
				.request(server.app)
				.post("/media_note/")
				.send({ mediaObj: validMediaObj })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal(
						"You must provide a valid note_id and media_id."
					);
					done();
				});
		});
		it("postMN returns 400 when note_id and or media_id are invalid.", function(done) {
			chai
				.request(server.app)
				.post("/media_note/")
				.send({ note_id: "hello", media_id: "hello", mediaObj: validMediaObj })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal(
						"You must provide a valid note_id and media_id."
					);
					done();
				});
		});
		it("postMN returns 404 when note_id can't be found.", function(done) {
			chai
				.request(server.app)
				.post("/media_note/")
				.send({ note_id: 100, media_id: 1 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal(
						"The note required for this operation could not be found."
					);
					done();
				});
		});
		it("postMN returns 409 when the entry already exists", function(done) {
			chai
				.request(server.app)
				.post("/media_note/")
				.send({
					media_id: 1,
					note_id: 1,
					mediaObj: { type: "MOVIE", CID: "test", title: "A Movie" }
				})
				.end(function(err, res) {
					res.should.have.status(409);
					res.text.should.equal(
						"There was a conflict during insertion. You must provide a unique relation."
					);
					done();
				});
		});
		it("postMN returns 201 when inserted", async () => {
			let requester = chai.request(server.app).keepOpen();

			// Make sure elem is not inserted.
			res = await requester.get("/media_note/media").query({ note_id: 3 });
			res.status.should.equal(200);
			res.body.should.be.a("array");
			let test = res.body.filter(elem => {
				return elem.media_id === 1;
			});
			test.length.should.equal(0);

			// Insert elem.
			res = await requester.post("/media_note/").send({
				media_id: 1,
				note_id: 3,
				mediaObj: { type: "MOVIE", CID: "test", title: "A Movie" }
			});
			res.status.should.equal(201);
			res.body.should.be.a("array");
			res.body.should.have.length(1);
			res.body[0].should.have.property("media_id");
			res.body[0].media_id.should.equal(1);
			res.body[0].should.have.property("note_id");
			res.body[0].note_id.should.equal(3);

			// Make sure Elem is inserted.
			res = await requester.get("/media_user/media").query({ user_id: 3 });
			res.status.should.equal(200);
			res.body.should.be.a("array");
			test = res.body.filter(elem => {
				return elem.media_id === 1;
			});
			test.length.should.equal(1);

			requester.close();
		});
	});

	describe("deleteMN | /media_note/", function() {
		it("deleteMN returns 400 when both aguments are not provided", function(done) {
			chai
				.request(server.app)
				.delete("/media_note/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid media_id and note_id."
					);
					done();
				});
		});
		it("deleteMN returns 400 when both aguments are not valid", function(done) {
			chai
				.request(server.app)
				.delete("/media_note/")
				.send({ media_id: "test", note_id: "test" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid media_id and note_id."
					);
					done();
				});
		});
		it("deleteMN returns 404 when entry is not found", function(done) {
			chai
				.request(server.app)
				.delete("/media_note/")
				.send({ media_id: 10, note_id: 1 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested media_note was not found.");
					done();
				});
		});
		it("deleteMN returns 200 when entry is deleted", async () =>  {
            let requester = chai.request(server.app).keepOpen();

			// Make sure elem is present.
			res = await requester.get("/media_note/media").query({ note_id: 3});
			res.status.should.equal(200);
			res.body.should.be.a("array");
			let test = res.body.filter(elem => {
				return elem.media_id === 3;
			});
			test.length.should.equal(1);

			// Delete elem.
			res = await requester.delete("/media_note/").send({
				media_id: 3,
				note_id: 3,
			});
			res.status.should.equal(200);
			res.body.should.be.a("array");
			res.body.should.have.length(1);
			res.body[0].should.have.property("media_id");
			res.body[0].media_id.should.equal(3);
			res.body[0].should.have.property("note_id");
			res.body[0].note_id.should.equal(3);

			// Make sure Elem is deleted.
			res = await requester.get("/media_note/media").query({ note_id: 3 });
			res.status.should.equal(404);

            requester.close();
		});
    });
});



