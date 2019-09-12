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

const mediaService = require("../../services/MediaService");
const media = require("../../models/media_model");
const mediaUser = require("../../models/media_user_model");
const note = require("../../models/notes_model");
const mediaNote = require("../../models/media_note_model");
const T = require("../../types");

chai.use(chaiHttp);

describe("MediaService Tests", function() {
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
	describe("Get by CID Tests", async () => {
		it("It returns 400 when no CID type pairs are provided.", async () => {
			let res = await expect(mediaService.getByCID()).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid CID type pair(s).");
		});
		it("It returns 400 when invalid CID type pairs are provided.", async () => {
			let res = await expect(
				mediaService.getByCID({ CID: "test", type: "test" })
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid CID type pair(s).");
		});
		it("It returns 404 when no media is found.", async () => {
			let res = await expect(
				mediaService.getByCID({ CID: "12345678910", type: "MOVIE" })
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media were not found.");
		});
		it("It returns 404 when no media is found for multipule arguments.", async () => {
			let res = await expect(
				mediaService.getByCID(
					{ CID: "12345678910", type: "MOVIE" },
					{ CID: "12345678910", type: "BOOK" }
				)
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media were not found.");
		});
		it("It returns 200 when mediaIDs are found for a single media ID.", async () => {
			let res = await mediaService.getByCID([{ CID: "1234", type: "MOVIE" }]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
		});
		it("It returns 200 when mediaIDs are found for an array of media IDs.", async () => {
			let res = await mediaService.getByCID([
				{ CID: "1234", type: "MOVIE" },
				{ CID: "2345", type: "TV" }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
		});
		it("It returns 200 when mediaIDs are found for an array of media IDs including a non-existent id", async () => {
			let res = await mediaService.getByCID([
				{ CID: "1234", type: "MOVIE" },
				{ CID: "2345", type: "TV" },
				{ CID: "2345678910", type: "TV" }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
		});
	});
	

	describe("Get by CID User Tests", async () => {
		it("It returns 400 when no CID type pairs are provided.", async () => {
			let res = await expect(mediaService.getByCIDUser()).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid CID, type, and user object(s).");
		});
		it("It returns 400 when invalid CID type pairs are provided.", async () => {
			let res = await expect(
				mediaService.getByCIDUser({ CID: "test", type: "test", user_id: 1 })
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid CID, type, and user object(s).");
		});
		it("It returns 404 when no media is found.", async () => {
			let res = await expect(
				mediaService.getByCIDUser({ CID: "12345678910", type: "MOVIE", user_id: 1  })
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media were not found.");
		});
		it("It returns 404 when no media is found for user.", async () => {
			let res = await expect(
				mediaService.getByCIDUser({ CID: "1234", type: "MOVIE", user_id: 100})
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media were not found.");
		});
		it("It returns 404 when no media is found for multipule arguments.", async () => {
			let res = await expect(
				mediaService.getByCIDUser(
					{ CID: "12345678910", type: "MOVIE", user_id: 1 },
					{ CID: "12345678910", type: "BOOK", user_id: 1 }
				)
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media were not found.");
		});
		it("It returns 200 when mediaIDs are found for a single media ID.", async () => {
			let res = await mediaService.getByCIDUser([{ CID: "1234", type: "MOVIE", user_id:1 }]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
		});
		it("It returns 200 when mediaIDs are found for an array of media IDs.", async () => {
			let res = await mediaService.getByCIDUser([
				{ CID: "1234", type: "MOVIE", user_id: 1 },
				{ CID: "2345", type: "TV", user_id: 1  }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
		});
		it("It returns 200 when mediaIDs are found for an array of media IDs including a non-existent id", async () => {
			let res = await mediaService.getByCIDUser([
				{ CID: "1234", type: "MOVIE", user_id: 1  },
				{ CID: "2345", type: "TV", user_id: 1 },
				{ CID: "2345678910", type: "TV", user_id: 1 }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
		});
	});

	

	describe("Get by MediaID User Tests", async () => {
		it("It returns 400 when no media_id user pairs are provided.", async () => {
			let res = await expect(mediaService.getByMediaIDUser()).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid media_id and user object(s)."
			);
		});
		it("It returns 400 when invalid media_id user pairs are provided.", async () => {
			let res = await expect(
				mediaService.getByMediaIDUser({
					media_id: "test",
					type: "test",
					user_id: 1
				})
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid media_id and user object(s)."
			);
		});
		it("It returns 404 when no media is found.", async () => {
			let res = await expect(
				mediaService.getByMediaIDUser({ media_id: 1000, user_id: 1 })
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media were not found.");
		});
		it("It returns 404 when no media is found for user.", async () => {
			let res = await expect(
				mediaService.getByMediaIDUser({ media_id: 1, user_id: 1000 })
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media were not found.");
		});
		it("It returns 404 when no media is found for multipule arguments.", async () => {
			let res = await expect(
				mediaService.getByMediaIDUser(
					{ media_id: 100, user_id: 1 },
					{ media_id: 1, user_id: 100 }
				)
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("The requested media were not found.");
		});
		it("It returns 200 when mediaIDs are found for a single media ID.", async () => {
			let res = await mediaService.getByMediaIDUser([
				{ media_id: 1, user_id: 1 }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
		});
		it("It returns 200 when mediaIDs are found for an array of media IDs.", async () => {
			let res = await mediaService.getByMediaIDUser([
				{ media_id: 1, user_id: 1 },
				{ media_id: 2, user_id: 1 }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
		});
		it("It returns 200 when mediaIDs are found for an array of media IDs including a non-existent id", async () => {
			let res = await mediaService.getByMediaIDUser([
				{ media_id: 1, user_id: 1 },
				{ media_id: 2, user_id: 1 },
				{ media_id: 300, user_id: 1 }
			]);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(2);
		});
	});

	

	describe("Post Media Tests", async () => {
		it("It returns 400 when no mediaObj is provided", async () => {
			let res = await expect(mediaService.postMedia()).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid mediaObj.");
		});

		it("It returns 400 when an invalid mediaObj is provided", async () => {
			let res = await expect(
				mediaService.postMedia({
					title: "Hello",
					type: "test",
					CID: "1234"
				})
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal("You must provide a valid mediaObj.");
		});

		it("It returns 409 when the mediaObj already exists.", async () => {
			let res = await expect(
				mediaService.postMedia({
					title: "Hello",
					type: "MOVIE",
					CID: "1234"
				})
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(409);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"There was a conflict during insertion. You must provide a unique piece of media."
			);
		});

		it("It returns 201 when the media is inserted", async () => {
			let res = await mediaService.postMedia({
				title: "Cool Movie",
				type: "MOVIE",
				CID: "123456"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(201);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Cool Movie");

			res = await mediaService.getByCID({ type: "MOVIE", CID: "123456" });
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("title");
			expect(res.data[0].title).to.equal("Cool Movie");
		});
	});
	describe("Media Service postMU Test", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await mediaService.postMU();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid media and user pair."
			);
		});

		it("It returns 400 when invalid arguments are provided.", async () => {
			let res = await mediaService.postMU("test", "test");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid media and user pair."
			);
		});

		it("It returns 409 when the media is not found.", async () => {
			let res = await mediaService.postMU(100, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The media required for this operation could not be found."
			);
		});

		it("It returns 409 when the user is not found.", async () => {
			let res = await mediaService.postMU(1, 100);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The user required for this operation could not be found."
			);
		});

		it("It returns 409 when the media_user already exists.", async () => {
			let res = await mediaService.postMU(1, 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(409);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"There was a conflict during insertion. You must provide a unique relation."
			);
		});

		it("It returns 200 when the media_user is inserted", async () => {
			let res = await mediaService.postMU(2, 2);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(201);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(2);
		});
	});
	*/
	describe("Media Service postMediaUser Test", async () => {
		it("It returns 400 when no arguments are provided.", async () => {
			let res = await 
				mediaService.postMediaAndMU(
					{
						title: "Hello",
						type: "Test",
						CID: "1234"
					},
					1
				)
		
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid user_id mediaObj pair."
			);
		});

		it("It returns 400 when the mediaObj is invalid", async () => {
			let res = await 
				mediaService.postMediaAndMU(
					{
						title: "Hello",
						type: "Test",
						CID: "1234"
					},
					1
				)
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid user_id mediaObj pair."
			);
		});

		it("It returns 404 when the user is not found.", async () => {
			let res = await mediaService.postMediaAndMU(
				{
					title: "Hello",
					type: "MOVIE",
					CID: "1234"
				},
				100
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"The user required for this operation could not be found."
			);
		});

		it("It returns 409 when the relation already exists.", async () => {
			let res = await mediaService.postMediaAndMU(
				{
					title: "Hello",
					type: "MOVIE",
					CID: "1234"
				},
				1
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(409);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"There was a conflict during insertion. You must provide a unique relation."
			);
		});

		it("It returns 201 when the media already exists and user_media was inserted", async () => {
			let res = await mediaService.postMediaAndMU(
				{
					title: "The Sopranos",
					type: "TV",
					CID: "2345"
				},
				2
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(201);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(2);

			res = await mediaService.getByCIDUser({
				CID: "2345",
				type: "TV",
				user_id: 2
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(2);
			expect(res.data[0]).to.have.property("CID");
			expect(res.data[0].CID).to.equal("2345");
		});

		it("It returns 201 when the media does not exist and user_media was inserted", async () => {
			let res = await mediaService.postMediaAndMU(
				{
					title: "The Sopranos Movie",
					type: "MOVIE",
					CID: "2345"
				},
				1
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(201);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(4);

			res = await mediaService.getByCID({ CID: "2345", type: "MOVIE" });
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("id");
			expect(res.data[0].id).to.equal(4);
			expect(res.data[0]).to.have.property("CID");
			expect(res.data[0].CID).to.equal("2345");

			res = await mediaService.getByCIDUser({
				CID: "2345",
				type: "MOVIE",
				user_id: 1
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("Array");
			expect(res.data).to.have.length(1);
			expect(res.data[0]).to.have.property("media_id");
			expect(res.data[0].media_id).to.equal(4);
			expect(res.data[0]).to.have.property("CID");
			expect(res.data[0].CID).to.equal("2345");
		});
	});

	/*
	describe("Media Service Post MU Test", async () => {
		
		it("Media Service returns 400 if the user_id, and mediaObject are not provided.", async () => {
			let res = await expect(MediaService.postMU()).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("Media Service returns 400 if the nd mediaObject is not provided.", async () => {
			let res = await expect(MediaService.postMU(1)).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("Media Service returns 400 if the userID is not provided.", async () => {
			let res = await expect(
				MediaService.postMU({
					CID: "1234",
					type: T.MOVIE,
					title: "First Reformed"
				})
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
        });
        
        it("Media Service returns 404 if the user_id provided isn't in the database.", async () => {
			let res = await expect(MediaService.postMU(
				{ CID: "1234", type: T.MOVIE, title: "First Reformed" },
				500
            )).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it("Media Service returns 200 if the media_user is already in the database.", async () => {
			let res = await MediaService.postMU(
				{ CID: "1234", type: T.MOVIE, title: "First Reformed" },
				1
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);

			res = await media.getAllMedia();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("array");
			expect(res.data).to.have.length(3);

			res = await mediaUser.getAllMU();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("array");
            expect(res.data).to.have.length(7);
		});

		it("Media Service returns 201 if the media and media_user are not already in the database.", async () => {
			let res = await MediaService.postMU(
				{ CID: "12345", type: T.MOVIE, title: "First Reformed 2" },
				1
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
            expect(res.status).to.equal(201);
            
            res = await media.getAllMedia();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("array");
            expect(res.data).to.have.length(4);
            expect(res.data[3]).to.have.property('CID');
            expect(res.data[3].CID).to.equal('12345');

            res = await mediaUser.getAllMU();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).to.be.a("array");
            expect(res.data).to.have.length(8);
		});
		
	});
	describe("Media Service getMedia Test", async () => {
		
		it("getMedia returns 400 if the user_id, and mediaObject are not provided.", async () => {
			let res = await expect(MediaService.getMedia()).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("getMedia returns 400 if the and mediaObject is not provided.", async () => {
			let res = await expect(MediaService.getMedia(1)).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("Media Service returns 400 if the userID is not provided.", async () => {
			let res = await expect(
				MediaService.getMedia({
					CID: "1234",
					type: T.MOVIE,
					title: "First Reformed"
				})
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("Media Service returns 404 if the mediaObj is not found.", async () => {
			let res = await MediaService.getMedia(1, {
				CID: "12345",
				type: T.MOVIE,
				title: "First Reformed"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it("Media Service returns 404 if the media user relation is not found.", async () => {
			let res = await MediaService.getMedia(500, {
				CID: "1234",
				type: T.MOVIE,
				title: "First Reformed"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it("Media Service returns 200 if the media user relation is found but notes are not.", async () => {

			let res = await mediaUser.postMU(3, 1);

			res = await MediaService.getMedia(1, {
				CID: "3456",
				type: T.BOOK,
				title: "The Trial"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("media_id");
			expect(res.data.media_id).to.equal(3);
		});

		it("Media Service returns 200 if notes are found but no tags", async () => {
			let res = await mediaUser.postMU(3, 1);
			res = await note.postNote('The trial Note', 'A note tah dah', 1)
			res = await mediaNote.postMN(5,3);

			res = await MediaService.getMedia(1, {
				CID: "3456",
				type: T.BOOK,
				title: "The Trial"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			console.log(res.data);
			expect(res.data).to.have.property("media_id");
	
		});
		

		it("Media Service returns 200 if tags are found", async () => {

			res = await MediaService.getMedia(1, {
				CID: "1234",
				type: T.MOVIE,
				title: "First Reformed"
			});
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property("media_id");
			expect(res.data).to.have.property("keysArr");
			expect(res.data.keysArr).to.have.length(2);
		});

		


		
	});
	*/
});
