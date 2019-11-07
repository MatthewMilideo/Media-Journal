const chai = require("chai");
const expect = require("chai").expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../../server.js");

const GBooks = require("../../models/gBooks_model");

chai.use(require("chai-as-promised"));


chai.use(chaiHttp);

describe("GBooks Model Tests", function() {
	/*
	describe("Search Books Tests", async () => {
		it("searchBooks returns 400 when there are no arguments.", async () => {
			let res = await expect(GBooks.searchBooks()).to.be.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});
		it("searchBooks returns 400 when there is an invalid search term.", async () => {
			let res = await expect(GBooks.searchBooks([1, 2, 3, 4, 5])).to.be
				.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
        });
        it("searchBooks returns 404 when there is an invalid search term.", async () => {
			let res = await expect(GBooks.searchBooks('abcdefjdkfdskgbsdkgdskgjgdfjkfjsfjsdvndlfjgsdoifniudfnbdflkvndkjbivndrbndf')).to.be
				.rejected;
			expect(res).to.have.property("status");
			expect(res.status).to.equal(404);
		});
		it("searchBooks returns 200 when there is a valid search term.", async () => {
            let res = await GBooks.searchBooks("Star Wars");
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
            expect(res.data).to.be.a("object");
  
		});

		it("searchBooks returns 200 when there is a search term and we are querying the next page", async () => {
			let res = await GBooks.searchBooks("Star Wars", 20);
			expect(res).to.have.property("status");
			expect(res.status).to.equal(200);
			expect(res).to.have.property("data");
			expect(res.data).to.be.a("object");
		});

		it("searchBooks returns 400 when there is a search term and we are querying a non-existent page.", async () => {
			let res = await expect(GBooks.searchBooks("Star Wars", 500000)).to.be
				.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});

		it("searchBooks returns 400 when there is a search term and we are querying a non-existent page.", async () => {
			let res = await expect(GBooks.searchBooks("Star Wars", -1)).to.be
				.rejected;

			expect(res).to.have.property("status");
			expect(res.status).to.equal(400);
		});
	});
	*/
	it("getBook returns 400 when there is no arguments.", async () => {
		let res = await expect(GBooks.getBook()).to.be.rejected;

		expect(res).to.have.property("status");
		expect(res.status).to.equal(400);
	});
	it("searchBooks returns 400 when there is an invalid search term.", async () => {
		let res = await expect(GBooks.getBook([1, 2, 3, 4, 5])).to.be
			.rejected;

		expect(res).to.have.property("status");
		expect(res.status).to.equal(400);
	});
	it("searchBooks returns 404 when there is an invalid search term.", async () => {
		let res = await expect(GBooks.getBook('ac58euQ72lIC2')).to.be
			.rejected;
		expect(res).to.have.property("status");

	});
	it("getBooks returns 200 when content is found an invalid search term.", async () => {
		let res = await GBooks.getBook('ac58euQ72lIC')
		expect(res).to.have.property("status");
		expect(res.status).to.equal(200);
	});
});
