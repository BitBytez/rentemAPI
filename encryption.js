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

const DecrpytUser = (encryptedUser) => {
    var DecryptedUser = {}
    if (encryptedUser.email) {
        DecryptedUser.email = dataDecrypt(encryptedUser.email);
    }
    if (encryptedUser.name) {
        DecryptedUser.name = dataDecrypt(encryptedUser.name);
    }
    if (encryptedUser.id) {
        DecryptedUser.id = dataDecrypt(encryptedUser.id);
    }
    if (encryptedUser.photo) {
        DecryptedUser.photo = dataDecrypt(encryptedUser.photo);
    }
    if (encryptedUser.dob) {
        DecryptedUser.dob = dataDecrypt(encryptedUser.dob);
    }
    if (encryptedUser.gender) {
        DecryptedUser.gender = dataDecrypt(encryptedUser.gender);
    }
    if (encryptedUser.mobile) {
        DecryptedUser.mobile = dataDecrypt(encryptedUser.mobile);
    }
    return DecryptedUser;
}

module.exports.dataEncrypt = dataEncrypt;
module.exports.dataDecrypt = dataDecrypt;
module.exports.DecrpytUser = DecrpytUser;