const crypto = require('crypto');
// const assert = require('assert');
//
// console.log("\n\n ========== GetDiffieHellman KEYS ============= \n\n");
//
// // const new_alice = crypto.getDiffieHellman('modp5');
// // const new_bob = crypto.getDiffieHellman('modp5');
// // const new_evelyn = crypto.getDiffieHellman('modp5');
// const new_alice = crypto.createDiffieHellman(128);
// //const new_bob = crypto.createDiffieHellman(128);
// //const new_evelyn = crypto.createDiffieHellman(128);
// // const new_alice = crypto.createECDH('secp128r1'); //secp521r1 // prime256v1
// // const new_bob = crypto.createECDH('secp128r1'); //secp521r1
// // const new_evelyn = crypto.createECDH('secp128r1'); //secp521r1
//
//
// new_alice.generateKeys();
// const newer_alice = crypto.createDiffieHellman(128);
// newer_alice.setPublicKey(new_alice.getPublicKey('hex'), 'hex');
// newer_alice.setPrivateKey(new_alice.getPrivateKey('hex'), 'hex');
//
// console.log('Primes: ', new_alice.getPrime(), '|', newer_alice.getPrime());
// console.log('Generators: ', new_alice.getGenerator(), '|', newer_alice.getGenerator());
//
//
// const new_bob = crypto.createDiffieHellman(new_alice.getPrime(), new_alice.getGenerator());
// new_bob.generateKeys();
//
// const new_evelyn = crypto.createDiffieHellman(new_alice.getPrime(), new_alice.getGenerator());
// new_evelyn.generateKeys();
//
// const new_alice_bob_secret = new_alice.computeSecret(new_bob.getPublicKey(), null, 'hex');
// const new_bob_alice_secret = new_bob.computeSecret(new_alice.getPublicKey(), null, 'hex');
// const new_evelyn_alice_secret = new_evelyn.computeSecret(new_alice.getPublicKey(), null, 'hex');
// const new_alice_evelyn_secret = new_alice.computeSecret(new_evelyn.getPublicKey(), null, 'hex');
//
//
// console.log("Alice Public Key: ", new_alice.getPublicKey('hex'));
// console.log('Alice Private Key: ', new_alice.getPrivateKey('hex'));
// console.log('\n\n');
// console.log('Bob Public Key: ', new_bob.getPublicKey('hex'));
// console.log('Bob Private Key: ', new_bob.getPrivateKey('hex'));
// console.log('\n\n');
// console.log('Evelyn Public Key: ', new_evelyn.getPublicKey('hex'));
// console.log('Evelyn Private Key: ', new_evelyn.getPrivateKey('hex'));
// console.log('\n\n ===== Asserting Equality ==== \n\n');
//
// console.log('Bob and Alice Secret: ', new_alice_bob_secret == new_bob_alice_secret);
// console.log('Evelyn and Alice Secret: ', new_evelyn_alice_secret == new_alice_evelyn_secret);
// console.log('Evelyn and Bob Secret: ', new_evelyn_alice_secret, '|', new_bob_alice_secret);
// console.log('Alice Bob computed secret: ', new_alice_bob_secret);
// console.log('Bob Alice computed secret: ', new_bob_alice_secret);
// console.log('Evelyn Alice computed secret: ', new_evelyn_alice_secret);
// console.log('Alice Evelyn computed secret: ', new_alice_evelyn_secret);
//
// console.log('\n\n ======= Get ECDH Curve ======= \n\n');
// const curves = crypto.getCurves();
//
// // User.find().then(users => {console.log(users);}).catch(err => {console.error(err);})
//
//
const cipher = crypto.createCipher('aes-256-ctr', 'donriddo');
var encrypted = cipher.update(JSON.stringify({a:1,b:2}), 'utf8', 'hex');
encrypted += cipher.final('hex');
// console.log(encrypted);
var encrypted = "66f4b9a3c78192e434b1fe86b8";
// console.log('donriddo' );
var encrypted = "4a22427f65a75593ecce3723ff5f0058d416e0cc6a6e5069ddc33b4dddd54931255b4a0ca4c95f161ba16b2cd19183a70699d0ce89cfb547adc5fb17260ff568dc5444276edafd0d6aaad77e047c85eb130400bb832fddd5bc5493e550e30ba8849b3ee975258a356837b316714b17c7ba53d78e9cf21e41c836fcb7a58bc1afcf9d4c15447cc220267142339cbd8e15d9d5bf2bce638a7589595cfc3afe1e351685d9cae8cefec2b88c378837de2beb0d4c5cac2d5378ad6a80429296b9e7cea4114e04e76c229357e9a869fd97a2648d8f65cef6cdcbe5c471d64b4b3cce3be2fe4976febe61159acd60c92074b125740decad5889c1fef2dfc2dea692ac5ab8ae5fb8f89852a65270430461ee85ea3b6512209b099f1420954c99188ce5767e4c812a81bfff977587caffcdd4a77c2a0171b27d7553881f527adaa07c279065ecfaf9f8c9a7fb8c2c7c5db36610c3acdad1a2ee501faaa32fe8fb0c2b";

const userKey = crypto.createDiffieHellman('c75df0940355772603db92f8ec9d1923', 'hex', '02', 'hex');
userKey.generateKeys();
userKey.setPrivateKey('6758d461785b3cd6c1b9491041411d5d', 'hex');
userKey.setPublicKey('8ec50901c68d56ae65947e7171f9f01d', 'hex');
var sharedSecret = userKey.computeSecret('3a124799b49d56cea6299d92f5e51978', 'hex', 'hex');

var bobCypher = crypto.createDecipher('aes-256-ctr', '490d4e0569638e20de03abfa9b6f1d3e');

// console.log(bobCypher);

var plainText = bobCypher.update(encrypted, 'hex', 'utf8');
plainText += bobCypher.final('utf8');
console.log(plainText); // => "I love you"
