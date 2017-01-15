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
            data.publicKey = newUser.getPublicKey('hex');
            data.privateKey = newUser.getPrivateKey('hex');
            data.apiKey = setup[0].publicKey;
            data.prime = setup[0].prime;
            data.generator = setup[0].generator;
            return User.create(data);
        })
        .then(createdUser => {
			if (createdUser){
                const cipher = crypto.createCipher('aes-256-ctr', data.password);
                var encrypted = cipher.update(JSON.stringify(createdUser), 'utf8', 'hex');
                encrypted += cipher.final('hex');
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
        .then(user => {
            return [user, Setup.find()];
        })
        .spread((user, setups) => {
            const setupKey = crypto.createDiffieHellman(setups[0].prime, 'hex', setups[0].generator, 'hex');
            setupKey.generateKeys();
            setupKey.setPrivateKey(setups[0].privateKey, 'hex');
            setupKey.setPublicKey(setups[0].publicKey, 'hex');
            var sharedSecret = setupKey.computeSecret(user.publicKey, 'hex', 'hex');
            console.log(sharedSecret);
            const cipher = crypto.createCipher('aes-256-ctr', sharedSecret);
            var encrypted = cipher.update(JSON.stringify(user), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return ResponseService.json(200, res, 'User retrieved successfully', encrypted);
        })
        .catch(err => {
            return ValidationService.jsonResolveError(err, User, res);
        })
    }
};
