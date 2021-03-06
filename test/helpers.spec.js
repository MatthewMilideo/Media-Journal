var chai = require("chai");
const expect = require("chai").expect;
var should = chai.should();

const helpers = require("../models/helpers");

describe("Helpers Tests", function() {
	describe("CheckArgs Tests", function() {
		it("CheckArgs returns false if no arguments are provided", function() {
			let test = helpers.checkArgs();
			expect(test).to.equal(false);
		});

		it("CheckArgs returns false if ints is not an arr", function() {
			let test = helpers.checkArgs(1, ["hello", "hello"]);
			expect(test).to.equal(false);
		});

		it("CheckArgs returns false if strings is not an arr", function() {
			let test = helpers.checkArgs([1], "hello");
			expect(test).to.equal(false);
		});

		it("CheckArgs returns false if ints has a stting in a depth 1 array", function() {
			let test = helpers.checkArgs(
				[1, 2, 3, 4, [5, 6, 7, 8], [1, 2, 3, 4, "hello"]],
				["hi", ["hello", "goodbye"]]
			);
			expect(test).to.equal(false);
		});

		it("CheckArgs returns false if ints has a stting in a depth 1 array", function() {
			let test = helpers.checkArgs(
				[1, 2, 3, 4, [5, 6, 7, 8], [1, 2, 3, 4, 2]],
				["hi", ["hello", "goodbye"], ["hello", "goodbye", 1]]
			);
			expect(test).to.equal(false);
		});

		it("CheckArgs returns true if ints and strings are empty", function() {
			let test = helpers.checkArgs([], []);
			expect(test).to.equal(true);
		});

		it("CheckArgs returns true if ints and strings are empty arrs", function() {
			let test = helpers.checkArgs([1, 2, 3, 4, [5, 6, 7, 8]], []);
			expect(test).to.equal(true);
		});

		it("CheckArgs returns true if ints and strings are both flattened arrs", function() {
			let test = helpers.checkArgs(
				[1, 2, 3, 4, [5, 6, 7, 8]],
				["hi", ["hello", "goodbye"]]
			);
			expect(test).to.equal(true);
		});
	});

	describe("CheckArgsType Tests", function() {
		it("CheckArgsType returns false if no arguments are provided", function() {
			let test = helpers.checkArgsType();
			expect(test).to.equal(false);
		});

		it("CheckArgsType returns false if ints is not an arr", function() {
			let test = helpers.checkArgsType(1, ["hello", "hello"], "MOVIE");
			expect(test).to.equal(false);
		});

		it("CheckArgsTypereturns false if strings is not an arr", function() {
			let test = helpers.checkArgsType([1], "hello", "MOVIE");
			expect(test).to.equal(false);
		});

		it("CheckArgsTypereturns false if ints has a stting in a depth 1 array", function() {
			let test = helpers.checkArgsType(
				[1, 2, 3, 4, [5, 6, 7, 8], [1, 2, 3, 4, "hello"]],
				["hi", ["hello", "goodbye"]],
				"MOVIE"
			);
			expect(test).to.equal(false);
		});

		it("CheckArgsTypereturns false if ints has a stting in a depth 1 array", function() {
			let test = helpers.checkArgsType(
				[1, 2, 3, 4, [5, 6, 7, 8], [1, 2, 3, 4, 2]],
				["hi", ["hello", "goodbye"], ["hello", "goodbye", 1]]
			);
			expect(test).to.equal(false);
		});

		it("CheckArgsType returns true if ints and strings are empty and the type is wrong ", function() {
			let test = helpers.checkArgsType([], [], 1);
			expect(test).to.equal(false);
		});

		it("CheckArgs returns true if ints and strings are empty", function() {
			let test = helpers.checkArgsType([], [], "MOVIE");
			expect(test).to.equal(true);
		});

		it("CheckArgs returns true if ints and strings are empty arrs", function() {
			let test = helpers.checkArgsType([1, 2, 3, 4, [5, 6, 7, 8]], [], "MOVIE");
			expect(test).to.equal(true);
		});

		it("CheckArgs returns true if ints and strings are both flattened arrs", function() {
			let test = helpers.checkArgs(
				[1, 2, 3, 4, [5, 6, 7, 8]],
				["hi", ["hello", "goodbye"]],
				"MOVIE"
			);
			expect(test).to.equal(true);
		});
	});

	describe("checkMediaIDUserID Tests", function() {
		it("checkMediaIDUserID returns false if no arguments are provided", function() {
			let test = helpers.checkMediaIDUserID();
			expect(test).to.equal(false);
		});

		it("checkMediaIDUserID returns false if no arguments are provided", function() {
			let test = helpers.checkMediaIDUserID([]);
			expect(test).to.equal(false);
		});

		it("checkMediaIDUserID returns false if no media id is provided", function() {
			let test = helpers.checkMediaIDUserID([{ user_id: 1 }]);
			expect(test).to.equal(false);
		});

		it("checkMediaIDUserID returns false if invalid media id is provided", function() {
			let test = helpers.checkMediaIDUserID([{ media_id: "test", user_id: 1 }]);
			expect(test).to.equal(false);
		});

		it("checkMediaIDUserID returns false if no user_id", function() {
			let test = helpers.checkMediaIDUserID([{ media_id: 1 }]);
			expect(test).to.equal(false);
		});

		it("checkMediaIDUserID returns false if invalid userid", function() {
			let test = helpers.checkMediaIDUserID([{ media_id: 1, user_id: "test" }]);
			expect(test).to.equal(false);
		});
		it("checkMediaIDUserID returns false if invalid userid", function() {
			let test = helpers.checkMediaIDUserID([{ media_id: 1, user_id: 1 }]);
			expect(test).to.equal(true);
		});

		it("checkMediaIDUserID returns false if invalid second arg", function() {
			let test = helpers.checkMediaIDUserID([
				{ media_id: 1, user_id: 1 },
				{ media_id: 1, user_id: 1 }
			]);
			expect(test).to.equal(true);
		});

		it("checkMediaIDUserID returns false if invalid second arg", function() {
			let test = helpers.checkMediaIDUserID([
				{ media_id: 1, user_id: 1 },
				{ media_id: 1, user_id: "test" }
			]);
			expect(test).to.equal(false);
		});
	});

	describe("CheckCIDType Tests", function() {
		it("CheckCIDType returns false if no arguments are provided", function() {
			let test = helpers.checkCIDType();
			expect(test).to.equal(false);
		});

		it("CheckCIDType returns false if no arguments are provided", function() {
			let test = helpers.checkCIDType([]);
			expect(test).to.equal(false);
		});

		it("CheckCIDType returns false if no CID is provided", function() {
			let test = helpers.checkCIDType([{ type: "MOVIE" }]);
			expect(test).to.equal(false);
		});

		it("CheckCIDType returns false if no type is provided", function() {
			let test = helpers.checkCIDType([{ CID: "123456" }]);
			expect(test).to.equal(false);
		});

		it("CheckCIDType returns false if invalid type", function() {
			let test = helpers.checkCIDType([{ CID: "hello", type: "TEST" }]);
			expect(test).to.equal(false);
		});

		it("CheckCIDType returns false if invalid second arg", function() {
			let test = helpers.checkCIDType([
				{ CID: "hallo", type: "MOVIE" },
				{ CID: "hallo2", type: "TEST" }
			]);
			expect(test).to.equal(false);
		});

		it("CheckCIDType returns true", function() {
			let test = helpers.checkCIDType([
				{ CID: "hallo", type: "MOVIE" },
				{ CID: "hallo2", type: "BOOK" }
			]);
			expect(test).to.equal(true);
		});
	});
});
