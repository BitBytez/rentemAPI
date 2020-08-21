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
    var _DecryptedUser = {}
    var legalKeys = ["email","name","id","photo","dob","gender","mobile"];
    for(var key in encryptedUser){
        console.log(key +" : " +encryptedUser[key]);
        if(legalKeys.indexOf(key) == -1){
            continue;
        }
        // TODO better to use try and throw user defined error
        _DecryptedUser[key] = dataDecrypt(encryptedUser[key]);
        console.log(_DecryptedUser);
    }
    return _DecryptedUser;
}

module.exports.dataEncrypt = dataEncrypt;
module.exports.dataDecrypt = dataDecrypt;
module.exports.DecrpytUser = DecrpytUser;