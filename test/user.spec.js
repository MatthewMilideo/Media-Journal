process.env.NODE_ENV = "test";
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
var server = require("../server.js");

chai.use(chaiHttp);

describe("Route: '/users/ ", function() {
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

	describe("getAllUsers", function() {
		it("getAllUsers returns 404 when there are no users.");
		it("getAllUsers returns 200 when there are users.", function(done) {
			chai
				.request(server.app)
				.get("/users/")
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.equal(6);
					res.body[0].should.have.property("name");
					res.body[0].name.should.equal("Matthew");
					res.body[0].should.have.property("email");
					res.body[0].email.should.equal("mmilideo@gmail.com");
					res.body[2].should.have.property("name");
					res.body[2].name.should.equal("MJ");
					res.body[2].should.have.property("email");
					res.body[2].email.should.equal("MJ@gmail.com");
					done();
				});
		});
	});

	describe("getUserID", function() {
		it("getAllUsers returns 400 when the id is not provided correctly.", function(done) {
			chai
				.request(server.app)
				.get("/users/user_id")
				.query({ id: "test" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid id.");
					done();
				});
		});
		it("getAllUsers returns 404 when there are no users with that id.", function(done) {
			chai
				.request(server.app)
				.get("/users/user_id")
				.query({ id: 500 })
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("The requested user was not found.");
					done();
				});
		});
		it("getAllUsers returns 200 when there is a user.", function(done) {
			chai
				.request(server.app)
				.get("/users/user_id")
				.query({ id: 1 })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.equal(1);
					res.body[0].should.have.property("name");
					res.body[0].name.should.equal("Matthew");
					res.body[0].should.have.property("email");
					res.body[0].email.should.equal("mmilideo@gmail.com");
					done();
				});
		});
	});
	describe("getUserEmail | /users/", function() {
		it("getUserEmail returns 400 when the email is not provided correctly.", function(done) {
			chai
				.request(server.app)
				.get("/users/email")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid email.");
					done();
				});
		});
		it("getUserEmail returns 404 when the email is not found", function(done) {
			chai
				.request(server.app)
				.get("/users/email")
				.query({ email: "mmilideo@yahoo.com" })
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("The requested user was not found.");
					done();
				});
		});

		it("getUserEmail returns 200 when the email is not found", function(done) {
			chai
				.request(server.app)
				.get("/users/email")
				.query({ email: "mmilideo@gmail.com" })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.should.have.length(1);
					res.body[0].should.have.property("email");
					res.body[0].email.should.equal("mmilideo@gmail.com");
					res.body[0].should.have.property("name");
					res.body[0].name.should.equal("Matthew");
					done();
				});
		});
	});
	describe("postUser", function() {
		it("postUser returns 400 when the email and name are not provided correctly.", function(done) {
			chai
				.request(server.app)
				.post("/users/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal("You must provide a valid email and name.");
					done();
				});
		});
		it("postUser returns 409 when the email conflicts", function(done) {
			chai
				.request(server.app)
				.post("/users/")
				.send({ email: "mmilideo@gmail.com", name: "Matthew" })
				.end(function(err, res) {
					res.should.have.status(409);
					res.body.should.be.a("object");
					res.text.should.equal(
						"There was a conflict during insertion. You must provide a unique email."
					);
					done();
				});
		});

		it("postUser returns 201 when the user inserts correctly", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester
				.post("/users/")
				.send({ email: "TestEmail@email.com", name: "Test Name" });

			res.should.have.status(201);
			res.body.should.be.a("array");
			res.body.should.have.length(1);
			res.body[0].should.have.property("email");
			res.body[0].email.should.equal("TestEmail@email.com");
			res.body[0].should.have.property("name");
			res.body[0].name.should.equal("Test Name");
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(7);

			res = await requester.get("/users/user_id").query({ id: 7 });
			res.body.should.have.length(1);
			res.body[0].should.have.property("email");
			res.body[0].email.should.equal("TestEmail@email.com");
			res.body[0].should.have.property("name");
			res.body[0].name.should.equal("Test Name");
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(7);

			requester.close();
		});
	});
	describe("editUser", function() {
		it("editUser returns 400 when the id, email, and name are not provided.", function(done) {
			chai
				.request(server.app)
				.put("/users")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal(
						"You must provide a valid id, email, and name."
					);
					done();
				});
		});
		it("editUser returns 400 when the id, email, and name are not provided correctly.", function(done) {
			chai
				.request(server.app)
				.put("/users")
				.send({ id: "hello", email: "test", name: "hello" })
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal(
						"You must provide a valid id, email, and name."
					);
					done();
				});
		});
		it("editUser returns 404 when the user to be edited is not found.", function(done) {
			chai
				.request(server.app)
				.put("/users")
				.send({ id: 100, email: "test@gmail.com", name: "hello" })
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("The requested user was not found.");
					done();
				});
		});
		it("editUser returns 409 when there is a conflict with an email.", function(done) {
			chai
				.request(server.app)
				.put("/users")
				.send({ id: 1, email: "tylerb7@gaol.com", name: "hello" })
				.end(function(err, res) {
					res.should.have.status(409);
					res.body.should.be.a("object");
					res.text.should.equal(
						"There was a conflict during insertion. You must provide a unique email."
					);
					done();
				});
		});
		it("editUser returns 200 when successfully edited.", async () => {
			let requester = chai.request(server.app).keepOpen();
			let res = await requester
				.put("/users")
				.send({ id: 1, email: "mmilideodev@gmail.com", name: "Matt M" });

			res.should.have.status(200);
			res.body.should.be.a("array");
			res.body.should.have.length(1);
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(1);
			res.body[0].should.have.property("name");
			res.body[0].name.should.equal("Matt M");
			res.body[0].should.have.property("email");
			res.body[0].email.should.equal("mmilideodev@gmail.com");

			res = await requester.get("/users/user_id").query({ id: 1 });
			res.body.should.have.length(1);
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(1);
			res.body[0].should.have.property("name");
			res.body[0].name.should.equal("Matt M");
			res.body[0].should.have.property("email");
			res.body[0].email.should.equal("mmilideodev@gmail.com");
			requester.close();
		});
    });
    describe("deleteUser", function() {
		it("deleteUser returns 400 when the id is not provided.", function(done) {
			chai
				.request(server.app)
				.delete("/users/")
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal(
						"You must provide a valid id."
					);
					done();
				});
        });
        it("deleteUser returns 400 when the id is provided incorrectly.", function(done) {
			chai
				.request(server.app)
                .delete("/users/")
                .send( {id: 'hello'})
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a("object");
					res.text.should.equal(
						"You must provide a valid id."
					);
					done();
				});
        });
        it("deleteUser returns 404 when the user to be deleted is not found.", function(done) {
			chai
				.request(server.app)
				.delete("/users")
				.send({ id: 100})
				.end(function(err, res) {
					res.should.have.status(404);
					res.body.should.be.a("object");
					res.text.should.equal("The requested user was not found.");
					done();
				});
        });
        it("deleteUser returns 403 when the user to be deleted is not found.", function(done) {
			chai
				.request(server.app)
				.delete("/users/")
				.send({ id: 1})
				.end(function(err, res) {
					res.should.have.status(403);
					res.body.should.be.a("object");
					res.text.should.equal("A constraint prevented this request from being fulfilled.");
					done();
				});
        });

        it("deleteUser returns 200 when successfully deleted.", async () => {
            let requester = chai.request(server.app).keepOpen();
            
            await requester.delete('/media_user/').send({media_id: 1, user_id: 1})
            await requester.delete('/media_user/').send({media_id: 2, user_id: 1})

			let res = await requester
				.delete("/users")
				.send({ id: 1});

            res.should.have.status(403);
            res.body.should.be.a("object");
            res.text.should.equal("A constraint prevented this request from being fulfilled.");

            await requester.delete('/note_tag/').send({note_id: 1, user_id: 1})
            await requester.delete('/note_tag/').send({note_id: 1, user_id: 2})
            await requester.delete('/media_note/').send({note_id: 1, media_id: 1})
            await requester.delete('/media_note/').send({note_id: 1, media_id: 2})

            res = await requester
            .delete("/users")
            .send({ id: 1});
            res.should.have.status(200);
            

			res.body.should.be.a("array");
			res.body.should.have.length(1);
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(1);
			res.body[0].should.have.property("name");
			res.body[0].name.should.equal("Matt M");
			res.body[0].should.have.property("email");
			res.body[0].email.should.equal("mmilideodev@gmail.com");

			res = await requester.get("/users/user_id").query({ id: 1 });
            res.body.should.have.status(404)
            
            res = await requester.get("/users/");
            res.body.should.have.status(200);
            res.body.should.be.a("array");
			res.body.should.have.length(6);
			res.body[0].should.have.property("id");
			res.body[0].id.should.equal(2);
			res.body[0].should.have.property("name");
			res.body[0].name.should.equal("Tyler");
			res.body[0].should.have.property("email");
			res.body[0].email.should.equal("tylerb7@gaol.com");
			requester.close();
		});
    }); 
});
