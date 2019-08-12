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
				//.send({ media_id: 1, user_id: 1 })
				.end(function(err, res) {
                    res.should.have.status(400);
					res.text.should.equal('You must provide a valid media_id and user_id.')
					res.body.should.have.length(3);
					res.body[0].should.have.property("user_id");
					res.body[0].user_id.should.equal(1);
					done();
				});
		});
	});
});
