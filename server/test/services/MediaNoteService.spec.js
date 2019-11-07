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
chai.use(chaiHttp);
const mediaNoteService = require("../../services/MediaNoteService");

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
	/*
	describe("Media_Note_Model get by MediaID Tests", async () => {
		it("It returns 400 when no mediaIDs are provided.", async () => {
			let res = await mediaNoteService.getByMediaID();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid mediaID(s).");
		});
		it("It returns 400 when an invalid mediaID is provided.", async () => {
			let res = await mediaNoteService.getByMediaID("poop");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid mediaID(s).");
		});
		it("It returns 404 when mediaIDs are not found.", async () => {
			let res = await mediaNoteService.getByMediaID([100, 101]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media_notes were not found.");
		});
		it("It returns 200 when mediaIDs are found for a single media ID.", async () => {
			let res = await mediaNoteService.getByMediaID([1]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
		});
		it("It returns 200 when mediaIDs are found for an array of media IDs.", async () => {
			let res = await mediaNoteService.getByMediaID([1, 2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(3);
		});
		it("It returns 200 when mediaIDs are found for an array of media IDs including a non-existent id", async () => {
			let res = await mediaNoteService.getByMediaID([1, 2, -100]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(3);
		});
	});
	describe("Media_Note_Model get by MediaID Tests", async () => {
		it("It returns 400 when no mediaIDs are provided.", async () => {
			let res = await mediaNoteService.getByUserID();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid mediaID(s).");
		});
		it("It returns 400 when an invalid mediaID is provided.", async () => {
			let res = await mediaNoteService.getByUserID("test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid mediaID(s).");
		});
		it("It returns 404 when mediaIDs are not found.", async () => {
			let res = await mediaNoteService.getByUserID([100, 101]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media_notes were not found.");
		});
		it("It returns 200 when mediaIDs are found for a single media ID.", async () => {
			let res = await mediaNoteService.getByUserID([1]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(3);
		});
		it("It returns 200 when mediaIDs are found for an array of media IDs.", async () => {
			let res = await mediaNoteService.getByUserID([1, 2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(4);
		});
	});
	describe("Media_Note_Model get by Note And UserID Tests", async () => {
		it("It returns 400 when IDs are invalid", async () => {
			let res = await mediaNoteService.getByNoteAndUserID([
				{ note_id: "test", user_id: 1 },
				{ note_id: 3, user_id: 2 }
			]);

			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid ID(s).");
		});
		it("It returns 404 when IDs are not found", async () => {
			let res = await mediaNoteService.getByNoteAndUserID([
				{ note_id: 5, user_id: 1 },
				{ note_id: 2, user_id: 3 }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media_notes were not found.");
		});
		it("It returns 200 when IDs are not found", async () => {
			let res = await mediaNoteService.getByNoteAndUserID([
				{ note_id: 1, user_id: 1 },
				{ note_id: 3, user_id: 2 }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
		});
	});

	describe("Media_Note_Model get by Media And UserID Tests", async () => {
		it("It returns 400 when IDs are invalid", async () => {
			let res = await mediaNoteService.getByMediaAndUserID([
				{ media_id: "test", user_id: 1 },
				{ media_id: 3, user_id: 2 }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid ID(s).");
		});
		it("It returns 404 when IDs are not found", async () => {
			let res = await mediaNoteService.getByMediaAndUserID([
				{ media_id: 5, user_id: 1 },
				{ media_id: 2, user_id: 3 }
			]);

			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media_notes were not found.");
		});
		it("It returns 404 when IDs are not found", async () => {
			let res = await mediaNoteService.getByMediaAndUserID([
				{ media_id: 1, user_id: 1 },
				{ media_id: 3, user_id: 2 }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(3);
		});
	});

	describe("Media_Note_Model post Tests", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await mediaNoteService.postMN()
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid mediaID, noteID, and userID."
			);
		});
		it("It returns 400 when incorrect media ID", async () => {
			let res = await mediaNoteService.postMN("test", "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid mediaID, noteID, and userID."
			);
		});
		it("It returns 400 when incorrect note id are provided.", async () => {
			let res = await mediaNoteService.postMN(1, "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid mediaID, noteID, and userID."
			);
		});
		it("It returns 400 when incorrect user id are provided.", async () => {
			let res = await mediaNoteService.postMN(1, 1, "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid mediaID, noteID, and userID."
			);
		});
		it("It returns 400 when incorrect note id are provided.", async () => {
			let res = await mediaNoteService.postMN(100, 1, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(403);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The media required for this operation could not be found."
			);
		});
		it("It returns 400 when incorrect note id are provided.", async () => {
			let res = await mediaNoteService.postMN(1, 100, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The note required for this operation could not be found."
			);
		});
		it("It returns 400 when incorrect note id are provided.", async () => {
			let res = await mediaNoteService.postMN(1, 1, 100);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The user required for this operation could not be found."
			);
		});
		it("It returns 400 when incorrect note id are provided.", async () => {
			let res = await mediaNoteService.postMN(1, 1, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(409);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"There was a conflict during insertion. You must provide a unique relation."
			);
		});
		it("It returns 400 when incorrect note id are provided.", async () => {
			let res = await mediaNoteService.postMN(3, 2, 3);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(201);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(3);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(2);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(3);

			res = await mediaNoteService.getByUserID(3);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
		});
	});
	describe("Media_Note_Model delete Tests", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await mediaNoteService.deleteMN();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid mediaID, noteID, and userID."
			);
		});
		it("It returns 400 when incorrect media ID", async () => {
			let res = await mediaNoteService.deleteMN("test", "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid mediaID, noteID, and userID."
			);
		});
		it("It returns 400 when incorrect note id are provided.", async () => {
			let res = await mediaNoteService.deleteMN(1, "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid mediaID, noteID, and userID."
			);
		});
		it("It returns 400 when incorrect user id are provided.", async () => {
			let res = await mediaNoteService.deleteMN(1, 1, "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid mediaID, noteID, and userID."
			);
		});
		it("It returns 400 when incorrect note id are provided.", async () => {
			let res = await mediaNoteService.deleteMN(100, 1, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media_note was not found.");
		});
		it("It returns 400 when incorrect note id are provided.", async () => {
			let res = await mediaNoteService.deleteMN(1, 100, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media_note was not found.");
		});
		it("It returns 400 when incorrect note id are provided.", async () => {
			let res = await mediaNoteService.deleteMN(1, 1, 100);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media_note was not found.");
		});
		it("It returns 400 when incorrect note id are provided.", async () => {
			let res = await mediaNoteService.deleteMN(1, 1, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");

			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(1);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(1);

			res = await mediaNoteService.getByUserID(1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(5);
		});

	});
	*/
	describe("Media_Note_Model delete Tests", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await mediaNoteService.deleteMN();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid mediaID, noteID, and userID."
			);
		});
	}); 
});
