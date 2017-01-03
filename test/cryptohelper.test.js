var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    assert = chai.assert,
    hs = require('../api/services/cryptoHelper.js'),
    keys = hs.init(),
    secret = hs.createSharedSecret(keys.pubKey),
    digest = hs.createDigest(secret, 'foo'),
    payload = hs.createPayload(keys.pubKey, digest),
    obj = hs.extractPayload(payload, 128, 3),
    ct = hs.encryptData(secret, 'foo'),
    pt = hs.decryptData(secret, ct)

describe('crypto.js', function(){

  describe('init()', function(){
    it('must return valid keypair', function(done){

      keys.should.be.a('object')
      should.exist(keys.pubKey)
      should.exist(keys.privKey)
      expect(keys.pubKey).to.have.length(2048)
      expect(keys.privKey).to.have.length(2048)
      assert.match(keys.pubKey, /^[0-9a-f]{2048}$/i,
                   'public key should be hex encoded')
      assert.match(keys.privKey, /^[0-9a-f]{2048}$/i,
                   'private key should be hex encoded')

      done()
    })
  })

  describe('createSharedSecret(key)', function(){
    it('must return a shared secret', function(done){

      expect(secret).to.have.length(2048)
      assert.match(secret, /^[0-9a-f]{2048}$/i,
                   'shared secret should be hex encoded')

      done()
    })
  })

  describe('createDigest(key, obj)', function(){
    it('must return a valid digest', function(done){

      expect(digest).to.have.length(128)
      assert.match(digest, /^[0-9a-f]{128}$/i,
                   'hmac digest should be hex encoded')

      done()
    })
  })

  describe('encryptData(key, pt)', function(){
    it('must return valid cipher text', function(done){

      expect(ct).to.have.length(32)
      assert.match(ct, /^[0-9a-f]{32}$/i,
                   'cipher text should be hex encoded')

      done()
    })
  })

  describe('decryptData(key, ct)', function(){
    it('must return valid plain text', function(done){

      expect(pt).to.have.length(3)
      expect(pt).to.equal('foo')

      done()
    })
  })

  describe('createPayload(key, secret)', function(){
    it('must return valid payload', function(done){

      expect(payload).to.have.length(2176)

      done()
    })
  })

  describe('extractPayload(payload, size, count)', function(){
    it('must return valid key & digest', function(done){

      expect(obj.digest).to.equal(digest)
      expect(obj.pubKey).to.equal(keys.pubKey)

      done()
    })
  })
})
