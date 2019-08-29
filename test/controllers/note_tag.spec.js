process.env.NODE_ENV = "test";
const environment = process.env.NODE_ENV || "development";
const configuration = require("../../knexfile")[environment];
const database = require("knex")(configuration);
const expect = require("chai").expect;

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../../server.js");
chai.use(require("chai-as-promised"));

const noteTag = require("../../models/notes_tag_model");
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
		it("getAllNT returns 404 when the user_id isn't in the list ", async() => {
			let requester = chai.request(server.app).keepOpen();
			await requester.delete('/note_tag/').send({ note_id: 1, tag_id: 1});
			await requester.delete('/note_tag/').send({ note_id: 1, tag_id: 2});
			await requester.delete('/note_tag/').send({ note_id: 2, tag_id: 1});
			await requester.delete('/note_tag/').send({ note_id: 2, tag_id: 2});
			await requester.delete('/note_tag/').send({ note_id: 3, tag_id: 1});
			await requester.delete('/note_tag/').send({ note_id: 3, tag_id: 2});
			await requester.delete('/note_tag/').send({ note_id: 3, tag_id: 3});

			let res = await requester.get('/note_tag/');
			res.should.have.status(404);
			res.body.should.be.a("object");
			res.text.should.equal('The requested note_tags were not found.')
			requester.close();
		});

		it("getALLNT returns 200 and all NTs when there is data.", function(done) {
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
        it("getNoteNT returns 400 when the tag_id is not present ", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/note")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid tag_id.");
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
					res.text.should.equal("You must provide a valid tag_id.");
					done();
				});
        });

        it("getNoteNT returns 404 when no note_tag is found", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/note")
                .query({tag_id: 500})
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("The requested note_tag was not found.");
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
        it("getTagNT returns 400 when the note_id is not present ", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/tag")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid note_id.");
					done();
				});
        });

        it("getTagNT returns 400 when the note_id is invalid", function(done) {
			chai
				.request(server.app)
                .get("/note_tag/tag")
                .query({note_id: 'test'})
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid note_id.");
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
					res.text.should.equal("The requested note_tag was not found.");
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
					res.text.should.equal("You must provide a valid note_id and tag_id.");
					done();
				});
		});

		it("postNT returns 400 when the note_id are not present ", function(done) {
			chai
				.request(server.app)
				.post("/note_tag/")
				.send({ note_id: 1, title:'hello' })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid note_id and tag_id.");
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
					res.text.should.equal("You must provide a valid note_id and tag_id.");
					done();
				});
        });
        
        it("postNT returns 400 when the note_id and tag_id are correct but title is not are not formatted correctly ", function(done) {
			chai
				.request(server.app)
				.post("/note_tag/")
				.send({ note_id: 1, tag_id: 100 })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid title.");
					done();
				});
		});

		it("postNT returns 409 when the title already exists", function(done) {
			chai
				.request(server.app)
				.post("/note_tag/")
				.send({ note_id: 1, tag_id: 100, title: 'Sad' })
				.end(function(err, res) {
					res.should.have.status(409);
					res.body.should.be.a("object");
					res.text.should.equal("There was a conflict during insertion. You must provide a unique title.");
					done();
				});
		});

		it("postNT returns 403 when the note_id does not exist", function(done) {
			chai
				.request(server.app)
				.post("/note_tag/")
				.send({ note_id: 10, tag_id: 4, title:'hello' })
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("The note_id required for this operation could not be found.");
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
					res.text.should.equal("You must provide a valid note_id and tag_id.");
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
					res.text.should.equal("You must provide a valid note_id and tag_id.");
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
					res.text.should.equal("The requested note_tag was not found. ");
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
	describe("getTagNTBulk", function() {
		it("getTagNTBulk returns 400 when no note_ids are provided", async () => {
			let res = await expect(noteTag.getTagNTBulk()).to.be.rejected;
			expect(res.status).to.equal(400);
		});

		it("getTagNTBulk returns 400 when no note_ids are provided", async () => {
			let res = await expect(noteTag.getTagNTBulk("test")).to.be.rejected;
			expect(res.status).to.equal(400);
		});

		it("getTagNTBulk returns 400 when no note_ids are provided", async () => {
			let res = await expect(noteTag.getTagNTBulk(["1test", 1, 2, 3, 4, 5])).to
				.be.rejected;
			expect(res.status).to.equal(400);
		});

		it("getTagNTBulk returns 200 when no note_ids are provided", async () => {
			let res = await noteTag.getTagNTBulk(1);
			expect(res.status).to.equal(200);
		});

		it("getTagNTBulk returns 200 when no note_ids are provided", async () => {
			let res = await noteTag.getTagNTBulk([1, 2]);
			expect(res.status).to.equal(200);
		});

		it("getTagNTBulk returns 404 when no note_ids are provided", async () => {
			let res = await noteTag.getTagNTBulk([122222222, 2000000]);
			expect(res.status).to.equal(404);
	
		});
	});
});
