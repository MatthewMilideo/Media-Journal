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

	describe("postMN | /media_note/", function() {
		it("postMN returns 400 when note_id or media_id are missing.", function(done) {
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