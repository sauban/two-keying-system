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



const userKey = crypto.createDiffieHellman('c75df0940355772603db92f8ec9d1923', 'hex', '02', 'hex');
userKey.generateKeys();
userKey.setPrivateKey('6f69b243c259a1aa3843063b05be12ba', 'hex');
userKey.setPublicKey('b40021be0706735127fc5b1e525aa5ec', 'hex');
var sharedSecret = userKey.computeSecret('3a124799b49d56cea6299d92f5e51978', 'hex', 'hex');
console.log(sharedSecret);

const cipher = crypto.createCipher('aes-256-ctr', sharedSecret);
var encrypted = cipher.update(JSON.stringify({last_name:"Lawal",first_name:"Sauban", role: 1}), 'utf8', 'hex');
encrypted += cipher.final('hex');
// console.log(encrypted);

var bobCypher = crypto.createDecipher('aes-256-ctr', sharedSecret);

// console.log(bobCypher);
var encrypted = "a4de45376cfca42188496365c4e80c96621d8cbbc6feb8270038c77ee07facebf5344c868f115c6f3170246176a5ec910397e5f8ca7f7e528acf81589df5a2940f015e2c649e94c3975408441fad86fa6d2f783c3e617a6420ec87925cbef9ffbe4af41761c275dee43a5ac70a522e4b9c70cfeeb8188c036c95b87a98f185bea67229a68c0ac46118b7ca548f837e35869974d6e1ca3c2f827478cae624ebaf4866c9ec465293c6a01b839837895b349402816733547f11b24c0a47224a5812a4f76410036924c9b4b42296ab1bc960714eac6e96a795815b3b1e916418f507d46352e12dc237ddf0a179fa4384528a35bc89924f31eacd95860c066cbe12735d689da3c86cdece0a7cac4b801e0ac7c334a778b45515144a3dbd973d4a6e19d2da41d761f97fc8c076088ea69985ee0b11f6b1b6f5f3df79edb46cb6f13ce227bce99795106bf1d94de0a0b3effd55f942442ed85463d58e79db8d801a89017ce170a7647a02";

var plainText = bobCypher.update(encrypted, 'hex', 'utf8');
plainText += bobCypher.final('utf8');
console.log(plainText); // => "I love you"
