const crypto = require('crypto');
const assert = require('assert');

console.log("\n\n ========== GetDiffieHellman KEYS ============= \n\n");

// const new_alice = crypto.getDiffieHellman('modp5');
// const new_bob = crypto.getDiffieHellman('modp5');
// const new_evelyn = crypto.getDiffieHellman('modp5');
const new_alice = crypto.createDiffieHellman(128);
//const new_bob = crypto.createDiffieHellman(128);
//const new_evelyn = crypto.createDiffieHellman(128);
// const new_alice = crypto.createECDH('secp128r1'); //secp521r1 // prime256v1
// const new_bob = crypto.createECDH('secp128r1'); //secp521r1
// const new_evelyn = crypto.createECDH('secp128r1'); //secp521r1


new_alice.generateKeys();
const newer_alice = crypto.createDiffieHellman(128);
newer_alice.setPublicKey(new_alice.getPublicKey('hex'), 'hex');
newer_alice.setPrivateKey(new_alice.getPrivateKey('hex'), 'hex');

console.log('Primes: ', new_alice.getPrime(), '|', newer_alice.getPrime());
console.log('Generators: ', new_alice.getGenerator(), '|', newer_alice.getGenerator());


const new_bob = crypto.createDiffieHellman(new_alice.getPrime(), new_alice.getGenerator());
new_bob.generateKeys();

const new_evelyn = crypto.createDiffieHellman(new_alice.getPrime(), new_alice.getGenerator());
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
console.log('\n\n');
console.log('Evelyn Public Key: ', new_evelyn.getPublicKey('hex'));
console.log('Evelyn Private Key: ', new_evelyn.getPrivateKey('hex'));
console.log('\n\n ===== Asserting Equality ==== \n\n');

console.log('Bob and Alice Secret: ', new_alice_bob_secret == new_bob_alice_secret);
console.log('Evelyn and Alice Secret: ', new_evelyn_alice_secret == new_alice_evelyn_secret);
console.log('Evelyn and Bob Secret: ', new_evelyn_alice_secret, '|', new_bob_alice_secret);
console.log('Alice Bob computed secret: ', new_alice_bob_secret);
console.log('Bob Alice computed secret: ', new_bob_alice_secret);
console.log('Evelyn Alice computed secret: ', new_evelyn_alice_secret);
console.log('Alice Evelyn computed secret: ', new_alice_evelyn_secret);

console.log('\n\n ======= Get ECDH Curve ======= \n\n');
const curves = crypto.getCurves();

// User.find().then(users => {console.log(users);}).catch(err => {console.error(err);})
