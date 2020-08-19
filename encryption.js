const crypto = require('crypto');
const dataEncrypt = (data) => {
    const enCipher = crypto.createCipher('aes-128-cbc', 'mypassword');
    var hashData = enCipher.update(data, 'utf8', 'hex');
    hashData += enCipher.final('hex');
    return hashData;
}

const dataDecrypt = (data) => {
    const deCipher = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var hashData = deCipher.update(data, 'hex', 'utf8');
    hashData += deCipher.final('utf8');
    return hashData;
}

module.exports.dataEncrypt = dataEncrypt;
module.exports.dataDecrypt = dataDecrypt;
