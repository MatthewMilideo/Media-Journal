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
const NoteService = require("../../services/NoteService");
const MediaService = require("../../services/MediaService");
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
	describe("SearchExt TMDB Tests", async () => {
		it("SearchExt MOVIE returns 400 when there are no arguments.", async () => {
			let res = await SearchPageService.searchExt();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid term, type, and page."
			);
		});
		it("SearchExt MOVIE returns 400 when there is an invalid search term.", async () => {
			let res = await SearchPageService.searchExt([1, 2, 3, 4, 5], "MOVIE", 0);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid term, type, and page."
			);
		});

		it("SearchExt MOVIE returns 400 when there is a search term and we are querying a non-existent page.", async () => {
			let res = await SearchPageService.searchExt("Star Wars", "MOVIE", -1);
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("SearchExt MOVIE returns 404 when there is a search term and we are querying a non-existent page.", async () => {
			let res = await SearchPageService.searchExt("Star Wars", "MOVIE", 100);
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it("SearchExt MOVIE returns 200 when there is a valid search term.", async () => {
			let res = await SearchPageService.searchExt("Star Wars", "MOVIE");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");
		});

		it("SearchExt MOVIE returns 200 when there is a search term and we are querying the next page", async () => {
			let res = await SearchPageService.searchExt("Star Wars", "MOVIE", 2);
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");
		});

		it("SearchExt TV returns 200 when there is a search term and we are querying the next page", async () => {
			let res = await SearchPageService.searchExt("Hello", "TV", 2);
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");
		});
	});

	describe("SearchExt gBooks Tests", async () => {
		it("searchExt Books returns 400 when there are no arguments.", async () => {
			let res = await SearchPageService.searchExt();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid term, type, and page."
			);
		});
		it("searchExt Books returns 400 when there is an invalid search term.", async () => {
			let res = await SearchPageService.searchExt([1, 2, 3, 4, 5], "BOOK");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid term, type, and page."
			);
		});
		it("searchExt Books returns 404 when there is an invalid search term.", async () => {
			let res = await SearchPageService.searchExt(
				"abcdefjdkfdskgbsdkgdskgjgdfjkfjsfjsdvndlfjgsdoifniudfnbdflkvndkjbivndrbndf",
				"BOOK"
			);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it("searchExt Books returns 400 when there is a search term and we are querying a non-existent page.", async () => {
			let res = await SearchPageService.searchExt("Star Wars", "BOOK", 500000);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("searchExt Books returns 400 when there is a search term and we are querying a non-existent page.", async () => {
			let res = await SearchPageService.searchExt("Star Wars", "BOOK" - 1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
			expect(res).to.have.property("data");
			expect(res.data).to.equal(
				"You must provide a valid term, type, and page."
			);
		});
		it("searchExt Books returns 200 when there is a valid search term.", async () => {

			let res = await SearchPageService.searchExt("Star Wars", 'BOOK');
			expect(res).to.have.property("status");
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");
		});

		it("searchExt Books returns 200 when there is a search term and we are querying the next page", async () => {
			let res = await SearchPageService.searchExt("Star Wars", 'BOOK' , 20);
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");
		});
	});
	*/

	describe("SearchPageService Search Movie Tests", async () => {
		it(" Search returns 400 if no arguments are provided.", async () => {
			let res = await SearchPageService.search();
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it(" Search returns 400 if the type is not valid", async () => {
			let res = await SearchPageService.search(1, "Star Wars", "Test_Type");
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it(" Search Page Service with no results from TMDB returns a 404", async () => {
			let res = await SearchPageService.search(1, " ", types.MOVIE);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it(" Search Page Service with no invalid params returns a 400", async () => {
			let res = await SearchPageService.search(1, " ", types.MOVIE, -1);
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it(" Search Page query returns search data even if no user relation present ", async () => {
			let res = await SearchPageService.search(1, "Star Wars", types.MOVIE);
			res.should.be.a("object");
			res.should.have.a.property("status");
			res.status.should.equal(200);
			res.should.have.a.property("data");
			expect(res.data).to.have.a.property("11");
			res.data[11].should.have.a.property("viewed");
			res.data[11].viewed.should.equal(false);
		});

		it(" Search Page query returns search data even if no user relation present ", async () => {
			let res = await SearchPageService.search(1, "Star Wars", types.MOVIE, 2);
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
			let res = await NoteService.postNoteAll(
				"Doom is a very good movie.",
				"The title is a lie. Doom is not a very good movie.",
				3,
				{
					title: "Doom The Movie",
					type: "MOVIE",
					CID: "11"
				}
			);

			res = await NoteService.postNoteAndMN(
				"Doom is a very good movie 2.",
				"The title is a lie. Doom is not a very good movie. 2",
				3,
				4
			);

			console.log(res);

			res = await MediaService.postMediaAndMU(
				{ title: "Call Me By Your Name", CID: "140607", type: "MOVIE" },
				3
			);

			res = await SearchPageService.search(3, "Star Wars", types.MOVIE);
			expect(res).to.be.a("object");
			expect(res).to.have.a.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.a.property("data");
			expect(res.data).to.have.a.property("11");
			expect(res.data[11]).to.have.a.property("viewed");
			expect(res.data[11].viewed).to.equal(true);
			expect(res.data[11]).to.have.a.property("noteCount");
			expect(res.data[11].noteCount).to.equal(2);
		});
	});
	/*
	describe("Search Page Service TV Tests", async () => {
		it(" Search Page Service with no results from TMDB returns a 404", async () => {
			let res = await expect(SearchPageService.searchTMDB(1, " ", types.TV)).to
				.be.rejected;

			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it(" Search Page Service with no invalid params returns a 400", async () => {
			let res = await expect(SearchPageService.searchTMDB(1, " ", types.TV, -1))
				.to.be.rejected;

			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
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
			res.data.should.have.a.property("52233");
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
	
	describe("Search Page Service Book Tests", async () => {
		it(" Search Page Service 400 if the term and user_id and index are not provided.", async () => {
			let res = await expect(SearchPageService.searchGBooks()).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});


		it(" Search Page Service with no results from TMDB returns a 404", async () => {
			let res = await expect(SearchPageService.searchGBooks(1, "abcdebdjndsfnkdsnjkfdsjkngffdkfdskfdskfdsjknfdsjknfs"))
				.to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it(" Search Page Service with invalid index param returns a 400", async () => {
			let res = await expect(
				SearchPageService.searchGBooks(1, "Star Wars", -1)
			).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it(" Search Page query returns search data even if no user relation present ", async () => {
			let res = await SearchPageService.searchGBooks(1, "Star Wars");
			res.should.be.a("object");
			res.should.have.a.property("status");
			res.status.should.equal(200);
			res.should.have.a.property("data");
			expect(res.data).to.have.a.property('xmKf7BnQiqMC');
			res.data['xmKf7BnQiqMC'].should.have.a.property("viewed");
			res.data['xmKf7BnQiqMC'].viewed.should.equal(false);
		});

		it(" Search Page query returns search data even if no user relation present ", async () => {
	
			let res = await SearchPageService.searchGBooks(1, "Star Wars", 20);
			res.should.be.a("object");
			res.should.have.a.property("status");
			res.status.should.equal(200);
			res.should.have.a.property("data");
			res.data.should.have.a.property('CsllDwAAQBAJ');
			res.data['CsllDwAAQBAJ'].should.have.a.property("viewed");
			res.data['CsllDwAAQBAJ'].viewed.should.equal(false);
			
		});

		it("Search Page query returns search data with user data if relation is present", async () => {
			let requester = chai.request(server.app).keepOpen();
			await requester
				.post("/media/")
				.send({ title: "Doom The Movie", CID: 'CsllDwAAQBAJ', type: "BOOK" });

			await requester.post("/media_user/").send({ media_id: 4, user_id: 3 });

			await requester.post("/notes/").send({
				user_id: 3,
				title: "Doom is a very good movie.",
				data: "The title is a lie. Doom is not a very good movie.",
				mediaObj: {
					title: "Doom The Movie",
					type: "BOOK",
					CID: 'CsllDwAAQBAJ'
				}
			});

			let res = await SearchPageService.searchGBooks(3, "Star Wars", 20);
			expect(res).to.be.a("object");
			expect(res).to.have.a.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.a.property("data");
			res.should.have.a.property("data");
			res.data.should.have.a.property('CsllDwAAQBAJ');
			res.data['CsllDwAAQBAJ'].should.have.a.property("viewed");
			res.data['CsllDwAAQBAJ'].viewed.should.equal(true);
			expect(res.data['CsllDwAAQBAJ'].notes).to.be.a("array");
			expect(res.data['CsllDwAAQBAJ'].notes).to.have.length(1);
		});
	});
	*/
});
