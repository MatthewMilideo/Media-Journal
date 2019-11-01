process.env.NODE_ENV = "test";

const mediaModel = require("../models/media_model");
const mediaUserModel = require("../models/media_user_model");
const mediaNoteModel = require("../models/media_note_model")

const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);
const expect = require("chai").expect;

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../server.js");

chai.use(chaiHttp);

describe("Various Tests", function() {
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
	/// STARTS HERE
	describe("getMediaCIDBulkUser | /media/", function() {
		it("getMediaCIDBulkUser returns 400 when no arguments aren't provided", async () => {
			try {
				let res = await mediaModel.getMediaCIDBulkUser();
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal("You must provide valid CIDs.");
			}
		});

		it("getMediaCIDBulkUser returns 400 when CIDS is not an array", async () => {
			try {
				let res = await mediaModel.getMediaCIDBulkUser(3, "MOVIE");
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal("You must provide valid CIDs.");
			}
		});

		it("getMediaCIDBulkUser returns 400 when the type is incorrect", async () => {
			try {
				let res = await mediaModel.getMediaCIDBulkUser(
					["1", "2", "3"],
					"MOVIES"
				);
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal(
					"You must provide valid CIDs, type, and user_id."
				);
			}
		});

		it("getMediaCIDBulkUser returns 400 when there is no user_id", async () => {
			try {
				let res = await mediaModel.getMediaCIDBulkUser(
					["1", "2", "3"],
					"MOVIE"
				);
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal(
					"You must provide valid CIDs, type, and user_id."
				);
			}
		});

		it("getMediaCIDBulkUser returns 404 when no data is found", async () => {
			try {
				let res = await mediaModel.getMediaCIDBulkUser(
					["1", "2", "3"],
					"MOVIE",
					1000
				);
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(404);
				error.should.have.property("data");
				error.data.should.equal("The requested media were not found.");
			}
		});
		it("getMediaCIDBulkUser returns 200 when data is found", async () => {
			let res = await mediaModel.getMediaCIDBulkUser(
				["1234", "2", "3"],
				"MOVIE",
				1
			);
			res.should.have.property("status");
			res.status.should.equal(200);
			res.should.have.property("data");
			res.data.should.be.a("array");
			res.data.should.have.length(1);
			res.data[0].should.have.property("media_id");
			res.data[0].media_id.should.equal(1);
		});

		it("getMediaCIDBulk returns 200 when  data is found", async () => {
			let requester = chai.request(server.app).keepOpen();

			await requester
				.post("/media/")
				.send({ title: "Doom The Movie", CID: "12345", type: "MOVIE" });

			await requester.post("/media_user/").send({ media_id: 4, user_id: 1 });

			await requester
				.post("/media/")
				.send({ title: "Doom 2 The Movie", CID: "123456", type: "MOVIE" });

			let res = await requester.post("/media_user/").send({ media_id: 5, user_id: 2 });
	
			res = await mediaModel.getAllMedia();

			res = await mediaUserModel.getAllMU(); 

			res = await mediaModel.getMediaCIDBulkUser(
				["1234", "12345", "123456", "3"],
				"MOVIE",
				1
			);
			res.should.have.property("status");
			res.status.should.equal(200);
			res.should.have.property("data");
			res.data.should.be.a("array");
			res.data.should.have.length(2);
			res.data[0].should.have.property("media_id");
			res.data[0].media_id.should.equal(1);
			res.data[1].should.have.property("media_id");
			res.data[1].media_id.should.equal(4);
		});
	});
	describe("getMUBulk | /media/", function() {
		it("getMUBulk returns 400 when no arguments aren't provided", async () => {
			try {
				let res = await mediaUserModel.getMUBulk();
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal("You must provide valid media_ids.");
			}
		});

		it("getMUBulk returns 400 when the media_ids are not in an array", async () => {
			try {
				let res = await mediaUserModel.getMUBulk(1, 1);
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal("You must provide valid media_ids.");
			}
		});

		it("getMUBulk returns 400 when the user id is a string", async () => {
			try {
				let res = await mediaUserModel.getMUBulk([1, 4, 5], "test");
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal(
					"You must provide a valid user_id and media_ids."
				);
			}
		});

		it("getMUBulk returns 400 when no arguments aren't all ints", async () => {
			try {
				let res = await mediaUserModel.getMUBulk(["1", "test", 5], 1);
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal(
					"You must provide a valid user_id and media_ids."
				);
			}
		});

		it("getMUBulk returns 404 when no MU found", async () => {
			try {
				let res = await mediaUserModel.getMUBulk([100, 200, 300], 1);
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(404);
				error.should.have.property("data");
				error.data.should.equal("The requested media_users were not found.");
			}
		});

		it("getMUBulk returns 200 when data is found", async () => {
			let requester = chai.request(server.app).keepOpen();
			await requester
				.post("/media/")
				.send({ title: "Doom The Movie", CID: "12345", type: "MOVIE" });

			await requester.post("/media_user/").send({ media_id: 4, user_id: 1 });

			await requester.post("/media/").send({
				title: "Call Me By Your Name",
				CID: "140607",
				type: "MOVIE"
			});

			await requester.post("/media_user/").send({ media_id: 5, user_id: 1 });

			let res = await mediaUserModel.getMUBulk([1, 3, 4, 5, 6, 7, 8, 9, 10], 1);
			res.should.have.property("status");
			res.status.should.equal(200);
			res.should.have.property("data");
			res.data.should.be.a("array");
			res.data.should.have.length(3);
			res.data[0].should.have.property("media_id");
			res.data[0].media_id.should.equal(1);
			res.data[0].should.have.property("media_id");
			res.data[1].media_id.should.equal(4);
			res.data[1].should.have.property("media_id");
			res.data[2].media_id.should.equal(5);
		});
	});
	

	describe("getMNBulk | /media_note/", function() {
		it("getMNBulk returns 400 when no arguments aren't provided", async () => {
			try {
				let res = await mediaNoteModel.getNoteMNBulk();
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal("You must provide valid media_ids.");
			}
		});

		it("getNUBulk returns 400 when the media_ids are not in an array", async () => {
			try {
				let res = await mediaNoteModel.getNoteMNBulk(1);
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal("You must provide valid media_ids.");
			}
		});

		it("getMNBulk returns 400 when no arguments aren't all ints", async () => {
			try {
				let res = await mediaNoteModel.getNoteMNBulk(["1", "test", 5]);
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(400);
				error.should.have.property("data");
				error.data.should.equal(
					"You must provide valid media_ids."
				);
			}
		});

		it("getMNBulk returns 404 when no MU found", async () => {
			try {
				let res = await mediaNoteModel.getNoteMNBulk([100, 200, 300]);
			} catch (error) {
				error.should.have.property("status");
				error.status.should.equal(404);
				error.should.have.property("data");
				error.data.should.equal("The requested notes were not found.");
			}
		});

		it("getMNBulk returns 200 when data is found", async () => {
			let requester = chai.request(server.app).keepOpen();
			await requester
				.post("/media/")
				.send({ title: "Doom The Movie", CID: "12345", type: "MOVIE" });
			await requester.post("/media_note/").send({ media_id: 4, note_id: 1 });
			await requester.post("/media_note/").send({ media_id: 4, note_id: 2 });
			await requester.post("/media_note/").send({ media_id: 4, note_id: 3 });

	
			let res = await mediaNoteModel.getNoteMNBulk([4, 11, 1]);
			res.should.have.property("status");
			res.status.should.equal(200);
			res.should.have.property("data");
			res.data.should.be.a("array");
			res.data.should.have.length(5);
			res.data[0].should.have.property("media_id");
			res.data[0].media_id.should.equal(1);
			res.data[1].should.have.property("media_id");
			res.data[1].media_id.should.equal(1);
			res.data[2].should.have.property("media_id");
			res.data[2].media_id.should.equal(4);
		});
	});
});
