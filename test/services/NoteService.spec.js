process.env.NODE_ENV = "test";

const environment = process.env.NODE_ENV || "development";
const configuration = require("../../knexfile")[environment];
const database = require("knex")(configuration);
const expect = require("chai").expect;

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../../server.js");

const NoteService = require("../../services/NoteService");
const MediaService = require("../../services/MediaService");
const MediaNoteService = require("../../services/MediaNoteService");
const types = require("../../types");

chai.use(chaiHttp);

describe("Note Services Tests", function() {
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

	describe(" getByID NoteService Tests", async () => {
		it("getByID returns 400 when no arguments are provided", async () => {
			let res = await NoteService.getByID();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid note_id.");
		});
		it("getByID returns 400 when invalid arguments are provided", async () => {
			let res = await NoteService.getByID(["test"]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid note_id.");
		});
		it("getByID returns 404 when no data is found", async () => {
			let res = await NoteService.getByID(100);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested notes were not found.");
		});
		it("getByID returns 200 when valid arguments are provided", async () => {
			let res = await NoteService.getByID(1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("First Reformed - Note");
		});
		it("getByID returns 200 when valid array of arguments are provided", async () => {
			let res = await NoteService.getByID([1, 2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(2);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("First Reformed - Note");
			expect(res.data[1]).to.have.property("title");
			expect(res.data[1].title).to.equal("First Reformed Note 2");
		});
	});

	describe("Post Note Service Tests", async () => {
		it("Post Note returns 400 when no arguments are provided", async () => {
			let res = await NoteService.postNote();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid user_id, title, and data."
			);
		});
		it("Post Note returns 400 when incorrect arguments are provided", async () => {
			let res = await NoteService.postNote(5, 5, "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid user_id, title, and data."
			);
		});
		it("Post Note returns 404 when the user id is not found", async () => {
			let res = await NoteService.postNote(
				"First Reformed Note",
				"Good movie",
				100
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The required user for this operation was not found."
			);
		});
		it("Post Note returns 201 when the note is inserted.", async () => {
			let res = await NoteService.postNote(
				"First Reformed Note",
				"Good movie",
				1
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(201);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("First Reformed Note");
			expect(res.data[0]).to.have.property("data");
			expect(res.data[0].data).to.equal("Good movie");

			res = await NoteService.getByID(5);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("First Reformed Note");
		});
	});

	describe("Post NoteAndMN Service Tests", async () => {
		it("Post NoteAndMN returns 400 when no arguments are provided", async () => {
			let res = await NoteService.postNoteAndMN();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid user_id, title, and data."
			);
		});
		it("Post NoteAndMN returns 400 when invalid arguments are provided", async () => {
			let res = await NoteService.postNoteAndMN(5, 5, "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid user_id, title, and data."
			);
		});
		it("Post NoteAndMN returns 404 when user not found is provided are provided", async () => {
			let res = await NoteService.postNoteAndMN("Title", "Data", 100, 100);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The required user for this operation was not found."
			);
		});
		it("Post NoteAndMN returns 400 when invalid media id is provided", async () => {
			let res = await NoteService.postNoteAndMN(
				"Good Note",
				"It is very good",
				1,
				"test"
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid mediaID, noteID, and userID."
			);
		});

		it("Post NoteAndMN returns 403 when media id is not found", async () => {
			let res = await NoteService.postNoteAndMN(
				"Good Note",
				"It is very good",
				1,
				100
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(403);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The media required for this operation could not be found."
			);
		});

		it("Post NoteAndMN returns 201 when Note and Media Note are inserted.", async () => {
			let res = await NoteService.postNoteAndMN(
				"Another First Reformed Note",
				"We all love this movie!",
				1,
				1
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(201);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(1);

			res = await NoteService.getByID(5);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Another First Reformed Note");

			res = await MediaNoteService.getByNoteAndUserID({
				note_id: 5,
				user_id: 1
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(1);
		});
	});
	*/

	describe("Post NoteAll Service Tests", async () => {
		it("Post NoteAll returns 400 when no arguments are provided", async () => {
			let res = await NoteService.postNoteAll();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid user_id mediaObj pair."
			);
		});
		it("Post NoteAll returns 400 when invalid arguments are provided for post note.", async () => {
			let res = await NoteService.postNoteAll("Test Note", 5, 1, {
				CID: "1234567",
				type: "MOVIE",
				title: "The Media Obj"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid user_id, title, and data."
			);
		});

		it("Post NoteAll returns 400 when invalid arguments are provided for post note and there was a 409 in post media", async () => {
			let res = await NoteService.postNoteAll("Test Note", 5, 1, {
				CID: "1234",
				type: "MOVIE",
				title: "First Reformed"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid user_id, title, and data."
			);
		});

		it("Post NoteAll returns 201 when inserted after 409 in media.", async () => {
			let res = await NoteService.postNoteAll(
				"Another First Reformed Note",
				"We all love this movie!",
				1,
				{
					CID: "1234",
					type: "MOVIE",
					title: "First Reformed"
				}
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(1);

			res = await NoteService.getByID(5);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Another First Reformed Note");

			res = await MediaNoteService.getByNoteAndUserID({
				note_id: 5,
				user_id: 1
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(1);
		});
		it("Post NoteAll returns 201 when inserted all the way", async () => {
			let res = await NoteService.postNoteAll(
				"Another First Reformed Note",
				"We all love this movie!",
				1,
				{
					CID: "12345678910",
					type: "MOVIE",
					title: "First Reformed 2"
				}
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(201);
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(4);

			res = await MediaService.getByMediaIDUser({ media_id: 4, user_id: 1 });
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(4);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("First Reformed 2");
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(1);

			res = await NoteService.getByID(5);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Another First Reformed Note");

			res = await MediaNoteService.getByNoteAndUserID({
				note_id: 5,
				user_id: 1
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(4);
		});
	});
});
