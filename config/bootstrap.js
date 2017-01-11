/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
 const crypto = require('crypto');
 const assert = require('assert');
module.exports.bootstrap = function(cb) {

    var saasInitialize = setup => {
        var saasUser = {
            fullName: "SAAS Admin",
            email: "donriddo@gmail.com",
            password: "saas@sp",
            role: "saas",
            address: "239 Herbert Macaulay, Yaba.",
            mobileNumber: "2348130940297"
        };

        User.create(saasUser).exec((err, saas) => {
            if (err) {
                console.log(err)
            }
            if (saas) {
                Setup.update(setup.id, {
                    saasInitialized: true
                }).exec((err, setup) => {
                    if (err) console.log(err);
                    console.log("Saas user initialized successfully");
                });

            }
        });
    };

    Setup.find().then(setup => {
        if (setup.length) {
            if (setup[0].saasInitialized === false) {
                saasInitialize(setup[0]);
            }

        } else {
            const new_alice = crypto.createDiffieHellman(128);
            new_alice.generateKeys();
            Setup.create({
                saasInitialized: true,
                privateKey: new_alice.getPrivateKey('hex'),
                publicKey: new_alice.getPublicKey('hex'),
                prime: new_alice.getPrime('hex'),
                generator: new_alice.getGenerator('hex')
            })
            .then(newSetup => {
                saasInitialize(newSetup);
            });
        }

        cb();
    })
    .catch(function(err) {
        console.log(err);
        console.log("Error checking for setup");
        // cb();
    });
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  // cb();
};
