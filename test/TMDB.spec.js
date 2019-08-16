process.env.NODE_ENV = "test";

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../server.js");

chai.use(chaiHttp);

describe("Route: '/test/ ", function() {

	/* ~~~~~~~~~~~~~~~~~~~~~~~ GET ALL TAGS TESTS ~~~~~~~~~~~~~~~~~~~~~~~ */

	describe("searchPage | /test/", function() {
		it("searchPagereturns 404 when no tags are found", async() => {
            let requester = chai.request(server.app).keepOpen();
            let res = await requester.get('/test/').query({term: 'Star Wars'}); 
            //console.log(res);
			requester.close();
		});
	});

}); 
	