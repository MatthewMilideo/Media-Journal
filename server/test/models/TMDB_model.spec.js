const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../server.js");
chai.use(require("chai-as-promised"));

const TMDB = require("../../models/TMDB_model");
const T = require("../../types")
chai.use(chaiHttp);

describe("TMDB Model Tests", function() {
	
	describe("Search Movie Tests", async () => {
		it("SearchMovie returns 400 when there are no arguments.", async () => {
			let res = await expect(TMDB.searchMovie()).to.be.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});
		it("SearchMovie returns 400 when there is an invalid search term.", async () => {
			let res = await expect(TMDB.searchMovie([1, 2, 3, 4, 5])).to.be.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("SearchMovie returns 200 when there is a valid search term.", async () => {
			let res = await TMDB.searchMovie("Star Wars");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");
		});

		it("SearchMovie returns 200 when there is a search term and we are querying the next page", async () => {
			let res = await TMDB.searchMovie("Star Wars", 2);
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");
		});

		it("SearchMovie returns 404 when there is a search term and we are querying a non-existent page.", async () => {
			let res = await expect(TMDB.searchMovie("Star Wars", 100)).to.be.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it("SearchMovie returns 404 when there is a search term and we are querying a non-existent page.", async () => {
			let res = await expect(TMDB.searchMovie("Star Wars", -1)).to.be.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});
	});
	describe("Search TV Show Tests", async () => {
		it("SearchTV returns 400 when there are no arguments.", async () => {
			let res = await expect(TMDB.searchTV()).to.be.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});
		it("SearchTV returns 400 when there is an invalid search term.", async () => {
			let res = await expect(TMDB.searchTV([1, 2, 3, 4, 5])).to.be.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("SearchTV returns 200 when there is a valid search term.", async () => {
			let res = await TMDB.searchTV("Star Wars");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");
		});

		it("SearchTV returns 200 when there is a search term and we are querying the next page", async () => {
			let res = await TMDB.searchTV("h", 2);
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");
		});

		it("SearchTV returns 404 when there is a search term and we are querying a non-existent page.", async () => {
			let res = await expect(TMDB.searchTV("Star Wars", 100)).to.be.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it("SearchTV returns 404 when there is a search term and we are querying a non-existent page.", async () => {
			let res = await expect(TMDB.searchTV("Star Wars", -1)).to.be.rejected;


			expect(res.status).to.equal(400);
			expect(res).to.have.property("status");
		
		});
	});
	

	describe("Get Item Tests", async () => {
		it("Get Item returns 400 when there are no arguments.", async () => {
			let res = await expect(TMDB.getItem()).to.be.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});
		it("Get Item returns 400 when there is an invalid search term.", async () => {
			let res = await expect(TMDB.getItem([1, 2, 3, 4, 5], 'hello')).to.be.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});
		it("Get Item returns 404 when the item is not found", async () => {
			let res = await expect(TMDB.getItem(-11, T.MOVIE)).to.be.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});

		it("Get Item returns 200 when there is an valid search term.", async () => {
			let res = await TMDB.getItem(11, T.TV);
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			
		});

		it("Get Item returns 200 when there is an valid search term.", async () => {
			let res = await TMDB.getItem(11, T.MOVIE);
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.have.property('title')
			expect(res.data.title).to.equal('Star Wars')
		});

	}); 
});
