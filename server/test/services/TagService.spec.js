process.env.NODE_ENV = "test";

const environment = process.env.NODE_ENV || "development";
const configuration = require("../../knexfile")[environment];
const database = require("knex")(configuration);
const expect = require("chai").expect;
var chai = require("chai");

const TagService = require("../../services/TagService");

describe("TagService Tests", function() {
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

	describe("getByTitle Tests", async () => {
		it("getByTitle returns 400 when no title is provided.", async () => {
			let res = await TagService.getByTitle();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid title.");
		});

		it("getByTitle returns 400 when no title is provided.", async () => {
			let res = await TagService.getByTitle(4);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid title.");
		});

		it("getByTitle returns 404 when no tag is found.", async () => {
			let res = await TagService.getByTitle("test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested tag was not found.");
		});

		it("getByTitle returns 200 when tag is found.", async () => {
			let res = await TagService.getByTitle("Sad");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Sad");
			expect(res.data[0]).to.have.property("id");
			expect(res.data[0].id).to.equal(1);
		});
		it("getByTitle returns 200 when tag is found.", async () => {
			let res = await TagService.getByTitle(["Sad", "Test Tag"]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Sad");
			expect(res.data[0]).to.have.property("id");
			expect(res.data[0].id).to.equal(1);
		});

		it("getByTitle returns 200 when tag is found.", async () => {
			let res = await TagService.getByTitle(["Sad", "Good"]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(2);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Sad");
			expect(res.data[0]).to.have.property("id");
			expect(res.data[0].id).to.equal(1);
		});
	});

	describe("getByID Tests", async () => {
		it("getByID returns 400 when no title is provided.", async () => {
			let res = await TagService.getByID();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid ID.");
		});

		it("getByID returns 400 when no title is provided.", async () => {
			let res = await TagService.getByID('hello');
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid ID.");
		});

		it("getByID returns 404 when no tag is found.", async () => {
			let res = await TagService.getByID(100);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested tag was not found.");
		});

		it("getByID returns 200 when tag is found.", async () => {
			let res = await TagService.getByID(1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Sad");
			expect(res.data[0]).to.have.property("id");
			expect(res.data[0].id).to.equal(1);
		});
		it("getByID returns 200 when tag is found.", async () => {
			let res = await TagService.getByID([1, 100]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Sad");
			expect(res.data[0]).to.have.property("id");
			expect(res.data[0].id).to.equal(1);
		});

		it("getByID returns 200 when tag is found.", async () => {
			let res = await TagService.getByID([1,2]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(2);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Sad");
			expect(res.data[0]).to.have.property("id");
			expect(res.data[0].id).to.equal(1);
		});
	});

	/*
	describe("searchByTitle Tests", async () => {
		it("searchByTitle returns 400 when no title is provided.", async () => {
			let res = await TagService.searchByTitle();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid title.");
		});

		it("searchByTitle returns 400 when no title is provided.", async () => {
			let res = await TagService.searchByTitle(4);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid title.");
		});

		it("searchByTitle returns 404 when no tag is found.", async () => {
			let res = await TagService.searchByTitle("test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested tag was not found.");
		});

		it("searchByTitle returns 200 when tag is found.", async () => {
			let res = await TagService.postTag("Salmon");
			res = await TagService.searchByTitle("Sa");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(2);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Sad");
			expect(res.data[0]).to.have.property("id");
			expect(res.data[0].id).to.equal(1);
			expect(res.data[1]).to.have.property("title");
			expect(res.data[1].title).to.equal("Salmon");
			expect(res.data[1]).to.have.property("id");
			expect(res.data[1].id).to.equal(4);
		});
	});
	*/

	describe("postTag Tests", async () => {
		it("postTag returns 400 when no title is provided.", async () => {
			let res = await TagService.postTag();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid title.");
		});

		it("postTag returns 400 when invalid title is provided.", async () => {
			let res = await TagService.postTag(1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid title.");
		});

		it("postTag returns the tag when it already exists", async () => {
			let res = await TagService.postTag("Sad");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("object");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.error).to.have.length(0);
			expect(res.data.success).to.have.length(1);
			expect(res.data.success[0]).to.have.property("status");
			expect(res.data.success[0].status).to.equal(200);
			expect(res.data.success[0]).to.have.property("data");
			expect(res.data.success[0].data).to.have.property("title");
			expect(res.data.success[0].data.title).to.equal("Sad");
			expect(res.data.success[0].data).to.have.property("id");
			expect(res.data.success[0].data.id).to.equal(1);
		});

		it("postTag returns the tags when they already exists", async () => {
			let res = await TagService.postTag(["Sad", "Good"]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("object");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.error).to.have.length(0);
			expect(res.data.success).to.have.length(2);
			expect(res.data.success[0]).to.have.property("status");
			expect(res.data.success[0].status).to.equal(200);
			expect(res.data.success[0]).to.have.property("data");
			expect(res.data.success[0].data).to.have.property("title");
			expect(res.data.success[0].data.title).to.equal("Sad");
			expect(res.data.success[0].data).to.have.property("id");
			expect(res.data.success[0].data.id).to.equal(1);
			expect(res.data.success[1]).to.have.property("status");
			expect(res.data.success[1].status).to.equal(200);
			expect(res.data.success[1]).to.have.property("data");
			expect(res.data.success[1].data).to.have.property("title");
			expect(res.data.success[1].data.title).to.equal("Good");
			expect(res.data.success[1].data).to.have.property("id");
			expect(res.data.success[1].data.id).to.equal(2);
		});

		it("postTag returns the tags with duplicates removed", async () => {
			let res = await TagService.postTag(["Sad", "Sad", "Good"]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("object");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.error).to.have.length(0);
			expect(res.data.success).to.have.length(2);
			expect(res.data.success[0]).to.have.property("status");
			expect(res.data.success[0].status).to.equal(200);
			expect(res.data.success[0]).to.have.property("data");
			expect(res.data.success[0].data).to.have.property("title");
			expect(res.data.success[0].data.title).to.equal("Sad");
			expect(res.data.success[0].data).to.have.property("id");
			expect(res.data.success[0].data.id).to.equal(1);
			expect(res.data.success[1]).to.have.property("status");
			expect(res.data.success[1].status).to.equal(200);
			expect(res.data.success[1]).to.have.property("data");
			expect(res.data.success[1].data).to.have.property("title");
			expect(res.data.success[1].data.title).to.equal("Good");
			expect(res.data.success[1].data).to.have.property("id");
			expect(res.data.success[1].data.id).to.equal(2);
		});

		it("postTag returns the existing tag and the new tag.", async () => {
			let res = await TagService.postTag(["Sad", "Hello"]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("object");
			expect(res.data).to.have.property("success");
			expect(res.data).to.have.property("error");
			expect(res.data.error).to.have.length(0);
			expect(res.data.success).to.have.length(2);
			expect(res.data.success[0]).to.have.property("status");
			expect(res.data.success[0].status).to.equal(200);
			expect(res.data.success[0]).to.have.property("data");
			expect(res.data.success[0].data).to.have.property("title");
			expect(res.data.success[0].data.title).to.equal("Sad");
			expect(res.data.success[0].data).to.have.property("id");
			expect(res.data.success[0].data.id).to.equal(1);
			expect(res.data.success[1]).to.have.property("status");
			expect(res.data.success[1].status).to.equal(201);
			expect(res.data.success[1]).to.have.property("data");
			expect(res.data.success[1].data).to.have.property("title");
			expect(res.data.success[1].data.title).to.equal("Hello");
			expect(res.data.success[1].data).to.have.property("id");
			expect(res.data.success[1].data.id).to.equal(4);

			res = await TagService.getByTitle("Hello");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");

			expect(res.data.Hello).to.have.property("title");
			expect(res.data.Hello.title).to.equal("Hello");
			expect(res.data.Hello).to.have.property("id");
			expect(res.data.Hello.id).to.equal(4);
		});

		it("postTag returns 201 when all tags are inserted", async () => {
			let res = await TagService.postTag(["Test", "Hello"]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.data.error).to.have.length(0);
			expect(res.data.success).to.have.length(2);
			expect(res.data.success[0]).to.have.property("status");
			expect(res.data.success[0].status).to.equal(201);
			expect(res.data.success[0]).to.have.property("data");
			expect(res.data.success[0].data).to.have.property("title");
			expect(res.data.success[0].data.title).to.equal("Test");
			expect(res.data.success[0].data).to.have.property("id");
			expect(res.data.success[0].data.id).to.equal(4);
			expect(res.data.success[1]).to.have.property("status");
			expect(res.data.success[1].status).to.equal(201);
			expect(res.data.success[1]).to.have.property("data");
			expect(res.data.success[1].data).to.have.property("title");
			expect(res.data.success[1].data.title).to.equal("Hello");
			expect(res.data.success[1].data).to.have.property("id");
			expect(res.data.success[1].data.id).to.equal(5);

			res = await TagService.getByTitle("Hello");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			res = await TagService.getByTitle("Hello");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");
			expect(res.data.Hello).to.have.property("title");
			expect(res.data.Hello.title).to.equal("Hello");
			expect(res.data.Hello).to.have.property("id");
			expect(res.data.Hello.id).to.equal(5);
		});
	});
});
