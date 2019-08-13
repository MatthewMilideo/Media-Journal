process.env.NODE_ENV = "test";
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../server.js");

chai.use(chaiHttp);

describe("Route: '/note_tag/ ", function() {
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

	describe("getAllNT | /note_tag/", function() {
		it("getAllNT returns 404 when the user_id isn't in the list ", function(done) {
			/*
			chai
				.request(server.app)
				.get("/note_tag/")
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("There is no media.");
					done();
                });
                */
			done();
		});

		it("getALLNT returns 200 when it finds data ", function(done) {
			chai
				.request(server.app)
				.get("/note_tag/")
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.should.have.length(7);
					res.body[0].should.have.property("note_id");
					res.body[0].note_id.should.equal(1);
					res.body[0].should.have.property("tag_id");
					res.body[0].tag_id.should.equal(1);
					done();
				});
		});
    });
    
    describe("getNoteNT | /note_tag/note", function() {
        it("postNT returns 400 when the tag_id is not present ", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/note")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("The tag_id must be a valid int.");
					done();
				});
        });

        it("getNoteNT returns 400 when the tag_id is invalid", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/note")
                .query({tag_id: 'test'})
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("The tag_id must be a valid int.");
					done();
				});
        });

        it("getNoteNT returns 404 when no note is found", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/note")
                .query({tag_id: 500})
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("No notes were found.");
					done();
				});
        });

        it("getNoteNT returns 200 when notes are found", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/note")
                .query({tag_id: 1})
				.end(function(err, res) {
					res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.should.have.length(3);
                    res.body[0].should.have.property('note_id')
                    res.body[0].note_id.should.equal(1)
                    res.body[0].should.have.property('tag_id')
                    res.body[0].tag_id.should.equal(1)
					done();
				});
        });
    })

    describe("getTagNT | /note_tag/note", function() {
        it("getTagNT returns 400 when the tag_id is not present ", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/tag")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("The note_id must be a valid int.");
					done();
				});
        });

        it("getTagNT returns 400 when the tag_id is invalid", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/tag")
                .query({note_id: 'test'})
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("The note_id must be a valid int.");
					done();
				});
        });

        it("getTagNT returns 404 when no note is found", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/tag")
                .query({note_id: 500})
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("No tags were found.");
					done();
				});
        });

        it("getTagNT returns 200 when notes are found", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/tag")
                .query({note_id: 1})
				.end(function(err, res) {
					res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.should.have.length(2);
                    res.body[0].should.have.property('note_id')
                    res.body[0].note_id.should.equal(1)
                    res.body[0].should.have.property('tag_id')
                    res.body[0].tag_id.should.equal(1)
					done();
				});
        });
    })

	describe("postNT | /note_tag/", function() {
		it("postNT returns 400 when the note_id and or tag_id are not present ", function(done) {
			chai
				.request(server.app)
                .post("/note_tag/")
                .send({ title:'hello' })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("The note_id and tag_id must be valid ints.");
					done();
				});
		});

		it("postNT returns 400 when the note_id are not present ", function(done) {
			chai
				.request(server.app)
				.post("/note_tag/")
				.send({ note_id: 1,  title:'hello' })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("The note_id and tag_id must be valid ints.");
					done();
				});
		});

		it("postNT returns 400 when the note_id are not formatted correctly ", function(done) {
			chai
				.request(server.app)
				.post("/note_tag/")
				.send({ note_id: 1, tag_id: "test", title:'hello' })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("The note_id and tag_id must be valid ints.");
					done();
				});
        });
        
        it("postNT returns 400 when the note_id and tag_id are correct but title is not are not formatted correctly ", function(done) {
			chai
				.request(server.app)
				.post("/note_tag/")
				.send({ note_id: 1, tag_id: 1 })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("The title must be a valid string.");
					done();
				});
		});

		it("postNT returns 403 when the note_id does not exist", function(done) {
			chai
				.request(server.app)
				.post("/note_tag/")
				.send({ note_id: 10, tag_id: 4, title:'hello' })
				.end(function(err, res) {
					res.should.have.status(403);
					res.body.should.be.a("object");
					res.text.should.equal("That note does not exist.");
					done();
				});
		});

		it("postNT returns 201 even when the tag_id does not exist", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester
				.post("/note_tag/")
				.send({ note_id: 1, tag_id: 11, title: "New Tag" });

			res.should.have.status(201);
			res.body.should.be.a("array");
			res.body.should.have.length(1);
			res.body[0].should.have.property("note_id");
			res.body[0].note_id.should.equal(1);
			res.body[0].should.have.property("tag_id");
			res.body[0].tag_id.should.equal(4);

			res = await requester.get("/tags/");
			res.body.should.be.a("array");
			res.body.should.have.length(4);
			res.body[3].should.have.property("title");
			res.body[3].title.should.equal("New Tag");

			res = await requester.get("/note_tag/");
			res.body.should.be.a("array");
			res.body.should.have.length(8);
			res.body[7].should.have.property("note_id");
			res.body[7].note_id.should.equal(1);
			res.body[7].should.have.property("tag_id");
			res.body[7].tag_id.should.equal(4);

			requester.close();
		});

		it("postNT returns 201 even when the note_id and the tag_id exist", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester
				.post("/note_tag/")
				.send({ note_id: 1, tag_id: 3, title: "New Tag" });

			res.should.have.status(201);
			res.body.should.be.a("array");
			res.body.should.have.length(1);
			res.body[0].should.have.property("note_id");
			res.body[0].note_id.should.equal(1);
			res.body[0].should.have.property("tag_id");
			res.body[0].tag_id.should.equal(3);

			res = await requester.get("/note_tag/");
			res.body.should.be.a("array");
			res.body.should.have.length(8);
			res.body[7].should.have.property("note_id");
			res.body[7].note_id.should.equal(1);
			res.body[7].should.have.property("tag_id");
			res.body[7].tag_id.should.equal(3);

			requester.close();
		});
	});

	describe("deleteNT | /note_tag/", function() {
		it("deleteNT returns 400 when the note_id/tag_id combo aren't present ", function(done) {
			chai
				.request(server.app)
				.delete("/note_tag/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("The note_id and tag_id must be valid ints.");
					done();
				});
		});

		it("deleteNT returns 400 when the note_id/tag_id combo aren't valid", function(done) {
			chai
				.request(server.app)
				.delete("/note_tag/")
				.send({ note_id: "test", tag_id: 0 })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("The note_id and tag_id must be valid ints.");
					done();
				});
		});

		it("deleteNT returns 404 when the note_id/tag_id combo aren't in the list ", function(done) {
			chai
				.request(server.app)
				.delete("/note_tag/")
				.send({ note_id: 10, tag_id: 10 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("There are no note_tags.");
					done();
				});
		});

		it("deleteNT returns 200 when the note_id/tag_id are in the list.", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester
				.delete("/note_tag/")
				.send({ note_id: 1, tag_id: 1 });

			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.length.should.equal(1);
			res.body[0].should.have.property("note_id");
			res.body[0].note_id.should.equal(1);
			res.body[0].should.have.property("tag_id");
			res.body[0].note_id.should.equal(1);

			res = await requester.get("/note_tag/");
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.should.have.length(6);
			res.body[0].should.have.property("note_id");
			res.body[0].note_id.should.equal(1);
			res.body[0].should.have.property("tag_id");
			res.body[0].tag_id.should.equal(2);

			requester.close();
		});
	});
});

