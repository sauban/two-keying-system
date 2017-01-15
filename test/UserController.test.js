var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    assert = chai.assert,
    chaiHTTP = require('chai-http')
    crypto = require('crypto');

chai.use(chaiHTTP);
var payload = {email: "donriddo@gmail.com", password: "donriddo"}, setup = {}, encryptedPayload = {};
describe('Setup', () => {
    it('should return 200, Setup retrieved successfully', (done) => {
        Setup.find()
        .then(foundSetup => {
            setup = foundSetup;
            done();
        })
        .catch(err => {
            done(err);
        });
    });
});

describe('UserController', () => {
    describe('#create', () => {
        it('should return 400, Body cannot be empty', (done) => {
            chai.request(sails.hooks.http.app)
            .post('/user')
            .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('response');
                expect(res.body.response).to.have.property('message');
                expect(res.body.response.message).to.equal('Validation error has occured');
                expect(res.body.response).to.have.property('errors');
                done();
            });
        });

        it('should return 400, Password is required', (done) => {
            chai.request(sails.hooks.http.app)
            .post('/user')
            .send({email: "donriddo@gmail.com"})
            .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('response');
                expect(res.body.response).to.have.property('message');
                expect(res.body.response.message).to.equal('Validation error has occured');
                expect(res.body.response).to.have.property('errors');
                expect(res.body.response.errors).to.have.property('password');
                done();
            });
        });

        it('should return 400, password is too short', (done) => {
            chai.request(sails.hooks.http.app)
            .post('/user')
            .send({email: "donriddo@gmail.com", password: "rtyu"})
            .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('response');
                expect(res.body.response).to.have.property('message');
                expect(res.body.response.message).to.equal('Validation error has occured');
                expect(res.body.response).to.have.property('errors');
                expect(res.body.response.errors).to.have.property('password');
                expect(res.body.response.errors.password[0]).to.have.property('rule');
                expect(res.body.response.errors.password[0]).to.have.property('message');
                expect(res.body.response.errors.password[0].rule).to.equal('minLength');
                expect(res.body.response.errors.password[0].message).to.equal('Password is too short. Minimum length is 6');
                done();
            });
        });

        it('should return 200, User created successfully and keys generated', (done) => {
            chai.request(sails.hooks.http.app)
            .post('/user')
            .send(payload)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('User created successfully and keys generated');
                expect(res.body).to.have.property('body');
                var decipher = crypto.createDecipher('aes-256-ctr', payload.password);
                var decrypted = decipher.update(res.body.body, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                payload = JSON.parse(decrypted);
                expect(JSON.parse(decrypted)).to.have.property('email');
                expect(JSON.parse(decrypted).email).to.equal('donriddo@gmail.com');
                done();
            });
        });
    });

    describe('#read', () => {
        it('should return 404, User not found', (done) => {
            chai.request(sails.hooks.http.app)
            .get('/user/3')
            .end(function(err, res) {
                expect(res).to.have.status(404);
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('response');
                expect(res.body.response).to.have.property('message');
                expect(res.body.response.message).to.equal('User not found');
                done();
            });
        });

        it('should return 200, User retrieved successfully', (done) => {
            chai.request(sails.hooks.http.app)
            .get('/user/2')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('response');
                expect(res.body.response).to.have.property('message');
                expect(res.body.response.message).to.equal('User retrieved successfully');
                expect(res.body.response).to.have.property('data');
                encryptedPayload.data = EncryptionService.encryptPublic(setup, {fullName: "Ridwan Taiwo"}, payload);
                decrypted = EncryptionService.decrypt(setup, res.body.response.data, payload);
                expect(decrypted).to.have.property('email');
                expect(decrypted.email).to.equal('donriddo@gmail.com');
                done();
            });
        });
    });

    describe('#update', () => {
        it('should return 404, User not found', (done) => {
            chai.request(sails.hooks.http.app)
            .put('/user/3')
            .send(encryptedPayload)
            .end(function(err, res) {
                expect(res).to.have.status(404);
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('response');
                expect(res.body.response).to.have.property('message');
                expect(res.body.response.message).to.equal('User not found');
                done();
            });
        });

        it('should return 200, User updated successfully', (done) => {
            chai.request(sails.hooks.http.app)
            .put('/user/2')
            .send(encryptedPayload)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res).to.have.property('body');
                expect(res.body).to.have.property('response');
                expect(res.body.response).to.have.property('message');
                expect(res.body.response.message).to.equal('User updated successfully');
                expect(res.body.response).to.have.property('data');
                decrypted = EncryptionService.decrypt(setup, res.body.response.data, payload);
                expect(decrypted).to.have.property('email');
                expect(decrypted.email).to.equal('donriddo@gmail.com');
                done();
            });
        });
    });
});
