process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../../server');



chai.use(chaiHttp);

describe('API Routes', function() {

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

    describe('Should put a single user Joe, Post /users/', function() {
        it('Should return user Mary Julia', function (done) {
            chai.request(server)
            .post('/users/')
            .send({
                user_name: 'Joe',
                user_email : 'joe@gmail.com'
              })
            .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('user_name');
            res.body.user_id.should.equal('Joe');
            res.body.should.have.property('user_email');
            res.body.user_name.should.equal('joe@gmail.com');
            res.body.should.have.property('user_id');
            res.body.user_email.should.equal('96')
            done();
            });
        })
    })

});