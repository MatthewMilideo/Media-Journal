process.env.NODE_ENV = "test";



const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);
const expect = require("chai").expect;
const mediaModel = require("../models/media_model");

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../server.js");

chai.use(chaiHttp);

describe("Route: '/test/ ", function() {
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

	describe("Route: '/test/ ", function() {
		/* ~~~~~~~~~~~~~~~~~~~~~~~ GET ALL TAGS TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

		describe("searchPage | /test/", function() {
			it("searchPagereturns 404 when no tags are found", async () => {
				let requester = chai.request(server.app).keepOpen();
				await requester
					.post("/media/")
					.send({ title: "Doom The Movie", CID: "11", type: "MOVIE" });

				await requester.post("/media_user/").send({ media_id: 4, user_id: 1 });

				await requester.post("/media/").send({
					title: "Call Me By Your Name",
					CID: "140607",
					type: "MOVIE"
				});

				await requester.post("/media_user/").send({ media_id: 5, user_id: 1 });
				
				let res = await requester.post("/notes/").send({
					user_id: 1,
					title: "Doom is a very good movie.",
					data: "The title is a lie. Doom is not a very good movie.",
					mediaObj: {
						title: "Doom The Movie",
						type: "MOVIE",
						CID: "11"
					}
				});


				//console.log(res.body);
				res = await requester
					.get("/test/")
					.query({ user_id: 1, term: 'Star Wars'});

				console.log(res.body);


				requester.close();
			});
		});
	});
});
