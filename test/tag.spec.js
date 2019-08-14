process.env.NODE_ENV = "test";
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../server.js");

chai.use(chaiHttp);

describe("Route: '/tags/ ", function() {
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

	/* ~~~~~~~~~~~~~~~~~~~~~~~ GET ALL TAGS TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

	describe("getAllTags | /tags/", function() {
		it("getAllTags returns 404 when no tags are found", async() => {
			let requester = chai.request(server.app).keepOpen();
			await requester.delete('/note_tag/').send({ note_id: 1, tag_id: 1});
			await requester.delete('/note_tag/').send({ note_id: 1, tag_id: 2});
			await requester.delete('/note_tag/').send({ note_id: 2, tag_id: 1});
			await requester.delete('/note_tag/').send({ note_id: 2, tag_id: 2});
			await requester.delete('/note_tag/').send({ note_id: 3, tag_id: 1});
			await requester.delete('/note_tag/').send({ note_id: 3, tag_id: 2});
			await requester.delete('/note_tag/').send({ note_id: 3, tag_id: 3});

			await requester.delete('/tags/').send({ id: 1});
			await requester.delete('/tags/').send({ id: 2});
			await requester.delete('/tags/').send({ id: 3});

			let res = await requester.get('/tags/');
			res.should.have.status(404);
			res.body.should.be.a("object");
			res.text.should.equal('The requested tags were not found.')
			requester.close();
		});
	});

	describe("getAllTags | /tags/", function() {
		it("getAllMedia returns 200 when tags is found", function(done) {
			chai
				.request(server.app)
				.get("/tags/")
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.should.have.length(3);
					res.body[0].should.have.property("id");
					res.body[0].id.should.equal(1);
					res.body[0].should.have.property("title");
					res.body[0].title.should.equal("Sad");
					done();
				});
		});
	});

	describe("getTagID | /tags/", function() {
		it("getTagID returns 400 when an id is not provided", function(done) {
			chai
				.request(server.app)
				.get("/tags/ID")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid id.");
					done();
				});
		});
		it("getTagID returns 400 when an invalid argument is provided", function(done) {
			chai
				.request(server.app)
				.get("/tags/ID")
				.query({ id: "TEST" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid id.");
					done();
				});
		});
		it("getTagID returns 404 no data is found.", function(done) {
			chai
				.request(server.app)
				.get("/tags/ID")
				.query({ id: 10 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested tag was not found.");
					done();
				});
		});
		it("getTagID returns 200 when data is found.", function(done) {
			chai
				.request(server.app)
				.get("/tags/ID")
				.query({ id: 1 })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.should.have.length(1);
					res.body[0].should.have.property("id");
					res.body[0].id.should.equal(1);
					res.body[0].should.have.property("title");
					res.body[0].title.should.equal("Sad");
					done();
				});
		});
	});
	describe("postTag | /tags/", function() {
		it("postTag returns 400 when arguments aren't provided", function(done) {
			chai
				.request(server.app)
				.post("/tags/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid title.");
					done();
				});
		});
		it("postTag returns 409 when a tag that is already in use is provided", function(done) {
			chai
				.request(server.app)
				.post("/tags/")
				.send({ title: "Sad" })
				.end(function(err, res) {
					res.should.have.status(409);
					res.text.should.equal("There was a conflict during insertion. You must provide a unique title.");
					done();
				});
		});
		it("postTag returns 201 when a tag that is correctly", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester.post("/tags/").send({ title: "very sad" });
			res.should.have.status(201);
			res.body.should.be.a("array");
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(4);
			res.body[0].should.have.property("title");
			res.body[0].title.should.equal("very sad");

			res = await requester.get("/tags/");
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.should.have.length(4);
			res.body[3].should.have.property("id");
			res.body[3].id.should.equal(4);
			res.body[3].should.have.property("title");
			res.body[3].title.should.equal("very sad");

			requester.close();
		});
	});

	describe("deleteTag | /tags/", function() {
		it("deleteTag returns 400 when arguments aren't provided", function(done) {
			chai
				.request(server.app)
				.delete("/tags/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid id.");
					done();
				});
		});
		it("deleteTag returns 400 when the argument is incorrectly formatted.", function(done) {
			chai
				.request(server.app)
				.delete("/tags/")
				.send({ id: "test" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid id.");
					done();
				});
		});
		it("deleteTag returns 404 when the id is not found.", function(done) {
			chai
				.request(server.app)
				.delete("/tags/")
				.send({ id: "100" })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested tag was not found.");
					done();
				});
		});
		it("deleteTag returns 403 when the argument can not be deleted due to a foreign key constraint.", function(done) {
			chai
				.request(server.app)
				.delete("/tags/")
				.send({ id: 1 })
				.end(function(err, res) {
					res.should.have.status(403);
					res.text.should.equal("A constraint prevented this request from being fulfilled.");
					done();
				});
		});

		it("deleteTag returns 200 when a tag is deleted", async () => {
            let requester = chai.request(server.app).keepOpen();
            
			await requester.delete("/note_tag/").send({ note_id: 1, tag_id: 1 });
			await requester.delete("/note_tag/").send({ note_id: 2, tag_id: 1 });
            await requester.delete("/note_tag/").send({ note_id: 3, tag_id: 1 });
            
			let res = await requester.delete("/tags/").send({ id: 1 });
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(1);
			res.body[0].should.have.property("title");
			res.body[0].title.should.equal("Sad");

			res = await requester.get("/tags/");
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.should.have.length(2);
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(2);
			res.body[0].should.have.property("title");
			res.body[0].title.should.equal("Good");

			requester.close();
		});
	});
});
