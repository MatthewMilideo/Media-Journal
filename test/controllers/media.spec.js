process.env.NODE_ENV = "test";

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);
const expect = require('chai').expect
const mediaModel = require('../models/media_model');


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

	/* ~~~~~~~~~~~~~~~~~~~~~~~ GET ALL MEDIA TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

	// This test needs to be one once most of my functionality is built out becasue many things need to be deleted
	// due to foreign keys.
	/*
describe("getAllMedia | /media/", function() {
	it("getAllMedia returns 404 when no media is found", function(done) {
		chai
			.request(server.app)
			.get("/media/")
			.end(function(err, res) {
				res.should.have.status(404);
				res.text.should.equal("There is no media");
				done();
			});
	});
});
*/

	describe("getAllMedia | /media/", function() {
		it("getAllMedia returns 200 when media is found", function(done) {
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
					res.body[0].title.should.equal("First Reformed");
					done();
				});
		});
	});
	describe("getMediaCID | /media/", function() {
		it("getMediaCIDreturns 400 when arguments aren't provided", function(done) {
			chai
				.request(server.app)
				.get("/media/CID")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid CID and type.");
					done();
				});
		});
		it("getMediaCID returns 400 when arguments aren't provided", function(done) {
			chai
				.request(server.app)
				.get("/media/CID")
				.query({ CID: null, type: "TEST" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid CID and type.");
					done();
				});
		});
		it("getMediaCID returns 404 no data is found.", function(done) {
			chai
				.request(server.app)
				.get("/media/CID")
				.query({ CID: "8910112", type: "GAME" })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested media was not found.");
					done();
				});
		});
		it("getMediaCID returns 200 when data is found.", function(done) {
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
					res.body[0].title.should.equal("First Reformed");
					done();
				});
		});
	});

	/* ~~~~~~~~~~~~~~~~~~~~~~~ POST MEDIA TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

	describe("postMedia | /media/", function() {
		it("postMedia returns 400 when the required arguments are not provided", function(done) {
			chai
				.request(server.app)
				.post("/media/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal(
						"You must provide a valid title, type, and CID."
					);
					done();
				});
		});

		it("postNote returns 409 when the entry already exists", function(done) {
			chai
				.request(server.app)
				.post("/media/")
				.send({ title: "First Reformed", type: "MOVIE", CID: "1234" })
				.end(function(err, res) {
					res.should.have.status(409);
					res.text.should.equal(
						"There was a conflict during insertion. You must provide a unique piece of media."
					);
					done();
				});
		});

		it("postNote returns 201 when provided correct info", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester
				.post("/media/")
				.send({ title: "Doom The Movie", CID: "100", type: "MOVIE" });
			res.should.have.status(201);
			res.body.should.be.a("array");
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(4);
			res.body[0].should.have.property("title");
			res.body[0].title.should.equal("Doom The Movie");

			res = await requester.get("/media/");
			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.should.have.length(4);
			res.body[3].should.have.property("id");
			res.body[3].id.should.equal(4);
			res.body[3].should.have.property("title");
			res.body[3].title.should.equal("Doom The Movie");

			requester.close();
		});
	});

	/* ~~~~~~~~~~~~~~~~~~~~~~~ DELETE MEDIA TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

	describe("deleteMedia | /media/:id", function() {
		it("deleteMedia returns 400 when a type and CID are not provided.", function(done) {
			chai
				.request(server.app)
				.delete("/media/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid type and CID.");
					done();
				});
		});

		it("deleteMedia returns 400 when valid type and CID are not provided.", function(done) {
			chai
				.request(server.app)
				.delete("/media/")
				.send({ type: 5, CID: 5 })
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("You must provide a valid type and CID.");
					done();
				});
		});

		it("deleteMedia returns 404 when no media is found", function(done) {
			chai
				.request(server.app)
				.delete("/media/")
				.send({ type: "MOVIE", CID: "100000000000" })
				.end(function(err, res) {
					res.should.have.status(404);
					res.text.should.equal("The requested media was not found.");
					done();
				});
		});

		it("deleteMedia returns 403 when there is a foreign key constraint.", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester
				.delete("/media/")
				.send({ type: "MOVIE", CID: "1234" });
			res.should.have.status(403);
			res.body.should.be.a("object");
			res.text.should.equal(
				"A constraint prevented this request from being fulfilled."
			);
			requester.close();
		});

		it("deleteMedia returns 200 when the delete functions", async () => {});
	});
});
