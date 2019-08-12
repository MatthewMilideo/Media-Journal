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

router.get('/user/', MediaController.getUserMedia);

/* ~~~~~~~~~~~~~~~~~~~~~~~ DELETE MEDIA TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */
/*
describe("deleteMedia | /media/:id", function() {
	it("deleteMedia returns 400 when a valid media_id is not provided.", function(done) {
		chai
			.request(server.app)
			.delete("/media/")
			.end(function(err, res) {
				res.should.have.status(400);
				res.text.should.equal("A valid media_id must be provided.");
				done();
			});
	});

	it("deleteMedia returns 400 when a valid media_id is not provided.", function(done) {
		chai
			.request(server.app)
			.post("/media/InvalidData")
			.end(function(err, res) {
				res.should.have.status(400);
				res.text.should.equal("A valid media_id must be provided.");
				done();
			});
	});

	it("deleteMedia returns 404 when no media is found", function(done) {
		chai
			.request(server.app)
			.post("/media/10")
			.end(function(err, res) {
				res.should.have.status(404);
				res.text.should.equal("Media not found.");
				done();
			});
	});

	it("deleteMedia returns 200 when media is deleted.", async () => {
		let requester = chai.request(server.app).keepOpen();
		let res = await requester.delete("/media/1");
		res.should.have.status(200);
		res.body.should.be.a("array");
		res.body[0].should.have.property("id");
		res.body[0].id.should.equal(1);
		res.body[0].should.have.property("title");
		res.body[0].title.should.equal("First Reformed");
		res.body[0].should.have.property("type");
		res.body[0].type.should.equal("MOVIE");
		res.body[0].should.have.property("CID");
		res.body[0].CID.should.equal("1234");

		res = await requester.get("/media/");

		requester.close();
		done();
	});

	/* ~~~~~~~~~~~~~~~~~~~~~~~ POST MEDIA TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */
/*
	describe("postMedia | /media/", function() {
		it("postMedia returns 400 when the required arguments are not provided", function(done) {
			chai
				.request(server.app)
				.post("/media/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.text.should.equal("The title, type, cID, must be provided.");
					done();
				});
		});

		it("postNote returns 201 when provided correct info", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester
				.request(server.app)
				.post("/media/")
				.send({ title: "Doom The Movie", cID: 100, type: "MOVIE" });

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
});


*/

}); 