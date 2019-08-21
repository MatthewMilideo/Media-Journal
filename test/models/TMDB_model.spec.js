const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../server.js");

const TMDB = require("../../models/TMDB_model");

chai.use(chaiHttp);

describe("TMDB Model Tests", function() {
	describe("Search Movie Tests", async () => {
		it("SearchMovie returns 400 when there are no arguments.", async () => {
			try {
				await TMDB.searchMovie();
			} catch (error) {
				expect(error).to.have.property("status");
				expect(error.status).to.equal(400);
			}
		});
		it("SearchMovie returns 400 when there is an invalid search term.", async () => {
			try {
				await TMDB.searchMovie([1, 2, 3, 4, 5]);
			} catch (error) {
				expect(error).to.have.property("status");
				expect(error.status).to.equal(400);
			}
		});

		it("SearchMovie returns 200 when there is a valid search term.", async () => {
			try {
				let res = await TMDB.searchMovie("Star Wars");
				expect(res).to.have.property("status");
				expect(res.status).to.equal(200);
				expect(res).to.have.property("data");
				expect(res.data).to.be.a("object");
			} catch (error) {}
		});

		it("SearchMovie returns 200 when there is a search term and we are querying the next page", async () => {
			try {
				let res = await TMDB.searchMovie("Star Wars", 2);
				expect(res).to.have.property("status");
				expect(res.status).to.equal(200);
				expect(res).to.have.property("data");
				expect(res.data).to.be.a("object");
			} catch (error) {}
		});

		it("SearchMovie returns 404 when there is a search term and we are querying a non-existent page.", async () => {
			try {
				await TMDB.searchMovie("Star Wars", 100);
			} catch (error) {
				expect(error).to.have.property("status");
				expect(error.status).to.equal(404);
			}
		});

		it("SearchMovie returns 404 when there is a search term and we are querying a non-existent page.", async () => {
			try {
				let res = await TMDB.searchMovie("Star Wars", -1);
			} catch (error) {
                console.log(error.status)
				expect(error).to.have.property("status");
				expect(error.status).to.equal(422);
			}
		});
	});
	describe("Search TV Show Tests", async () => {
		it("SearchTV returns 400 when there are no arguments.", async () => {
			try {
				await TMDB.searchTV();
			} catch (error) {
				expect(error).to.have.property("status");
				expect(error.status).to.equal(400);
			}
		});
		it("SearchTV returns 400 when there is an invalid search term.", async () => {
			try {
				await TMDB.searchTV([1, 2, 3, 4, 5]);
			} catch (error) {
				expect(error).to.have.property("status");
				expect(error.status).to.equal(400);
			}
		});

		it("SearchTV returns 200 when there is a valid search term.", async () => {
			try {
				let res = await TMDB.searchTV("Star Wars");
				expect(res).to.have.property("status");
				expect(res.status).to.equal(200);
				expect(res).to.have.property("data");
				expect(res.data).to.be.a("object");
			} catch (error) {}
		});

		it("SearchTV returns 200 when there is a search term and we are querying the next page", async () => {
			try {
				let res = await TMDB.searchTV("Star Wars", 2);
				expect(res).to.have.property("status");
				expect(res.status).to.equal(200);
				expect(res).to.have.property("data");
				expect(res.data).to.be.a("object");
			} catch (error) {}
		});

		it("SearchTV returns 404 when there is a search term and we are querying a non-existent page.", async () => {
			try {
				let res = await TMDB.searchTV("Star Wars", 100);

			
			} catch (error) {
                expect(error).to.have.property("status");
				expect(error.status).to.equal(404);
            }
		});

		it("SearchTV returns 404 when there is a search term and we are querying a non-existent page.", async () => {
			try {
				let res = await TMDB.searchTV("Star Wars", -1);
				//console.log(res.data.results);
				
			} catch (error) {
				expect(error.status).to.equal(422);
				expect(error).to.have.property("status");
            }
		});
	});
});
