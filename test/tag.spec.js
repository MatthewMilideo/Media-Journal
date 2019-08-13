process.env.NODE_ENV = "test";
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../server.js");

chai.use(chaiHttp);

describe("Route: '/media/ ", function() {
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
		it("getAllTags returns 404 when no tags are found", function(done) {
			chai
				.request(server.app)
				.get("/tags/")
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("There is no media");
					done();
				});
		});
	});

	describe("getAllTags | /tags/", function() {
		it("getAllMedia returns 200 when tags is found", function(done) {
			chai
				.request(server.app)
				.get("/media/")
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
		it("getTagID returns 400 when arguments aren't provided", function(done) {
			chai
				.request(server.app)
				.get("/tags/ID")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("The id must be provided.");
					done();
				});
		});
		it("getTagID returns 400 when an invalid argument is provided", function(done) {
			chai
				.request(server.app)
				.get("/tags/ID")
				.query({ ID: "TEST" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("The id must be provided.");
					done();
				});
		});
		it("getTagID returns 404 no data is found.", function(done) {
			chai
				.request(server.app)
				.get("/tags/ID")
				.query({ ID: 10 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("No media found.");
					done();
				});
		});
		it("getTagID returns 200 when data is found.", function(done) {
			chai
				.request(server.app)
				.get("/media/CID")
				.query({ CID: "1234", type: "MOVIE" })
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
});
