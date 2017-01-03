var crypto = require('crypto'),
    dh = crypto.createDiffieHellman(128); //crypto.getDiffieHellman('modp14')

crypto.DEFAULT_ENCODING = 'hex';

exports.init = function() {
  dh.generateKeys()
  return {
    pubKey: dh.getPublicKey(),
    privKey: dh.getPrivateKey()
  }
}

exports.createDigest = (key, obj) => {
  var hmac = crypto.createHmac('sha512', key)
  hmac.setEncoding('hex')
  hmac.write(obj)
  hmac.end()
  return hmac.read()
}

exports.createSharedSecret = (data) =>  dh.computeSecret(data, 'hex', 'hex');

exports.createPayload = (key, digest, count) => {
  var a = [],
      b = digest.split(''),
      iteration = count || 3,
      ret = []

  do {
    a.push(key.substring(0, iteration))
  } while((key = key.substring(iteration, key.length)) != "")

  for (var n = 0; n < a.length; n++) {
    if (b[n] && a[n]) {
        ret.push(a[n]+b[n]);
    } else if(b[n] && !a[n]) {
        ret.push(b[n]);
    } else if(!b[n] && a[n]) {
        ret.push(a[n])
    }
  }
  return ret.join('')
}

exports.extractPayload = (payload, size, count) => {
  var num = count + 1 || 4,
      regex1 = new RegExp('.{1,'+num+'}', 'g'),
      data1 = payload.match(regex1),
      regex2 = new RegExp('.{1,'+num+'}', 'g'),
      data2 = payload.match(regex2),
      digest = [],
      pubKey = [],
      i = 0

  for (var n = 0; n < size; n++) {
    digest.push(data1[n].substr(count, data1[n].length))
  }

  data2.forEach(function(item) {
    if (i < size) {
      pubKey.push(item.substr(0, item.length - 1))
    } else {
      pubKey.push(item)
    }
    i++
  })

  return {
    digest: digest.join(''),
    pubKey: pubKey.join('')
  }
}

exports.encryptData = function(key, pt, algo) {
  algo = algo || (Number(process.version.match(/^v\d+\.(\d+)/)[1]) >= 10) ?
    'aes-256-ctr' : 'aes-128-cbc'

  pt = (Buffer.isBuffer(pt)) ? pt : new Buffer(pt)

  var cipher = crypto.createCipher(algo, key),
      ct = []

  ct.push(cipher.update(pt))
  ct.push(cipher.final('hex'))

  return ct.join('')
}

exports.decryptData = function(key, ct, algo) {
  algo = algo || (Number(process.version.match(/^v\d+\.(\d+)/)[1]) >= 10) ?
    'aes-256-ctr' : 'aes-128-cbc'

  var cipher = crypto.createDecipher(algo, key),
      pt = []

  pt.push(cipher.update(ct, 'hex', 'utf8'))
  pt.push(cipher.final('utf8'))

  return pt.join('')
}
