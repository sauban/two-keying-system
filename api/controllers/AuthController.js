/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
// import crypto from 'crypto';
const crypto = require('crypto');
const assert = require('assert');

module.exports = {
	generateKeys: (req, res) => {

    const prime_length = 128;
    const diffHell = crypto.createDiffieHellman(prime_length);

    diffHell.generateKeys('hex');
    console.log("Public Key : " ,diffHell.getPublicKey('base64'));
    console.log("Private Key : " ,diffHell.getPrivateKey('base64'));
    console.log("\n\n");
    console.log("Public Key : " ,diffHell.getPublicKey('hex'));
    console.log("Private Key : " ,diffHell.getPrivateKey('hex'));

    console.log("\n\n ========== EDH KEYS ============= \n\n");

    const alice = crypto.createECDH('prime256v1'); //secp521r1
    const alice_key = alice.generateKeys('hex');

    // Generate Bob's keys...
    const bob = crypto.createECDH('prime256v1'); //prime256v1
    const bob_key = bob.generateKeys('hex');

    // Exchange and generate the secret...
    const alice_secret = alice.computeSecret(bob_key, 'hex', 'hex');
    const bob_secret = bob.computeSecret(alice_key, 'hex', 'hex');

    console.log("Alice Key: ", alice_key);
    console.log('Bob Key: ', bob_key);
    console.log('\n\n');
    console.log('Alice Secret: ', alice_secret);
    console.log('Bob Secret: ', bob_secret);


    console.log("\n\n ========== GetDiffieHellman KEYS ============= \n\n");

    // const new_alice = crypto.getDiffieHellman('modp5');
    // const new_bob = crypto.getDiffieHellman('modp5');
    // const new_evelyn = crypto.getDiffieHellman('modp5');
    const new_alice = crypto.createDiffieHellman(128);
    const new_bob = crypto.createDiffieHellman(128);
    const new_evelyn = crypto.createDiffieHellman(128);
    // const new_alice = crypto.createECDH('secp128r1'); //secp521r1 // prime256v1
    // const new_bob = crypto.createECDH('secp128r1'); //secp521r1
    // const new_evelyn = crypto.createECDH('secp128r1'); //secp521r1


    new_alice.generateKeys();
    new_bob.generateKeys();
    new_evelyn.generateKeys();

    const new_alice_bob_secret = new_alice.computeSecret(new_bob.getPublicKey(), null, 'hex');
    const new_bob_alice_secret = new_bob.computeSecret(new_alice.getPublicKey(), null, 'hex');
    const new_evelyn_alice_secret = new_evelyn.computeSecret(new_alice.getPublicKey(), null, 'hex');
    const new_alice_evelyn_secret = new_alice.computeSecret(new_evelyn.getPublicKey(), null, 'hex');


    console.log("Alice Public Key: ", new_alice.getPublicKey('hex'));
    console.log('Alice Private Key: ', new_alice.getPrivateKey('hex'));
    console.log('\n\n');
    console.log('Bob Public Key: ', new_bob.getPublicKey('hex'));
    console.log('Bob Private Key: ', new_bob.getPrivateKey('hex'));
    console.log('\n\n ===== Asserting Equality ==== \n\n');

    console.log('Bob and Alice Secret: ', new_alice_bob_secret == new_bob_alice_secret);
    console.log('Evelyn and Alice Secret: ', new_evelyn_alice_secret == new_alice_evelyn_secret);
    console.log('Alice Bob computed secret: ', new_alice_bob_secret);
    console.log('Bob Alice computed secret: ', new_bob_alice_secret);
    console.log('Evelyn Alice computed secret: ', new_evelyn_alice_secret);
    console.log('Alice Evelyn computed secret: ', new_alice_evelyn_secret);

    console.log('\n\n ======= Get ECDH Curve ======= \n\n');
    const curves = crypto.getCurves();
    // console.log(curves);
	},

  create: (req, res) => {
    let data = req.body;
    const dh = crypto.createDiffieHellman(128);
    const createDigest = (key, payload) => crypto.createHmac('sha512', key).update(payload).digest('hex');

    dh.generateKeys();
    data.public_test_key = 'pk_test_' + dh.getPublicKey('hex');
    data.private_test_key = 'sk_test_' + dh.getPrivateKey('hex');
    User.create(data).then((created) => {

      let accessKey = createDigest(data.public_test_key, ''+created.id);
      return User.update({id: created.id}, {accessKey: accessKey});

    })
    .then((updated) => res.json(updated[0]))
    .catch((err) => console.log(err));
  }
};
