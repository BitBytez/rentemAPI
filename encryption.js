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

const DecryptUser = (encryptedUser) => {
    var _DecryptedUser = {}
    var legalKeys = ["email","name","id","photo","dob","gender","mobile"];
    for(var key in encryptedUser){
        if(legalKeys.indexOf(key) == -1){
            continue;
        }
        // TODO better to use try and throw user defined error
        _DecryptedUser[key] = dataDecrypt(encryptedUser[key]);
    }
    return _DecryptedUser;
}

// @params
// keys -> only specific keys to encrypt 
const encryptUser = (simpleuser, keys) => {
    var _encryptedUser = {};
    var legalKeys = ["email", "name", "id", "photo", "dob", "gender", "mobile"];
    if(!keys){
        keys = legalKeys;
    }
    for (var key in simpleuser){
        if(legalKeys.indexOf(key) == -1){
            continue;
        }
        if(keys.indexOf(key) !== -1){
            _encryptedUser[key] = dataEncrypt(simpleuser[key]);
        }
    }
    return _encryptedUser;
}

module.exports.dataEncrypt = dataEncrypt;
module.exports.dataDecrypt = dataDecrypt;
module.exports.DecryptUser = DecryptUser;
module.exports.encryptUser = encryptUser;