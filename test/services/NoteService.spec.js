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

	describe("Note Count Service Tests", async () => {
		it(" Note Count returns null if the arguments are not provided.", async () => {
			try {
				res = await NoteService.Count();
			} catch (error) {
				expect(error).to.have.property("status");
				expect(error.status).to.equal(400);
			}
		});

		it(" Note Count returns null if the type is invalid.", async () => {
			try {
				await NoteService.Count(["1234"], "TEST_TYPE", 1);
			} catch (error) {
				expect(error).to.have.property("status");
				expect(error.status).to.equal(400);
			}
		});

		it("Note Count returns 404 if no media_users found.", async () => {
			try {
				let res = await NoteService.Count(["1234"], types.MOVIE, -200);
			} catch (error) {
				expect(error).to.have.property("status");
				expect(error.status).to.equal(404);
			}
		});

		it("Note Count returns data if no notes found", async () => {
			try {
				let res = await NoteService.Count(["1234"], types.MOVIE, 3);
				expect(res).to.be.a('object');
				expect(res).to.have.a.property('1234');
				expect(res[1234]).to.have.a.property('notes');
				expect(res[1234].notes).to.be.a('array');
				expect(res[1234].notes).to.have.length(0);
			} catch (error) {
			}
		});

		it("Note Count returns Object when Media User and notes are found.", async () => {
			let requester = chai.request(server.app).keepOpen();
			await requester
				.post("/media/")
				.send({ title: "Doom The Movie", CID: "11", type: "MOVIE" });

			await requester.post("/media_user/").send({ media_id: 4, user_id: 3 });

			await requester.post("/media/").send({
				title: "Call Me By Your Name",
				CID: "140607",
				type: "MOVIE"
			});
			await requester.post("/media_user/").send({ media_id: 5, user_id: 3 });

			await requester.post("/notes/").send({
				user_id: 3,
				title: "Doom is a very good movie.",
				data: "The title is a lie. Doom is not a very good movie.",
				mediaObj: {
					title: "Doom The Movie",
					type: "MOVIE",
					CID: "11"
				}
			});

			requester.close();
			let res = await NoteService.Count(["11", "1234"], types.MOVIE, 3);
			expect(res).to.be.a("object");
			expect(res).to.have.property("11");
			expect(res[11]).to.have.property("media_id");
			expect(res[11].media_id).to.equal(4);
			expect(res[11]).to.have.property("notes");
			expect(res[11].notes).to.be.a("array");
			expect(res[11].notes).to.have.length(1);
		});
	});
});
