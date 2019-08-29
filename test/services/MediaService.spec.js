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

const MediaService = require("../../services/MediaService");
const media = require("../../models/media_model");
const mediaUser = require("../../models/media_user_model");
const note = require ("../../models/notes_model")
const mediaNote = require ("../../models/media_note_model")
const T = require("../../types");

chai.use(chaiHttp);

describe("Item Services Tests", function() {
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
	describe("Media Service Post MU Test", async () => {
		/*
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
		*/
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
});
