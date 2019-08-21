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

const SearchPageService = require("../../services/SearchPageService");
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

	describe("Search Page Service Movie Tests", async () => {
		it(" Search Page Service 400 if the term and user_id and type are not provided.", async () => {
			let res = await expect(SearchPageService.searchTMDB()).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it(" Search Page Service 400 if the type is not valid", async () => {
			let res = await expect(
				SearchPageService.searchTMDB(1, "Star Wars", "Test_Type")
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it(" Search Page Service with no results from TMDB returns a 404", async () => {
			let res = await expect(SearchPageService.searchTMDB(1, " ", types.MOVIE))
				.to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it(" Search Page Service with no invalid params returns a 422", async () => {
			let res = await expect(
				SearchPageService.searchTMDB(1, " ", types.MOVIE, -1)
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(422);
		});

		it(" Search Page query returns search data even if no user relation present ", async () => {
			let res = await SearchPageService.searchTMDB(1, "Star Wars", types.MOVIE);
			res.should.be.a("object");
			res.should.have.a.property("status");
			res.status.should.equal(200);
			res.should.have.a.property("data");
			expect(res.data).to.have.a.property("11");
			res.data[11].should.have.a.property("viewed");
			res.data[11].viewed.should.equal(false);
		});

		it(" Search Page query returns search data even if no user relation present ", async () => {
			let res = await SearchPageService.searchTMDB(
				1,
				"Star Wars",
				types.MOVIE,
				2
			);
			res.should.be.a("object");
			res.should.have.a.property("status");
			res.status.should.equal(200);
			res.should.have.a.property("data");
			res.data.should.have.a.property("1891");
			res.data[1891].should.have.a.property("viewed");
			res.data[1891].viewed.should.equal(false);
		});

		it("Search Page query returns search data with user data if relation is present", async () => {
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

			let res = await SearchPageService.searchTMDB(3, "Star Wars", types.MOVIE);
			expect(res).to.be.a("object");
			expect(res).to.have.a.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.a.property("data");
			expect(res.data).to.have.a.property("11");
			expect(res.data[11]).to.have.a.property("viewed");
			expect(res.data[11].viewed).to.equal(true);
			expect(res.data[11]).to.have.a.property("notes");
			expect(res.data[11].notes).to.be.a("array");
			expect(res.data[11].notes).to.have.length(1);
		});
	});
	describe("Search Page Service TV Tests", async () => {
		it(" Search Page Service with no results from TMDB returns a 404", async () => {
			let res = await expect(SearchPageService.searchTMDB(1, " ", types.TV)).to
				.be.rejected;

			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it(" Search Page Service with no invalid params returns a 422", async () => {
			let res = await expect(SearchPageService.searchTMDB(1, " ", types.TV, -1))
				.to.be.rejected;

			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(422);
		});

		it(" Search Page query returns search data even if no user relation present ", async () => {
			let res = await SearchPageService.searchTMDB(1, "Star Wars", types.TV);
				
			res.should.be.a("object");
			res.should.have.a.property("status");
			res.status.should.equal(200);
			res.should.have.a.property("data");
			res.data.should.have.a.property("85536");
			res.data[85536].should.have.a.property("viewed");
			res.data[85536].viewed.should.equal(false);
		});

		it(" Search Page query returns search data even if no user relation present ", async () => {
			let res = await SearchPageService.searchTMDB(1, "h", types.TV, 2);
			res.should.be.a("object");
			res.should.have.a.property("status");
			res.status.should.equal(200);
			res.should.have.a.property("data");
			res.data.should.have.a.property('52233');
			res.data[52233].should.have.a.property("viewed");
			res.data[52233].viewed.should.equal(false);
		});

		it("Search Page query returns search data with user data if relation is present", async () => {
			let requester = chai.request(server.app).keepOpen();
		

	

			await requester.post("/media/").send({
				title: "Call Me By Your Name",
				CID: "52233",
				type: "TV"
			});
			await requester.post("/media_user/").send({ media_id: 4, user_id: 3 });

			await requester.post("/notes/").send({
				user_id: 3,
				title: "Doom is a very good TV.",
				data: "The title is a lie. Doom is not a very good TV.",
				mediaObj: {
					title: "Doom The TV",
					type: "TV",
					CID: "52233"
				}
			});

			let res = await SearchPageService.searchTMDB(3, "h", types.TV, 2);
			expect(res).to.be.a("object");
			expect(res).to.have.a.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.a.property("data");
			expect(res.data).to.have.a.property("52233");
			expect(res.data[52233]).to.have.a.property("viewed");
			expect(res.data[52233].viewed).to.equal(true);
			expect(res.data[52233]).to.have.a.property("notes");
			expect(res.data[52233].notes).to.be.a("array");
			expect(res.data[52233].notes).to.have.length(1);
		});
	});
});
