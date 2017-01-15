var crypto = require('crypto');
var promise = require('bluebird');
module.exports = {
    create(req, res) {
		var data = req.body;
        Setup.find().then(setup => {
            var setupKey = crypto.createDiffieHellman(setup[0].prime, 'hex', setup[0].generator, 'hex');
            setupKey.generateKeys();
            setupKey.setPrivateKey(setup[0].privateKey, 'hex');
            setupKey.setPublicKey(setup[0].publicKey, 'hex');
            const newUser = crypto.createDiffieHellman(setupKey.getPrime(), setupKey.getGenerator());
            newUser.generateKeys();
            data.publicKey = newUser.getPublicKey('hex');
            data.privateKey = newUser.getPrivateKey('hex');
            data.apiKey = setup[0].publicKey;
            data.prime = setup[0].prime;
            data.generator = setup[0].generator;
            console.log(data);
            return User.create(data);
        })
        .then(createdUser => {
			if (createdUser){
                var encrypted = EncryptionService.encrypt(createdUser, data.password);
                var body = {
                    message: "User created successfully and keys generated",
                    body: encrypted
                };
                return res.status(200).json(body);
			}
		}).catch(err => {
			return ValidationService.jsonResolveError(err, User, res);
		});
	},

    read(req, res) {
        User.findOne(req.params.id)
        .then(user => {;
            return [Setup.find(), user];
        })
        .spread((setup, user) => {
            return ResponseService.json(200, res, 'User retrieved successfully', EncryptionService.encryptPublic(setup, user, user));
        })
        .catch(err => {
            return ValidationService.jsonResolveError(err, User, res);
        });
    },

    update(req, res) {
        var encryptedData = req.body.data;
        User.findOne(req.params.id)
        .then(user => {
            return [Setup.find(), user];
        })
        .spread((setup, user) => {
            var decrypted = JSON.parse(EncryptionService.decrypt(setup, encryptedData, user));
            return [setup, User.update({id: req.params.id}, decrypted)];
        })
        .spread((setup, updatedUser) => {
            return ResponseService.json(200, res, 'User updated successfully', EncryptionService.encryptPublic(setup, updatedUser[0], updatedUser[0]));
        })
        .catch(err => {
            return ValidationService.jsonResolveError(err, User, res);
        });
    }
};
