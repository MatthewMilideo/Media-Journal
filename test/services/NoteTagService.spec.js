process.env.NODE_ENV = "test";
const environment = process.env.NODE_ENV || "development";
const configuration = require("../../knexfile")[environment];
const database = require("knex")(configuration);
const expect = require("chai").expect;
var chai = require("chai");
var chaiHttp = require("chai-http");
chai.use(require("chai-as-promised"));
chai.use(chaiHttp);
const noteTagService = require("../../services/NoteTagService");

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

	describe("NoteTagService get by NoteID Tests", async () => {
		it("It returns 400 when no noteIDs are provided.", async () => {
			let res = await noteTagService.getByNoteID();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid noteID(s).");
		});
		it("It returns 400 when an invalid noteID is provided.", async () => {
			let res = await noteTagService.getByNoteID("poop");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid noteID(s).");
		});
		it("It returns 404 when noteIDs are not found.", async () => {
			let res = await noteTagService.getByNoteID([100, 101]);
			console.log(res);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested note_tags were not found.");
		});
		it("It returns 200 when noteIDs are found for a single media ID.", async () => {
			let res = await noteTagService.getByNoteID([1]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
		});
		it("It returns 200 when noteIDs are found for an array of media IDs.", async () => {
			let res = await noteTagService.getByNoteID([1, 2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(4);
		});
		it("It returns 200 when noteIDs are found for an array of media IDs including a non-existent id", async () => {
			let res = await noteTagService.getByNoteID([1, 2, -100]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(4);
		});
	});

	describe("NoteTagService get by tagID Tests", async () => {
		it("It returns 400 when no tagIDs are provided.", async () => {
			let res = await noteTagService.getByTagID();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid tagID(s).");
		});
		it("It returns 400 when an invalid tagID is provided.", async () => {
			let res = await noteTagService.getByTagID("test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid tagID(s).");
		});
		it("It returns 404 when tagIDs are not found.", async () => {
			let res = await noteTagService.getByTagID([100, 101]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested note_tags were not found.");
		});
		it("It returns 200 when tagIDs are found for a single media ID.", async () => {
			let res = await noteTagService.getByTagID([1]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(5);
		});
		it("It returns 200 when tagIDs are found for an array of media IDs.", async () => {
			let res = await noteTagService.getByTagID([1, 2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(9);
		});
		it("It returns 200 when tagIDs are found for an array of media IDs including a non-existent id", async () => {
			let res = await noteTagService.getByTagID([1, 2, -100]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(9);
		});
	});

	describe("NoteTagService get by userID Tests", async () => {
		it("It returns 400 when no uresIDs are provided.", async () => {
			let res = await noteTagService.getByUserID();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid userID(s).");
		});
		it("It returns 400 when an invalid userID is provided.", async () => {
			let res = await noteTagService.getByUserID("test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid userID(s).");
		});
		it("It returns 404 when userIDs are not found.", async () => {
			let res = await noteTagService.getByUserID([100, 101]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested note_tags were not found.");
		});
		it("It returns 200 when userIDs are found for a single media ID.", async () => {
			let res = await noteTagService.getByUserID([3]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(4);
		});
		it("It returns 200 when userIDs are found for an array of media IDs.", async () => {
			let res = await noteTagService.getByUserID([1, 2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(6);
		});
		it("It returns 200 when userIDs are found for an array of media IDs including a non-existent id", async () => {
			let res = await noteTagService.getByUserID([1, 2, -100]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(6);
		});
	});

	describe("Note Tag Service get by Note And UserID Tests", async () => {
		it("It returns 400 when IDs are invalid", async () => {
			let res = await noteTagService.getByNoteAndUserID([
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
			let res = await noteTagService.getByNoteAndUserID([
				{ note_id: 5, user_id: 1 },
				{ note_id: 2, user_id: 3 }
			]);

			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested note_tags were not found.");
		});
		it("It returns 200 when IDs are not found", async () => {
			let res = await noteTagService.getByNoteAndUserID([
				{ note_id: 1, user_id: 2 },
				{ note_id: 3, user_id: 2 }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(4);
		});
	});

	describe("Note Tag Service get by Tag And UserID Tests", async () => {
		it("It returns 400 when IDs are invalid", async () => {
			let res = await noteTagService.getByTagAndUserID([
				{ tag_id: "test", user_id: 1 },
				{ tag_id: 3, user_id: 2 }
			]);

			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide valid ID(s).");
		});
		it("It returns 404 when IDs are not found", async () => {
			let res = await noteTagService.getByTagAndUserID([
				{ tag_id: 5, user_id: 1 },
				{ tag_id: 2, user_id: 3 }
			]);

			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested note_tags were not found.");
		});
		it("It returns 200 when IDs are not found", async () => {
			let res = await noteTagService.getByTagAndUserID([
				{ tag_id: 1, user_id: 2 },
				{ tag_id: 3, user_id: 2 }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(3);
		});
	});

	describe("NoteTagService post Tests", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await noteTagService.postNT();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, tagID, and userID."
			);
		});
		it("It returns 400 when incorrect note ID", async () => {
			let res = await noteTagService.postNT("test", "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, tagID, and userID."
			);
		});
		it("It returns 400 when incorrect tag id are provided.", async () => {
			let res = await noteTagService.postNT(1, "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, tagID, and userID."
			);
		});
		it("It returns 400 when incorrect user id are provided.", async () => {
			let res = await noteTagService.postNT(1, 1, "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, tagID, and userID."
			);
		});
		it("It returns 404 when note id is not found", async () => {
			let res = await noteTagService.postNT(100, 1, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The note required for this operation could not be found."
			);
		});
		it("It returns 404 when incorrect tag id is not found.", async () => {
			let res = await noteTagService.postNT(1, 100, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The tag required for this operation could not be found."
			);
		});
		it("It returns 404 when incorrect user id is not found.", async () => {
			let res = await noteTagService.postNT(1, 1, 100);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The user required for this operation could not be found."
			);
		});
		it("Insertion conflict.", async () => {
			let res = await noteTagService.postNT(1, 1, 2);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(409);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"There was a conflict during insertion. You must provide a unique relation."
			);
		});
		it("It returns 201 when inserted.", async () => {
			let res = await noteTagService.postNT(1, 3, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(201);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(1);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(3);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(1);

			res = await noteTagService.getByUserID(1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
		});
	});
	describe("NoteTagService delete Tests", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await noteTagService.deleteNT();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, tagID, and userID."
			);
		});
		it("It returns 400 when incorrect note ID", async () => {
			let res = await noteTagService.deleteNT("test", "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, tagID, and userID."
			);
		});
		it("It returns 400 when incorrect tag id is provided.", async () => {
			let res = await noteTagService.deleteNT(1, "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, tagID, and userID."
			);
		});
		it("It returns 400 when incorrect user id is provided.", async () => {
			let res = await noteTagService.deleteNT(1, 1, "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, tagID, and userID."
			);
		});
		it("It returns 404 when note id is not found", async () => {
			let res = await noteTagService.deleteNT(100, 1, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested note_tag was not found.");
		});
		it("It returns 404 when tag id is not found", async () => {
			let res = await noteTagService.deleteNT(1, 100, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested note_tag was not found.");
		});
		it("It returns 404 when user id is not found.", async () => {
			let res = await noteTagService.deleteNT(1, 1, 100);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested note_tag was not found.");
		});
		it("It returns 200 when deleted are provided.", async () => {
			let res = await noteTagService.deleteNT(1, 1, 2);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");

			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(1);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(1);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(2);

			res = await noteTagService.getByUserID(2);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(5);
		});
	});
	
	describe("NoteTagService postTagandNT Tests", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await noteTagService.postTagAndNT();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
		});
		it("It returns 400 when incorrect note ID", async () => {
			let res = await noteTagService.postTagAndNT("test", "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
		});
		it("It returns 400 when incorrect title is provided.", async () => {
			let res = await noteTagService.postTagAndNT(1, 1, "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
		});
		it("It returns 400 when incorrect user id are provided.", async () => {
			let res = await noteTagService.postTagAndNT(1, 'test', "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
		});
		it("It returns 404 when note id is not found", async () => {
			let res = await noteTagService.postTagAndNT(100, 'title', 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The note required for this operation could not be found."
			);
		});
		it("It returns 404 when incorrect user id is not found.", async () => {
			let res = await noteTagService.postTagAndNT(1, 'test', 100);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The user required for this operation could not be found."
			);
		});
		it("Insertion conflict.", async () => {
			let res = await noteTagService.postTagAndNT(1, 'Sad', 2);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(409);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"There was a conflict during insertion. You must provide a unique relation."
			);
		});
		it("It returns 201 when inserted.", async () => {
			let res = await noteTagService.postTagAndNT(1, 'test', 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(201);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(1);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(4);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(1);

			res = await noteTagService.getByUserID(1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
		});
	});
	*/
	describe("NoteTagService postTagAndNT2 Tests", async () => {
		/*
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await noteTagService.postTagAndNT2();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
		});
		it("It returns 400 when incorrect note ID", async () => {
			let res = await noteTagService.postTagAndNT2("test", "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
		});
		it("It returns 400 when incorrect title is provided.", async () => {
			let res = await noteTagService.postTagAndNT2(1, 1, "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
		});
		it("It returns 400 when incorrect user id are provided.", async () => {
			let res = await noteTagService.postTagAndNT2(1, 'test', "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
		});
		it("It returns 404 when note id is not found", async () => {
			let res = await noteTagService.postTagAndNT2(100, 'title', 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The note required for this operation could not be found."
			);
		});
		it("It returns 404 when incorrect user id is not found.", async () => {
			let res = await noteTagService.postTagAndNT2(1, 'test', 100);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The user required for this operation could not be found."
			);
		});
		it("Insertion conflict.", async () => {
			let res = await noteTagService.postTagAndNT2(1, 'Sad', 2);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(409);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"There was a conflict during insertion. You must provide a unique relation."
			);
		});
		*/
		it("It returns 201 when inserted.", async () => {
			let res = await noteTagService.postTagAndNT2(1, ['tessdat' , 'sssad'], 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(201);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(1);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(4);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(1);

			res = await noteTagService.getByUserID(1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
		});
	});
});