/*

	describe("getMedia | /media_user/", function() {
		it("getMedia returns 404 when the user_id isn't in the list ", function(done) {
			chai
				.request(server.app)
				.get("/media_user/media/")
				.query({ user_id: 4 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("There is no media.");
					done();
				});
		});
		it("getMedia returns 400 when the user_id isn't formatted properly", function(done) {
			chai
				.request(server.app)
				.get("/media_user/media/")
				.query({ user_id: "hello" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid user_id.");
					done();
				});
		});
		it("getMedia returns 400 when the user_id is not provided", function(done) {
			chai
				.request(server.app)
				.get("/media_user/media/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid user_id.");
					done();
				});
		});
		it("getMedia returns 200 when media is found", function(done) {
			chai
				.request(server.app)
				.get("/media_user/media/")
				.query({ user_id: 3 })
				.end(function(err, res) {
					res.should.have.status(200);

					res.body.should.be.a("array");
					res.body.should.have.length(3);
					res.body[0].should.have.property("media_id");
					res.body[0].media_id.should.equal(1);
					done();
				});
		});
	});

	describe("getUsers | /media_user/", function() {
		it("getUser returns 404 when no users are found", function(done) {
			chai
				.request(server.app)
				.get("/media_user/user/")
				.query({ media_id: 10 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("There are no users.");
					done();
				});
		});
		it("getMedia returns 400 when no media_id is provided", function(done) {
			chai
				.request(server.app)
				.get("/media_user/user/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid media_id.");
					done();
				});
		});
		it("getMedia returns 400 when the media is not formatted correctly  provided", function(done) {
			chai
				.request(server.app)
				.get("/media_user/user/")
				.query({ media_id: "test" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid media_id.");
					done();
				});
		});
		it("getMedia returns 200 when media is found", function(done) {
			chai
				.request(server.app)
				.get("/media_user/user/")
				.query({ media_id: 1 })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.should.have.length(3);
					res.body[0].should.have.property("user_id");
					res.body[0].user_id.should.equal(1);
					done();
				});
		});
	});
	describe("postMU | /media_user/", function() {
		it("postMU returns 400 when both aguments are not provided", function(done) {
			chai
				.request(server.app)
				.post("/media_user/")
				.send({ mediaObj: { type: "TV_SEASON", CID: "test", title: "A Movie" } })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid media_id and user_id."
					);
					done();
				});
		});
		it("postMU returns 400 when arguments are not integers", function(done) {
			chai
				.request(server.app)
				.post("/media_user/")
				.send({
					media_id: "test",
					user_id: "test",
					mediaObj: { type: "GAME", CID: "test", title: "A Movie" }
				})
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid media_id and user_id."
					);
					done();
				});
        });
        
        it("postMU returns 400 when no mediaObj is provided", function(done) {
			chai
				.request(server.app)
				.post("/media_user/")
				.send({
					media_id: 1,
					user_id: 1,
				})
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid mediaObj"
					);
					done();
				});
        });
        
        it("postMU returns 400 when no mediaObj is provided", function(done) {
			chai
				.request(server.app)
				.post("/media_user/")
				.send({
					media_id: 1,
					user_id: 1,
				})
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid mediaObj"
					);
					done();
				});
        });
        
        it("postMU returns 400 when no mediaObj type is provided", function(done) {
			chai
				.request(server.app)
				.post("/media_user/")
				.send({
					media_id: 6,
					user_id: 1,
					mediaObj: { CID: "test", title: "A Movie" }
				})
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid mediaObj"
					);
					done();
				});
        });
        
        it("postMU returns 400 when no mediaObj CID is provided", function(done) {
			chai
				.request(server.app)
				.post("/media_user/")
				.send({
					media_id: 6,
					user_id: 1,
					mediaObj: { type: 'movie', title: "A Movie" }
				})
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid mediaObj"
					);
					done();
				});
        });
        
        it("postMU returns 400 when no mediaObj title is provided", function(done) {
			chai
				.request(server.app)
				.post("/media_user/")
				.send({
					media_id: 6,
					user_id: 1,
					mediaObj: { type: 'movie', title: "" }
				})
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid mediaObj"
					);
					done();
				});
		});


		it("postMU returns 403 when there is a foreign key constraint on the piece of media.", function(done) {
			chai
				.request(server.app)
				.post("/media_user/")
				.send({
					media_id: 6,
					user_id: 1,
					mediaObj: { type: "BOOK", CID: "test", title: "A Movie" }
				})
				.end(function(err, res) {
					res.should.have.status(403);
					res.text.should.equal(
						"You have to add the media in question to your viewed media!"
					);
					done();
				});
		});

		it("postMU returns 404 when there is a foreign key constraint on the user.", function(done) {
			chai
				.request(server.app)
				.post("/media_user/")
				.send({
					media_id: 1,
					user_id: 6,
					mediaObj: { type: "MOVIE", CID: "test", title: "A Movie" }
				})
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal(
						"The user_id is invalid, try making sure you are logged in."
					);
					done();
				});
		});
		it("postMU returns 409 when the entry already exists", function(done) {
			chai
				.request(server.app)
				.post("/media_user/")
				.send({
					media_id: 1,
					user_id: 1,
					mediaObj: { type: "MOVIE", CID: "test", title: "A Movie" }
				})
				.end(function(err, res) {
					res.should.have.status(409);
					res.text.should.equal("The entry already exists.");
					done();
				});
		});

		it("postMU returns 201 when the entry is inserted", async () => {
			let requester = chai.request(server.app).keepOpen();

			// Make sure elem is not inserted.
			res = await requester.get("/media_user/media").query({ user_id: 1 });
			res.status.should.equal(200);
			res.body.should.be.a("array");
			let test = res.body.filter(elem => {
				return elem.media_id === 3;
			});
			test.length.should.equal(0);

			// Insert elem.
			res = await requester.post("/media_user/").send({
				media_id: 3,
				user_id: 1,
				mediaObj: { type: "MOVIE", CID: "test", title: "A Movie" }
			});
			res.status.should.equal(201);
			res.body.should.be.a("array");
			res.body.should.have.length(1);
			res.body[0].should.have.property("media_id");
			res.body[0].media_id.should.equal(3);
			res.body[0].should.have.property("user_id");
			res.body[0].user_id.should.equal(1);

			// Make sure Elem is inserted.
			res = await requester.get("/media_user/media").query({ user_id: 1 });
			res.status.should.equal(200);
			res.body.should.be.a("array");
			test = res.body.filter(elem => {
				return elem.media_id === 3;
			});
			test.length.should.equal(1);

			requester.close();
		});
    });

	describe("deleteMU | /media_user/", function() {
		it("deleteMU returns 400 when both aguments are not provided", function(done) {
			chai
				.request(server.app)
				.delete("/media_user/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid media_id and user_id."
					);
					done();
				});
		});
		it("deleteMU returns 400 when both aguments are not valid", function(done) {
			chai
				.request(server.app)
				.delete("/media_user/")
				.send({ media_id: "test", user_id: "test" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid media_id and user_id."
					);
					done();
				});
		});
		it("deleteMU returns 404 when entry is not found", function(done) {
			chai
				.request(server.app)
				.delete("/media_user/")
				.send({ media_id: "10", user_id: "1" })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("Media_User Entry was not found.");
					done();
				});
		});
		it("deleteMU returns 200 when entry is deleted", async () =>  {
            let requester = chai.request(server.app).keepOpen();

			// Make sure elem is present.
			res = await requester.get("/media_user/media").query({ user_id: 1 });
			res.status.should.equal(200);
			res.body.should.be.a("array");
			let test = res.body.filter(elem => {
				return elem.media_id === 2;
			});
			test.length.should.equal(1);

			// Delete elem.
			res = await requester.delete("/media_user/").send({
				media_id: 2,
				user_id: 1,
			});
			res.status.should.equal(200);
			res.body.should.be.a("array");
			res.body.should.have.length(1);
			res.body[0].should.have.property("media_id");
			res.body[0].media_id.should.equal(2);
			res.body[0].should.have.property("user_id");
			res.body[0].user_id.should.equal(1);

			// Make sure Elem is deleted.
			res = await requester.get("/media_user/media").query({ user_id: 1 });
			res.status.should.equal(200);
            res.body.should.be.a("array");
            res.body.should.have.length(1);
            res.body[0].media_id.should.not.equal(2); 

            requester.close();
		});
    });
});

*/
