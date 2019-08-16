process.env.NODE_ENV = "test";

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);
const expect = require("chai").expect;
const mediaModel = require("../models/media_model");

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

	describe("getMediaCIDBulk | /media/", function() {
		it("getMediaCIDBulk returns 400 when no arguments aren't provided", async () => {
			try {
				let res = await mediaModel.getMediaCIDBulk();
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal("You must provide valid CIDs.");
			}
		});

		it("getMediaCIDBulk returns 400 when CIDS is not an array", async () => {
			try {
				let res = await mediaModel.getMediaCIDBulk(3, "MOVIE");
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal("You must provide valid CIDs.");
			}
		});

		it("getMediaCIDBulk returns 400 when CIDS is not an array", async () => {
			try {
				let res = await mediaModel.getMediaCIDBulk(["1", "2", "3"], "MOVIES");
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal("You must provide valid CIDs and type.");
			}
		});
		it("getMediaCIDBulk returns 404 when no data is found", async () => {
			try {
				let res = await mediaModel.getMediaCIDBulk(["1", "2", "3"], "MOVIE");
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(404);
				error.should.have.property("data");
				error.data.should.equal("The requested media were not found.");
			}
		});
		it("getMediaCIDBulk returns 200 when no data is found", async () => {
			let res = await mediaModel.getMediaCIDBulk(["1234", "2", "3"], "MOVIE");
			res.should.have.property("status");
			res.status.should.equal(200);
			res.should.have.property("data");
			res.data.should.be.a("array");
			res.data.should.have.length(1);
			res.data[0].should.have.property("id");
			res.data[0].id.should.equal(1);
			res.data[0].should.have.property("title");
			res.data[0].title.should.equal("First Reformed");
		});

		it("getMediaCIDBulk returns 200 when no data is found", async () => {
			let requester = chai.request(server.app).keepOpen();
			await requester
				.post("/media/")
				.send({ title: "Doom The Movie", CID: "12345", type: "MOVIE" });

			let res = await mediaModel.getMediaCIDBulk(
				["1234", "12345", "3"],
				"MOVIE"
			);
			res.should.have.property("status");
			res.status.should.equal(200);
			res.should.have.property("data");
			res.data.should.be.a("array");
			res.data.should.have.length(2);
			res.data[0].should.have.property("id");
			res.data[0].id.should.equal(1);
			res.data[0].should.have.property("title");
			res.data[0].title.should.equal("First Reformed");
			res.data[1].should.have.property("id");
			res.data[1].id.should.equal(4);
			res.data[1].should.have.property("title");
			res.data[1].title.should.equal("Doom The Movie");
		});
	});
});
