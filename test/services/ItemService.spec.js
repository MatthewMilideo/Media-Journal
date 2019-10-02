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

const ItemService = require("../../services/ItemService");
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
	describe("Item Page Service Movie Tests", async () => {
		it("Item Page Service returns 400 if the user_id, CID, and type are not provided.", async () => {
			let res = await expect(ItemService.get()).to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("Item Page Service returns 400 if the CID, is not a string.", async () => {
			let res = await expect(ItemService.get(1, 125, T.MOVIE)).to.be
				.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("Item Page Service returns 400 if the CID, type is invalid", async () => {
			let res = await expect(ItemService.get(1, "12345", "TEST")).to.be
				.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("Item Page Service returns 400 if the user is invalid", async () => {
			let res = await expect(ItemService.get("Matt", "12345", "TEST"))
				.to.be.rejected;
			expect(res).to.be.a("object");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});


		it("Item Page Service returns 404 when media is not in TMDB database", async (done) => {
			let res = await expect(ItemService.get(1, "1234", T.MOVIE)).to.be.rejected;
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
			done(); 
		}).timeout(5000);

		it("Item Page Service returns 200 when media is not in internal database", async (done) => {
			let res = await ItemService.get(1, "181812", T.MOVIE)
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res.data).not.to.have.property("media_id");
			done(); 
		}).timeout(5000);


		/*
		it("Item Page Service returns 200 if correct", async () => {
            let requester = chai.request(server.app).keepOpen();
			await requester
				.post("/media/")
				.send({ title: "Doom The Movie", CID: "11", type: "MOVIE" });

			await requester.post("/media_user/").send({ media_id: 4, user_id: 1 });

			await requester.post("/notes/").send({
				user_id: 1,
				title: "Doom is a very good movie.",
				data: "The title is a lie. Doom is not a very good movie.",
				mediaObj: {
					title: "Doom The Movie",
					type: "MOVIE",
					CID: "11"
				}
            });
            
            await requester.post("/note_tag/").send({tag_id: 1, note_id: 4}); 
            await requester.post("/note_tag/").send({tag_id: 2, note_id: 4}); 
            requester.close();

			let res = await ItemService.get(1, "11", T.MOVIE, [4]);

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		/*
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
        */
	});
});
