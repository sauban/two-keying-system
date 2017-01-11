var crypto = require('crypto');
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
            data.sharedSecret = newUser.computeSecret(setup[0].publicKey, 'hex', 'hex');
            data.publicKey = newUser.getPublicKey('hex');
            data.privateKey = newUser.getPrivateKey('hex');
            console.log('Is the sharedSecret equal? ', setupKey.computeSecret(data.publicKey, 'hex', 'hex') == data.sharedSecret);
            return User.create(data);
        })
        .then(createdUser => {
			if (createdUser){
                // console.log(createdUser);
				return ResponseService.json(200, res, 'User created successfully', createdUser);
			}
		}).catch(err => {
			return ValidationService.jsonResolveError(err, User, res);
		});
	},
    verify(req, res) {
        User.findOne(req.params.id)
        .then(user => {
            return [user, Setup.find()];
        })
        .spread((user, setups) => {
            const setupKey = crypto.createDiffieHellman(setups[0].prime, 'hex', setups[0].generator, 'hex');
            setupKey.generateKeys();
            setupKey.setPrivateKey(setups[0].privateKey, 'hex');
            setupKey.setPublicKey(setups[0].publicKey, 'hex');
            console.log(setupKey.getPublicKey('hex'), ' | ', setupKey.getPrivateKey('hex'));
            console.log('Is the sharedSecret still intact? ', user.sharedSecret == setupKey.computeSecret(user.publicKey, 'hex', 'hex'));
            return ResponseService.json(200, res, 'User verified successfully', user);
        })
        .catch(err => {
            return ValidationService.jsonResolveError(err, User, res);
        })
    }
};
