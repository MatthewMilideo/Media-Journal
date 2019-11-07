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

	/*
	*/
	/*

	
	describe("NoteTagService postNT Tests", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await noteTagService.postNT();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("message");
			expect(res.message).to.equal(
				"You must provide a valid noteID, userID, and at least one tag_id."
			);
		});
		it("It returns 400 when an incorrect note ID", async () => {
			let res = await noteTagService.postNT("test", "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("message");
			expect(res.message).to.equal(
				"You must provide a valid noteID, userID, and at least one tag_id."
			);
		});
		it("It returns 400 when an incorrect user id is provided.", async () => {
			let res = await noteTagService.postNT(1, "test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("message");
			expect(res.message).to.equal(
				"You must provide a valid noteID, userID, and at least one tag_id."
			);
		});
		it("It returns 400 when an incorrect tag id is provided.", async () => {
			let res = await noteTagService.postNT(1, 1, "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("message");
			expect(res.message).to.equal(
				"You must provide a valid noteID, userID, and at least one tag_id."
			);
		});
		it("When note_id is not found it has an item in the error array.", async () => {
			let res = await noteTagService.postNT(100, 1, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.success).to.have.length(0);
			expect(res.data.error).to.have.length(1);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The note required for this operation could not be found."
			);
		});
		it("When user_id is not found it has an item in the error array.", async () => {
			let res = await noteTagService.postNT(1, 100, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.success).to.have.length(0);
			expect(res.data.error).to.have.length(1);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The user required for this operation could not be found."
			);
		});
		it("When tag_id is not found it has an item in the error array.", async () => {
			let res = await noteTagService.postNT(1, 1, 100);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.success).to.have.length(0);
			expect(res.data.error).to.have.length(1);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The tag required for this operation could not be found."
			);
		});
		it("When tag_id is array and is not found it has an item in the error array.", async () => {
			let res = await noteTagService.postNT(1, 1, [100]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.success).to.have.length(0);
			expect(res.data.error).to.have.length(1);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The tag required for this operation could not be found."
			);
		});

		it("When tag_id is an array and two elems are not inserted", async () => {
			let res = await noteTagService.postNT(1, 1, [100, 102]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.error).to.have.length(2);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The tag required for this operation could not be found."
			);
			expect(res.data.error[1]).to.have.property("status");
			expect(res.data.error[1].status).to.equal(404);
			expect(res.data.error[1]).to.have.property("data");
			expect(res.data.error[1].data).to.have.property("message");
			expect(res.data.error[1].data.message).to.equal(
				"The tag required for this operation could not be found."
			);
		});

		it("When tag_id is an array and one elem is inserted, and the other is not.", async () => {
			let res = await noteTagService.postNT(1, 1, [100, 2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.error).to.have.length(1);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The tag required for this operation could not be found."
			);
			expect(res.data.success).to.have.length(1);
			expect(res.data.success[0]).to.have.property("status");
			expect(res.data.success[0].status).to.equal(201);
			expect(res.data.success[0]).to.have.property("data");
			expect(res.data.success[0]).to.have.property("data");
			expect(res.data.success[0].data).to.have.property("tag_id");
			expect(res.data.success[0].data.tag_id).to.equal(2);
			expect(res.data.success[0].data).to.have.property("note_id");
			expect(res.data.success[0].data.note_id).to.equal(1);
			expect(res.data.success[0].data).to.have.property("user_id");
			expect(res.data.success[0].data.user_id).to.equal(1);

			res = await noteTagService.getByNoteAndUserID({ note_id: 1, user_id: 1 });
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(2);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(1);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(1);
		});

		it("When tag_id is an array and one elem has insertion conflict, and the other is not inserted.", async () => {
			let res = await noteTagService.postNT(1, 2, [100, 2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.error).to.have.length(1);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The tag required for this operation could not be found."
			);
			expect(res.data.success).to.have.length(1);
			expect(res.data.success[0]).to.have.property("status");
			expect(res.data.success[0].status).to.equal(409);
			expect(res.data.success[0]).to.have.property("data");
			expect(res.data.success[0].data).to.have.property("message");
			expect(res.data.success[0].data.message).to.equal(
				"There was a conflict during insertion. You must provide a unique relation."
			);
			expect(res.data.success[0].data).to.have.property("tag_id");
			expect(res.data.success[0].data.tag_id).to.equal(2);
			expect(res.data.success[0].data).to.have.property("note_id");
			expect(res.data.success[0].data.note_id).to.equal(1);
			expect(res.data.success[0].data).to.have.property("user_id");
			expect(res.data.success[0].data.user_id).to.equal(2);
		});

		it("When tag_id is inserted.", async () => {
			let res = await noteTagService.postNT(1, 1, [2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.error).to.have.length(0);
			expect(res.data.success).to.have.length(1);
			expect(res.data.success[0]).to.have.property("status");
			expect(res.data.success[0].status).to.equal(201);
			expect(res.data.success[0]).to.have.property("data");
			expect(res.data.success[0].data).to.have.property("tag_id");
			expect(res.data.success[0].data.tag_id).to.equal(2);
			expect(res.data.success[0].data).to.have.property("note_id");
			expect(res.data.success[0].data.note_id).to.equal(1);
			expect(res.data.success[0].data).to.have.property("user_id");
			expect(res.data.success[0].data.user_id).to.equal(1);

			res = await noteTagService.getByNoteAndUserID({ note_id: 1, user_id: 1 });
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(2);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(1);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(1);
		});
	});

	/*
	
	describe("NoteTagService deleteNT Tests", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await noteTagService.deleteNT();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid note_id, user_id, and tag_ids."
			);
		});
		it("It returns 400 when invalid note provided.", async () => {
			let res = await noteTagService.deleteNT("test", 1, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid note_id, user_id, and tag_ids."
			);
		});
		it("It returns 400 when invalid user provided.", async () => {
			let res = await noteTagService.deleteNT(1, "test", 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid note_id, user_id, and tag_ids."
			);
		});
		it("It returns 400 when invalid tag provided.", async () => {
			let res = await noteTagService.deleteNT(1, 1, "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid note_id, user_id, and tag_ids."
			);
		});

		it("When note_id is not found it has an item in the error array.", async () => {
			let res = await noteTagService.deleteNT(100, 1, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.success).to.have.length(0);
			expect(res.data.error).to.have.length(1);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The requested note_tag was not found."
			);
			expect(res.data.error[0].data).to.have.property("note_id");
			expect(res.data.error[0].data.note_id).to.equal(100);
			expect(res.data.error[0].data).to.have.property("user_id");
			expect(res.data.error[0].data.user_id).to.equal(1);
			expect(res.data.error[0].data).to.have.property("tag_id");
			expect(res.data.error[0].data.tag_id).to.equal(1);
		});

		it("When note_id not found and two tags are attempted it has two item in the error array.", async () => {
			let res = await noteTagService.deleteNT(100, 1, [1, 2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.success).to.have.length(0);
			expect(res.data.error).to.have.length(2);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The requested note_tag was not found."
			);
			expect(res.data.error[0].data).to.have.property("note_id");
			expect(res.data.error[0].data.note_id).to.equal(100);
			expect(res.data.error[0].data).to.have.property("user_id");
			expect(res.data.error[0].data.user_id).to.equal(1);
			expect(res.data.error[0].data).to.have.property("tag_id");
			expect(res.data.error[0].data.tag_id).to.equal(1);

			expect(res.data.error[1]).to.have.property("status");
			expect(res.data.error[1].status).to.equal(404);
			expect(res.data.error[1]).to.have.property("data");
			expect(res.data.error[1].data).to.have.property("message");
			expect(res.data.error[1].data.message).to.equal(
				"The requested note_tag was not found."
			);
			expect(res.data.error[1].data).to.have.property("note_id");
			expect(res.data.error[1].data.note_id).to.equal(100);
			expect(res.data.error[1].data).to.have.property("user_id");
			expect(res.data.error[1].data.user_id).to.equal(1);
			expect(res.data.error[1].data).to.have.property("tag_id");
			expect(res.data.error[1].data.tag_id).to.equal(2);
		});

		it("When user_id not found and two tags are attempted it has two item in the error array.", async () => {
			let res = await noteTagService.deleteNT(1, 100, [1, 2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.success).to.have.length(0);
			expect(res.data.error).to.have.length(2);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The requested note_tag was not found."
			);
			expect(res.data.error[0].data).to.have.property("note_id");
			expect(res.data.error[0].data.note_id).to.equal(1);
			expect(res.data.error[0].data).to.have.property("user_id");
			expect(res.data.error[0].data.user_id).to.equal(100);
			expect(res.data.error[0].data).to.have.property("tag_id");
			expect(res.data.error[0].data.tag_id).to.equal(1);

			expect(res.data.error[1]).to.have.property("status");
			expect(res.data.error[1].status).to.equal(404);
			expect(res.data.error[1]).to.have.property("data");
			expect(res.data.error[1].data).to.have.property("message");
			expect(res.data.error[1].data.message).to.equal(
				"The requested note_tag was not found."
			);
			expect(res.data.error[1].data).to.have.property("note_id");
			expect(res.data.error[1].data.note_id).to.equal(1);
			expect(res.data.error[1].data).to.have.property("user_id");
			expect(res.data.error[1].data.user_id).to.equal(100);
			expect(res.data.error[1].data).to.have.property("tag_id");
			expect(res.data.error[1].data.tag_id).to.equal(2);
		});

		it("When one tag is not found and the other is.", async () => {
			let res = await noteTagService.deleteNT(1, 2, [1000, 1]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data.error).to.have.length(1);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The requested note_tag was not found."
			);
			expect(res.data.error[0].data).to.have.property("note_id");
			expect(res.data.error[0].data.note_id).to.equal(1);
			expect(res.data.error[0].data).to.have.property("user_id");
			expect(res.data.error[0].data.user_id).to.equal(2);
			expect(res.data.error[0].data).to.have.property("tag_id");
			expect(res.data.error[0].data.tag_id).to.equal(1000);

			expect(res.data.success).to.have.length(1);
			expect(res.data.success[0]).to.have.property("status");
			expect(res.data.success[0].status).to.equal(200);
			expect(res.data.success[0].data).to.have.property("note_id");
			expect(res.data.success[0].data.note_id).to.equal(1);
			expect(res.data.success[0].data).to.have.property("user_id");
			expect(res.data.success[0].data.user_id).to.equal(2);
			expect(res.data.success[0].data).to.have.property("tag_id");
			expect(res.data.success[0].data.tag_id).to.equal(1);

			res = await noteTagService.getByNoteAndUserID({ note_id: 1, user_id: 2 });
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("note_id");
			expect(res.data[0].note_id).to.equal(1);
			expect(res.data[0]).to.have.property("user_id");
			expect(res.data[0].user_id).to.equal(2);
			expect(res.data[0]).to.have.property("tag_id");
			expect(res.data[0].tag_id).to.equal(2);
		});

		it("When both tags are deleted.", async () => {
			let res = await noteTagService.deleteNT(1, 2, [1, 2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data.error).to.have.length(0);
			expect(res.data.success).to.have.length(2);
			expect(res.data.success[0]).to.have.property("status");
			expect(res.data.success[0].status).to.equal(200);
			expect(res.data.success[0].data).to.have.property("note_id");
			expect(res.data.success[0].data.note_id).to.equal(1);
			expect(res.data.success[0].data).to.have.property("user_id");
			expect(res.data.success[0].data.user_id).to.equal(2);
			expect(res.data.success[0].data).to.have.property("tag_id");
			expect(res.data.success[0].data.tag_id).to.equal(1);

			expect(res.data.success[1]).to.have.property("status");
			expect(res.data.success[1].status).to.equal(200);
			expect(res.data.success[1].data).to.have.property("note_id");
			expect(res.data.success[1].data.note_id).to.equal(1);
			expect(res.data.success[1].data).to.have.property("user_id");
			expect(res.data.success[1].data.user_id).to.equal(2);
			expect(res.data.success[1].data).to.have.property("tag_id");
			expect(res.data.success[1].data.tag_id).to.equal(2);

			res = await noteTagService.getByNoteAndUserID({ note_id: 1, user_id: 2 });
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it("When both tags are deleted.", async () => {
			let res = await noteTagService.deleteNT(1, 2, [1, 2, 1]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("success");
			expect(res.data.error).to.have.length(1);
			expect(res.data.error).to.have.length(1);
			expect(res.data.error[0]).to.have.property("status");
			expect(res.data.error[0].status).to.equal(404);
			expect(res.data.error[0]).to.have.property("data");
			expect(res.data.error[0].data).to.have.property("message");
			expect(res.data.error[0].data.message).to.equal(
				"The requested note_tag was not found."
			);
			expect(res.data.error[0].data).to.have.property("note_id");
			expect(res.data.error[0].data.note_id).to.equal(1);
			expect(res.data.error[0].data).to.have.property("user_id");
			expect(res.data.error[0].data.user_id).to.equal(2);
			expect(res.data.error[0].data).to.have.property("tag_id");
			expect(res.data.error[0].data.tag_id).to.equal(1);

			expect(res.data.error[0].data).to.have.property("note_id");

			expect(res.data.error[0].data.note_id).to.equal(1);
			expect(res.data.error[0].data).to.have.property("user_id");
			expect(res.data.error[0].data.user_id).to.equal(2);
			expect(res.data.error[0].data).to.have.property("tag_id");
			expect(res.data.error[0].data.tag_id).to.equal(1);

			expect(res.data.success).to.have.length(2);
			expect(res.data.success[0]).to.have.property("status");
			expect(res.data.success[0].status).to.equal(200);
			expect(res.data.success[0].data).to.have.property("note_id");
			expect(res.data.success[0].data.note_id).to.equal(1);
			expect(res.data.success[0].data).to.have.property("user_id");
			expect(res.data.success[0].data.user_id).to.equal(2);
			expect(res.data.success[0].data).to.have.property("tag_id");
			expect(res.data.success[0].data.tag_id).to.equal(1);

			expect(res.data.success[1]).to.have.property("status");
			expect(res.data.success[1].status).to.equal(200);
			expect(res.data.success[1].data).to.have.property("note_id");
			expect(res.data.success[1].data.note_id).to.equal(1);
			expect(res.data.success[1].data).to.have.property("user_id");
			expect(res.data.success[1].data.user_id).to.equal(2);
			expect(res.data.success[1].data).to.have.property("tag_id");
			expect(res.data.success[1].data.tag_id).to.equal(2);

			res = await noteTagService.getByNoteAndUserID({ note_id: 1, user_id: 2 });
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});
	});

	

	describe("NoteTagService postTagandNT Tests", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await noteTagService.postTagAndNT();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("message");
			expect(res.data.message).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
			expect(res.data).to.have.property("note_id");
			expect(res.data.note_id).to.equal(undefined);
			expect(res.data).to.have.property("user_id");
			expect(res.data.user_id).to.equal(undefined);
			expect(res.data).to.have.property("tag_titles");
			expect(res.data.tag_titles).to.be.a("array");
			expect(res.data.tag_titles).have.length(1);
			expect(res.data.tag_titles[0]).to.equal(undefined);
		});

		it("It returns 400 when an invalid note_id is provided.", async () => {
			let res = await noteTagService.postTagAndNT("test", "test", 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("message");
			expect(res.data.message).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
			expect(res.data).to.have.property("note_id");
			expect(res.data.note_id).to.equal("test");
			expect(res.data).to.have.property("user_id");
			expect(res.data.user_id).to.equal("test");
			expect(res.data).to.have.property("tag_titles");
			expect(res.data.tag_titles).to.be.a("array");
			expect(res.data.tag_titles).have.length(1);
			expect(res.data.tag_titles[0]).to.equal(1);
		});

		it("It returns 400 when an invalid user_id is provided.", async () => {
			let res = await noteTagService.postTagAndNT(1, "test", 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data.message).to.equal(
				"You must provide a valid noteID, userID, and title."
			);
			expect(res.data).to.have.property("note_id");
			expect(res.data.note_id).to.equal(1);
			expect(res.data).to.have.property("user_id");
			expect(res.data.user_id).to.equal("test");
			expect(res.data).to.have.property("tag_titles");
			expect(res.data.tag_titles).to.be.a("array");
			expect(res.data.tag_titles).have.length(1);
			expect(res.data.tag_titles[0]).to.equal(1);
		});

		it("It returns 404 when note id is not found", async () => {
			let res = await noteTagService.postTagAndNT(100, 1, "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("tags");
			expect(res.data.tags).to.be.a("object");
			expect(res.data.tags).to.have.property("success");
			expect(res.data.tags.success).to.have.length(1);
			expect(res.data.tags.success[0]).to.have.property("status");
			expect(res.data.tags.success[0].status).to.equal(201);
			expect(res.data.tags.success[0]).to.have.property("data");
			expect(res.data.tags.success[0].data).to.have.property("id");
			expect(res.data.tags.success[0].data.id).to.equal(4);
			expect(res.data.tags.success[0].data).to.have.property("title");
			expect(res.data.tags.success[0].data.title).to.equal("test");
			expect(res.data.tags).to.have.property("error");
			expect(res.data.tags.error).to.have.length(0);
			expect(res.data).to.have.property("NTs");
			expect(res.data.NTs).to.be.a("object");
			expect(res.data.NTs).to.have.property("success");
			expect(res.data.NTs.success).to.have.length(0);
			expect(res.data.NTs).to.have.property("error");
			expect(res.data.NTs.error).to.have.length(1);
			expect(res.data.NTs.error[0]).to.have.property("status");
			expect(res.data.NTs.error[0].status).to.equal(404);
			expect(res.data.NTs.error[0]).to.have.property("data");
			expect(res.data.NTs.error[0].data).to.have.property("note_id");
			expect(res.data.NTs.error[0].data.note_id).to.equal(100);
			expect(res.data.NTs.error[0].data).to.have.property("user_id");
			expect(res.data.NTs.error[0].data.user_id).to.equal(1);
			expect(res.data.NTs.error[0].data).to.have.property("tag_id");
			expect(res.data.NTs.error[0].data.tag_id).to.equal(4);
			expect(res.data.NTs.error[0].data).to.have.property("message");
			expect(res.data.NTs.error[0].data.message).to.equal(
				"The note required for this operation could not be found."
			);
		});

		it("It returns 404 when user id is not found", async () => {
			let res = await noteTagService.postTagAndNT(1, 100, "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("tags");
			expect(res.data.tags).to.be.a("object");
			expect(res.data.tags).to.have.property("success");
			expect(res.data.tags.success).to.have.length(1);
			expect(res.data.tags.success[0]).to.have.property("status");
			expect(res.data.tags.success[0].status).to.equal(201);
			expect(res.data.tags.success[0]).to.have.property("data");
			expect(res.data.tags.success[0].data).to.have.property("id");
			expect(res.data.tags.success[0].data.id).to.equal(4);
			expect(res.data.tags.success[0].data).to.have.property("title");
			expect(res.data.tags.success[0].data.title).to.equal("test");
			expect(res.data.tags).to.have.property("error");
			expect(res.data.tags.error).to.have.length(0);
			expect(res.data).to.have.property("NTs");
			expect(res.data.NTs).to.be.a("object");
			expect(res.data.NTs).to.have.property("success");
			expect(res.data.NTs.success).to.have.length(0);
			expect(res.data.NTs).to.have.property("error");
			expect(res.data.NTs.error).to.have.length(1);
			expect(res.data.NTs.error[0]).to.have.property("status");
			expect(res.data.NTs.error[0].status).to.equal(404);
			expect(res.data.NTs.error[0]).to.have.property("data");
			expect(res.data.NTs.error[0].data).to.have.property("note_id");
			expect(res.data.NTs.error[0].data.note_id).to.equal(1);
			expect(res.data.NTs.error[0].data).to.have.property("user_id");
			expect(res.data.NTs.error[0].data.user_id).to.equal(100);
			expect(res.data.NTs.error[0].data).to.have.property("tag_id");
			expect(res.data.NTs.error[0].data.tag_id).to.equal(4);
			expect(res.data.NTs.error[0].data).to.have.property("message");
			expect(res.data.NTs.error[0].data.message).to.equal(
				"The user required for this operation could not be found."
			);
		});

		it("Insertion conflict", async () => {
			let res = await noteTagService.postTagAndNT(1, 2, "Sad");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("tags");
			expect(res.data.tags).to.be.a("object");
			expect(res.data.tags).to.have.property("success");
			expect(res.data.tags.success).to.have.length(1);
			expect(res.data.tags.success[0]).to.have.property("status");
			expect(res.data.tags.success[0].status).to.equal(200);
			expect(res.data.tags.success[0]).to.have.property("data");
			expect(res.data.tags.success[0].data).to.have.property("id");
			expect(res.data.tags.success[0].data.id).to.equal(1);
			expect(res.data.tags.success[0].data).to.have.property("title");
			expect(res.data.tags.success[0].data.title).to.equal("Sad");
			expect(res.data.tags).to.have.property("error");
			expect(res.data.tags.error).to.have.length(0);
			expect(res.data).to.have.property("NTs");
			expect(res.data.NTs).to.be.a("object");
			expect(res.data.NTs).to.have.property("success");
			expect(res.data.NTs.success).to.have.length(1);
			expect(res.data.NTs).to.have.property("error");
			expect(res.data.NTs.error).to.have.length(0);
			expect(res.data.NTs.success[0]).to.have.property("status");
			expect(res.data.NTs.success[0].status).to.equal(409);
			expect(res.data.NTs.success[0]).to.have.property("data");
			expect(res.data.NTs.success[0].data).to.have.property("note_id");
			expect(res.data.NTs.success[0].data.note_id).to.equal(1);
			expect(res.data.NTs.success[0].data).to.have.property("user_id");
			expect(res.data.NTs.success[0].data.user_id).to.equal(2);
			expect(res.data.NTs.success[0].data).to.have.property("tag_id");
			expect(res.data.NTs.success[0].data.tag_id).to.equal(1);
			expect(res.data.NTs.success[0].data).to.have.property("message");
			expect(res.data.NTs.success[0].data.message).to.equal(
				"There was a conflict during insertion. You must provide a unique relation."
			);
		});

		it("Same Tag Twice ", async () => {
			let res = await noteTagService.postTagAndNT(1, 2, ["Sad", "Sad"]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("tags");
			expect(res.data.tags).to.be.a("object");
			expect(res.data.tags).to.have.property("success");
			expect(res.data.tags.success).to.have.length(1);
			expect(res.data.tags.success[0]).to.have.property("status");
			expect(res.data.tags.success[0].status).to.equal(200);
			expect(res.data.tags.success[0]).to.have.property("data");
			expect(res.data.tags.success[0].data).to.have.property("id");
			expect(res.data.tags.success[0].data.id).to.equal(1);
			expect(res.data.tags.success[0].data).to.have.property("title");
			expect(res.data.tags.success[0].data.title).to.equal("Sad");
			expect(res.data.tags).to.have.property("error");
			expect(res.data.tags.error).to.have.length(0);
			expect(res.data).to.have.property("NTs");
			expect(res.data.NTs).to.be.a("object");
			expect(res.data.NTs).to.have.property("success");
			expect(res.data.NTs.success).to.have.length(1);
			expect(res.data.NTs).to.have.property("error");
			expect(res.data.NTs.error).to.have.length(0);
			expect(res.data.NTs.success[0]).to.have.property("status");
			expect(res.data.NTs.success[0].status).to.equal(409);
			expect(res.data.NTs.success[0]).to.have.property("data");
			expect(res.data.NTs.success[0].data).to.have.property("note_id");
			expect(res.data.NTs.success[0].data.note_id).to.equal(1);
			expect(res.data.NTs.success[0].data).to.have.property("user_id");
			expect(res.data.NTs.success[0].data.user_id).to.equal(2);
			expect(res.data.NTs.success[0].data).to.have.property("tag_id");
			expect(res.data.NTs.success[0].data.tag_id).to.equal(1);
			expect(res.data.NTs.success[0].data).to.have.property("message");
			expect(res.data.NTs.success[0].data.message).to.equal(
				"There was a conflict during insertion. You must provide a unique relation."
			);
		});

		it("Old and New Tag ", async () => {
			let res = await noteTagService.postTagAndNT(1, 2, ["Sad", "New Tag"]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("tags");
			expect(res.data.tags).to.be.a("object");
			expect(res.data.tags).to.have.property("success");
			expect(res.data.tags.success).to.have.length(2);
			expect(res.data.tags.success[0]).to.have.property("status");
			expect(res.data.tags.success[0].status).to.equal(200);
			expect(res.data.tags.success[0]).to.have.property("data");
			expect(res.data.tags.success[0].data).to.have.property("id");
			expect(res.data.tags.success[0].data.id).to.equal(1);
			expect(res.data.tags.success[0].data).to.have.property("title");
			expect(res.data.tags.success[0].data.title).to.equal("Sad");
			expect(res.data.tags.success[1]).to.have.property("status");
			expect(res.data.tags.success[1].status).to.equal(201);
			expect(res.data.tags.success[1]).to.have.property("data");
			expect(res.data.tags.success[1].data).to.have.property("id");
			expect(res.data.tags.success[1].data.id).to.equal(4);
			expect(res.data.tags.success[1].data).to.have.property("title");
			expect(res.data.tags.success[1].data.title).to.equal("New Tag");
			expect(res.data.tags).to.have.property("error");
			expect(res.data.tags.error).to.have.length(0);
			expect(res.data).to.have.property("NTs");
			expect(res.data.NTs).to.be.a("object");
			expect(res.data.NTs).to.have.property("success");
			expect(res.data.NTs.success).to.have.length(2);
			expect(res.data.NTs).to.have.property("error");
			expect(res.data.NTs.error).to.have.length(0);
			expect(res.data.NTs.success[0]).to.have.property("status");
			expect(res.data.NTs.success[0].status).to.equal(409);
			expect(res.data.NTs.success[0]).to.have.property("data");
			expect(res.data.NTs.success[0].data).to.have.property("note_id");
			expect(res.data.NTs.success[0].data.note_id).to.equal(1);
			expect(res.data.NTs.success[0].data).to.have.property("user_id");
			expect(res.data.NTs.success[0].data.user_id).to.equal(2);
			expect(res.data.NTs.success[0].data).to.have.property("tag_id");
			expect(res.data.NTs.success[0].data.tag_id).to.equal(1);
			expect(res.data.NTs.success[0].data).to.have.property("message");
			expect(res.data.NTs.success[0].data.message).to.equal(
				"There was a conflict during insertion. You must provide a unique relation."
			);
			expect(res.data.NTs.success[1]).to.have.property("status");
			expect(res.data.NTs.success[1].status).to.equal(201);
			expect(res.data.NTs.success[1]).to.have.property("data");
			expect(res.data.NTs.success[1].data).to.have.property("note_id");
			expect(res.data.NTs.success[1].data.note_id).to.equal(1);
			expect(res.data.NTs.success[1].data).to.have.property("user_id");
			expect(res.data.NTs.success[1].data.user_id).to.equal(2);
			expect(res.data.NTs.success[1].data).to.have.property("tag_id");
			expect(res.data.NTs.success[1].data.tag_id).to.equal(4);

			res = await noteTagService.getByNoteAndUserID({ note_id: 1, user_id: 2 });
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(3);
		});
	});
	*/

	describe("NoteTagService editNT Tests", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await noteTagService.editNT();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("message");
			expect(res.data.message).to.equal(
				"You must provide a valid noteID, userID"
			);
		});

		it("It returns current tags when no add or remove arguments are provided.", async () => {
			let res = await noteTagService.editNT(1, 2, [], []);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("final");
			expect(res.data.final).to.be.a("object");
			expect(res.data.final).to.have.property("data");
			expect(res.data.final.data).to.be.a("array");
			expect(res.data.final.data).to.have.length(2);
			expect(res.data.final.data[0]).to.have.property("title");
			expect(res.data.final.data[0].title).to.equal("Sad");
			expect(res.data.final.data[1]).to.have.property("title");
			expect(res.data.final.data[1].title).to.equal("Good");
		});

		it("It adds tags", async () => {
			let res = await noteTagService.editNT(1, 2, ["Hello"], []);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("final");
			expect(res.data.final).to.be.a("object");
			expect(res.data.final).to.have.property("data");
			expect(res.data.final.data).to.be.a("array");
			expect(res.data.final.data).to.have.length(3);
			expect(res.data.final.data[0]).to.have.property("title");
			expect(res.data.final.data[0].title).to.equal("Sad");
			expect(res.data.final.data[1]).to.have.property("title");
			expect(res.data.final.data[1].title).to.equal("Good");
			expect(res.data.final.data[2]).to.have.property("title");
			expect(res.data.final.data[2].title).to.equal("Hello");
		});

		it("It removes tags", async () => {
			let res = await noteTagService.editNT(1, 2, ["Hello"], [1]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("final");
			expect(res.data.final).to.be.a("object");
			expect(res.data.final).to.have.property("data");
			expect(res.data.final.data).to.be.a("array");
			expect(res.data.final.data).to.have.length(2);
			expect(res.data.final.data[0]).to.have.property("title");
			expect(res.data.final.data[0].title).to.equal("Good");
			expect(res.data.final.data[1]).to.have.property("title");
			expect(res.data.final.data[1].title).to.equal("Hello");
		});

		it("It removes all tags", async () => {
			let res = await noteTagService.editNT(1, 2, ["Hello"], [1, 2, 4]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("final");
			expect(res.data.final).to.be.a("object");
			expect(res.data.final).to.have.property("data");
			expect(res.data.final.data).to.equal(
				"The requested note_tags were not found."
			);
		});

		it("It works with duplicate remove tags", async () => {
			let res = await noteTagService.editNT(1, 2, ["Hello"], [1, 1, 2, 4]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("final");
			expect(res.data.final).to.be.a("object");
			expect(res.data.final).to.have.property("data");
			expect(res.data.final.data).to.equal(
				"The requested note_tags were not found."
			);
		});
	});
});
