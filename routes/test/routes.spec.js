process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../../server');



chai.use(chaiHttp);

describe('API Routes', function() {

    describe('Should post a single user Test User 1 - Posts to /users/', function() {
        it('Should return user Test User 1', function (done) {
            chai.request(server)
            .post('/users/')
            .send({
                user_name: 'Test User 1',
                user_email : 'TestUser1@email.com',
              })
            .end(function(err, res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('user_name');
            res.body.user_id.should.equal('Test User 1');
            res.body.should.have.property('user_email');
            res.body.user_name.should.equal('TestUser1@email.com');
            res.body.should.have.property('user_id');
            res.body.user_id.should.equal('3')
            done();
            });
        })
    })

    describe(' Attempts to post user without user_name', function() {
        it('Should return 406', function (done) {
            chai.request(server)
            .post('/users/')
            .send({
                user_email : 'TestUser2@email.com',
              })
            .end(function(err, res) {
            res.should.have.status(406);
            done();
            });
        })
    })

    describe(' Attempts to post user without email', function() {
        it('Should return 406', function (done) {
            chai.request(server)
            .post('/users/')
            .send({
                user_name : 'Test User 2',
              })
            .end(function(err, res) {
            res.should.have.status(406);
            done();
            });
        })
    })

    describe(' Attempts to post user without name or email', function() {
        it('Should return 406', function (done) {
            chai.request(server)
            .post('/users/')
            .send({})
            .end(function(err, res) {
            res.should.have.status(406);
            done();
            });
        })
    })

    describe('Attempts to post user with existing email', function() {
        it('Should return 409', function (done) {
            chai.request(server)
            .post('/users/')
            .send({
                user_name: 'Test User 4',
                user_email : 'TestUser1@email.com',
              })
            .end(function(err, res) {
            res.should.have.status(409);
            done();
            });
        })
    })

    describe('Attempts to post user with existing name', function() {
        it('Should return 409', function (done) {
            chai.request(server)
            .post('/users/')
            .send({
                user_name: 'Test User 1',
                user_email : 'TestUser4@email.com',
              })
            .end(function(err, res) {
            res.should.have.status(409);
            done();
            });
        })
    })

    /*
    describe('GET all users, /users/', function() {
        it('Should return every user in the test DB.', function(done) {
          chai.request(server)
          .get('/users/')
          .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('array');
          res.body.should.have.length(3);
          res.body[0].should.have.property('user_name');
          res.body[0].user_name.should.equal('Matt');
          res.body[0].should.have.property('user_email');
          res.body[0].user_email.should.equal('matt@gmail.com');
          res.body[0].should.have.property('user_id');
          res.body[0].user_id.should.equal(89);
          done();
          });
        });
      });

  
    describe('Get single user MJ, GET /users/94', function() {
        it('Should return user Mary Julia', function (done) {
            chai.request(server)
            .get('/users/94')
            .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('user_id');
            res.body.user_id.should.equal(94);
            res.body.should.have.property('user_name');
            res.body.user_name.should.equal('MJ');
            res.body.should.have.property('user_email');
            res.body.user_email.should.equal('mj@gmail.com')
            done();
            });
        })
    })
    */

});