process.env.NODE_ENV = "test";
const environment = process.env.NODE_ENV || "development";
const configuration = require("../../knexfile")[environment];
const database = require("knex")(configuration);
const expect = require("chai").expect;
var chai = require("chai");
var chaiHttp = require("chai-http");
chai.use(require("chai-as-promised"));
chai.use(chaiHttp);
const tagService = require("../../services/TagService");
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

	describe("NoteTagService postTagAndNT Tests", async () => {
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
			let res = await noteTagService.postTagAndNT({
				note_id: "test",
				user_id: 1,
				title: "test"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
		});
		it("It returns 400 when incorrect title is provided.", async () => {
			let res = await noteTagService.postTagAndNT({
				note_id: 1,
				user_id: 1,
				title: 1
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid title.");
		});
		it("It returns 400 when incorrect user id are provided.", async () => {
			let res = await noteTagService.postTagAndNT({
				note_id: 1,
				user_id: "test",
				title: "test"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
		});
		it("It returns 404 when note id is not found", async () => {
			let res = await noteTagService.postTagAndNT({
				note_id: 100,
				user_id: 1,
				title: "test"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("status");
			expect(res.data[0].status).to.equal(404);
		});
		it("It returns 404 when incorrect user id is not found.", async () => {
			let res = await noteTagService.postTagAndNT({
				note_id: 1,
				user_id: 100,
				title: "test"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("status");
			expect(res.data[0].status).to.equal(404);
		});
		it("Insertion conflict.", async () => {
			let res = await noteTagService.postTagAndNT({
				note_id: "1",
				user_id: "2",
				title: "Sad"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("status");
			expect(res.data[0].status).to.equal(409);
		});

		it("It returns 201 when a new tag is inserted.", async () => {
			let res = await noteTagService.postTagAndNT({
				note_id: "5",
				user_id: "3",
				title: "HELLO THIS IS A TAG"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal("5");
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(4);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal("3");

			res = await tagService.getByTitle("HELLO THIS IS A TAG");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);

			res = await noteTagService.getByNoteAndUserID({ note_id: 5, user_id: 3 });
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(3);
			expect(res.data[2]).to.have.property("title");
			expect(res.data[2].title).to.equal("HELLO THIS IS A TAG");
		});

		it("It returns 200 when an existing tag is not inserted but is returned.", async () => {
			let res = await noteTagService.postTagAndNT({
				note_id: "5",
				user_id: "3",
				title: "Sad"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal("5");
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(1);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal("3");
			expect(res.data[0]).to.have.property("status");
			expect(res.data[0].status).to.equal(409);

			res = await noteTagService.getByNoteAndUserID({ note_id: 5, user_id: 3 });
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Sad");
		});
		it("It returns 200 when an existing tag is returned and an existing tag is inserted.", async () => {
			let res = await noteTagService.postTagAndNT([
				{
					note_id: "5",
					user_id: "3",
					title: "Sad"
				},
				{
					note_id: "5",
					user_id: "3",
					title: "Funny"
				}
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal("5");
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(1);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal("3");
			expect(res.data[0]).to.have.property("status");
			expect(res.data[0].status).to.equal(409);
			expect(res.data[1]).to.have.property("note_id");
			expect(res.data[1].note_id).to.equal("5");
			expect(res.data[1]).to.have.property("tag_id");
			expect(res.data[1].tag_id).to.equal(3);
			expect(res.data[1]).to.have.property("user_id");
			expect(res.data[1].user_id).to.equal("3");
			expect(res.data[1]).to.have.property("status");
			expect(res.data[1].status).to.equal(201);

			res = await noteTagService.getByNoteAndUserID({ note_id: 5, user_id: 3 });

			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(3);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Sad");
			expect(res.data[1]).to.have.property("title");
			expect(res.data[1].title).to.equal("Good");
			expect(res.data[2]).to.have.property("title");
			expect(res.data[2].title).to.equal("Funny");
		});
	});

	describe("postNT tests", async () => {
		it("postNT test when single tag already exists.", async () => {
			let res = await noteTagService.postNT({
				note_id: 5,
				tag_id: 1,
				user_id: 3
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(5);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(1);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(3);
			expect(res.data[0]).to.have.property("status");
			expect(res.data[0].status).to.equal(409);
		});

		it("postNT test when two tags already exists.", async () => {
			let res = await noteTagService.postNT([
				{
					note_id: 5,
					tag_id: 2,
					user_id: 3
				},
				{
					note_id: 5,
					tag_id: 1,
					user_id: 3
				}
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(5);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(2);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(3);
			expect(res.data[0]).to.have.property("status");
			expect(res.data[0].status).to.equal(409);
			expect(res.data[1]).to.have.property("note_id");
			expect(res.data[1].note_id).to.equal(5);
			expect(res.data[1]).to.have.property("tag_id");
			expect(res.data[1].tag_id).to.equal(1);
			expect(res.data[1]).to.have.property("user_id");
			expect(res.data[1].user_id).to.equal(3);
			expect(res.data[1]).to.have.property("status");
			expect(res.data[1].status).to.equal(409);
		});
		it("postNT test when one tag exists and one does not.", async () => {
			let res = await noteTagService.postNT([
				{
					note_id: 5,
					tag_id: 2,
					user_id: 3
				},
				{
					note_id: 5,
					tag_id: 3,
					user_id: 3
				}
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(5);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(2);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(3);
			expect(res.data[1]).to.have.property("note_id");
			expect(res.data[1].note_id).to.equal(5);
			expect(res.data[1]).to.have.property("tag_id");
			expect(res.data[1].tag_id).to.equal(3);
			expect(res.data[1]).to.have.property("user_id");
			expect(res.data[1].user_id).to.equal(3);
			expect(res.data[1]).to.have.property("status");
			expect(res.data[1].status).to.equal(201);
		});
		it("postNT test when one tag does not already exists.", async () => {
			let res = await noteTagService.postNT([
				{
					note_id: 5,
					tag_id: 3,
					user_id: 3
				}
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(5);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(3);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(3);
			expect(res.data[0]).to.have.property("status");
			expect(res.data[0].status).to.equal(201);
		});
		it("postNT test when one underlying user does not already exists.", async () => {
			let res = await noteTagService.postNT([
				{
					note_id: 5,
					tag_id: 3,
					user_id: 100
				}
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(5);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(3);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(100);
			expect(res.data[0]).to.have.property("status");
			expect(res.data[0].status).to.equal(404);
		});
		it("postNT test when one underlying tag does not already exists.", async () => {
			let res = await noteTagService.postNT([
				{
					note_id: 5,
					tag_id: 300,
					user_id: 3
				}
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(5);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(300);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(3);
			expect(res.data[0]).to.have.property("status");
			expect(res.data[0].status).to.equal(404);
		});
	});
	it("postNT test when one underlying note does not already exists.", async () => {
		let res = await noteTagService.postNT([
			{
				note_id: 500,
				tag_id: 3,
				user_id: 3
			}
		]);
		expect(res).to.be.a("object");
		expect(res).to.have.property("status");
		expect(res.status).to.equal(200);
		expect(res).to.have.property("data");
		expect(res.data).to.be.a("Array");
		expect(res.data).to.have.length(1);
		expect(res.data[0]).to.have.property("note_id");
		expect(res.data[0].note_id).to.equal(500);
		expect(res.data[0]).to.have.property("tag_id");
		expect(res.data[0].tag_id).to.equal(3);
		expect(res.data[0]).to.have.property("user_id");
		expect(res.data[0].user_id).to.equal(3);
		expect(res.data[0]).to.have.property("status");
		expect(res.data[0].status).to.equal(404);
	});
});
