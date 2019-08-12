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
                res.should.be.json; // jshint ignore:line
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

    it("getReturns 404 if there are no notes.", async () => {
        let requester = chai.request(server.app).keepOpen();
        await requester.delete("/notes/1");
        await requester.delete("/notes/2");
        await requester.delete("/notes/3");
        await requester.delete("/notes/4");
        let res = await requester.get("/notes");
        res.status.should.equal(404);

        requester.close();
    });
});

/* ~~~~~~~~~~~~~~~~~~~~~~~ GET USER NOTES TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

describe("getUserNotes Route: /notes/", function() {
    it("getUserNotes 400 if no user_id is provided", function(done) {
        chai
            .request(server.app)
            .get("/notes/user")
            .end(function(err, res) {
                res.should.have.status(400);
                res.text.should.equal("The user_id must be an integer.");
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
                res.text.should.equal("The user_id must be an integer.");
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
                res.text.should.equal("No notes found.");
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
    it("getMediaNotes returns 400 when no media_id is provided", function(done) {
        chai
            .request(server.app)
            .get("/notes/media")
            .end(function(err, res) {
                res.should.have.status(400);
                res.text.should.equal("The media_id must be an integer.");
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
                res.text.should.equal("The media_id must be an integer.");
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
                res.text.should.equal("No notes found.");
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
                res.text.should.equal("The media_id and user_id must be integers.");
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
                res.text.should.equal("The media_id and user_id must be integers.");
                done();
            });
    });
    it("getMediaUserNotes returns 400 when no user_id is provided", function(done) {
        chai
            .request(server.app)
            .get("/notes/mediauser")
            .query({ media_id: 100 })
            .end(function(err, res) {
                res.should.have.status(400);
                res.text.should.equal("The media_id and user_id must be integers.");
                done();
            });
    });
    it("getMediaUserNotes returns 400 when non int media_id and user_id are provided", function(done) {
        chai
            .request(server.app)
            .get("/notes/mediauser")
            .query({ media_id: "test1", user_id: "test1" })
            .end(function(err, res) {
                res.should.have.status(400);
                res.text.should.equal("The media_id and user_id must be integers.");
                done();
            });
    });
    it("getMediaUserNotes returns 404 when user_id does not have records", function(done) {
        chai
            .request(server.app)
            .get("/notes/mediauser")
            .query({ media_id: 1, user_id: 100 })
            .end(function(err, res) {
                res.should.have.status(404);
                res.text.should.equal("No notes found");
                done();
            });
    });
    it("getMediaUserNotes returns 404 when media_id does not have records", function(done) {
        chai
            .request(server.app)
            .get("/notes/mediauser")
            .query({ media_id: 100, user_id: 1 })
            .end(function(err, res) {
                res.should.have.status(404);
                res.text.should.equal("No notes found");
                done();
            });
    });
    it("getMediaUserNotes returns 404 when media_id has records but user_id does not", function(done) {
        chai
            .request(server.app)
            .get("/notes/mediauser")
            .query({ media_id: 1, user_id: 2 })
            .end(function(err, res) {
                res.should.have.status(404);
                res.text.should.equal("No notes found");
                done();
            });
    });
    it("getMediaUserNotes returns 200 when media_id and user_id have records", function(done) {
        chai
            .request(server.app)
            .get("/notes/mediauser")
            .query({ media_id: 1, user_id: 1 })
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
		it("postNote returns 400 when all of the required arguments are not provided.", function(done) {
			chai
				.request(server.app)
				.post("/notes/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"The media_id and user_id must be integers"
					);
					done();
				});
		});
		it("postNote returns 400 when ID's are correct and strings are incorect", function(done) {
			chai
				.request(server.app)
				.post("/notes/")
				.send({media_id: 1, user_id: 1, note_title: undefined, note_data: null})
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"The note_title and note_data must be defined"
					);
					done();
				});
		});
		it("postNote returns 400 when ID's are incorrect and strings are correct", function(done) {
			chai
				.request(server.app)
				.post("/notes/")
				.send({media_id: 'test', user_id: null, note_title: 'Hello', note_data: 'hello'})
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"The media_id and user_id must be integers"
					);
					done();
				});
		});
		it("postNote returns 201 when provided correct info", function(done) {
			chai
				.request(server.app)
				.post("/notes/")
				.send({media_id: 2, user_id: 2, note_title: 'The Sopranos is TV', note_data: 'We love to watch the Mob Men!'})
				.end(function(err, res) {
					res.should.have.status(201);
					console.log(res.body);
					res.body.should.be.a("array");
					res.body[0].should.have.property("id");
					res.body[0].id.should.equal(5);
					res.body[0].should.have.property("title");
					res.body[0].title.should.equal("The Sopranos is TV");
					done();
				});
		});
	});

	/* ~~~~~~~~~~~~~~~~~~~~~~~ DELETE NOTE TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

	describe("DELETE /notes/:id", function() {
		it("Deletes a note with a given ID", async () => {
			let requester = chai.request(server.app).keepOpen();

			let res = await requester.delete("/notes/1");
			res.should.have.status(200);
			res.should.be.json; // jshint ignore:line
			res.body.should.be.a("array");
			res.body.length.should.equal(1);
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(1);
			res.body[0].should.have.property("title");
			res.body[0].title.should.equal("First Reformed - Note");
			res.body[0].should.have.property("data");
			res.body[0].data.should.equal(
				"First Reformed is a very good movie and I like it a lot. "
			);
			res.body[0].should.have.property("user_id");
			res.body[0].user_id.should.equal(1);

			res = await requester.get("/notes");

			res.should.have.status(200);
			res.should.be.json; // jshint ignore:line
			res.body.should.be.a("array");
			res.body.length.should.equal(3);
			res.body[0].should.have.property("title");
			res.body[0].title.should.equal("First Reformed Note 2");

			requester.close();
		});
	});
});
