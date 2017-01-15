var crypto = require('crypto');
var promise = require('bluebird');
module.exports = {
    encrypt(data, secret) {
        const cipher = crypto.createCipher('aes-256-ctr', secret);
        var encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    },
    encryptPublic(setup, data, user) {
        const setupKey = crypto.createDiffieHellman(setup[0].prime, 'hex', setup[0].generator, 'hex');
        setupKey.generateKeys();
        setupKey.setPrivateKey(setup[0].privateKey, 'hex');
        setupKey.setPublicKey(setup[0].publicKey, 'hex');
        var sharedSecret = setupKey.computeSecret(user.publicKey, 'hex', 'hex');
        var encrypted = this.encrypt(data, sharedSecret);
        return encrypted
    },
    decrypt(setup, data, user) {
        const setupKey = crypto.createDiffieHellman(setup[0].prime, 'hex', setup[0].generator, 'hex');
        setupKey.generateKeys();
        setupKey.setPrivateKey(setup[0].privateKey, 'hex');
        setupKey.setPublicKey(setup[0].publicKey, 'hex');
        var sharedSecret = setupKey.computeSecret(user.publicKey, 'hex', 'hex');
        const decipher = crypto.createDecipher('aes-256-ctr', sharedSecret);
        try {
            var decrypted = decipher.update(data, 'hex', 'utf8');
        } catch (e) {
                return e;
        }
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
};
