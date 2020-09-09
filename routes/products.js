// Imports
const router = require('express').Router(); // for routing

const {
    MongoClient
} = require('mongodb');
const client = new MongoClient(process.env.DEV_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
client.connect();
const {
    dataEncrypt,
    DecryptUser,
    encryptUser,
    encryptProduct,
    decryptProduct
} = require('../encryption');
const { response } = require('express');

const mongo_db = "rentemPrivateDB";
const mongo_coll = "Products";

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.post('/saveProduct', async(req, res) => {
    var _productDetails = req.body;
    const id_length = 10;
    var _encryptedProduct = encryptProduct(_productDetails);
    const prod_id= makeid(id_length);
    _encryptedProduct.id = prod_id;
    _productDetails.id = prod_id; 
    await client.db(mongo_db).collection(mongo_coll).insertOne(_encryptedProduct);
    var responseData = {};
    responseData.product = _productDetails;
    responseData.message = "product saved";
    responseData.status = 200;
    return res.status(200).send(responseData);
});

router.post('/getProduct', async(req, res) => {
    const prod_id = req.body.id;
    const _productDetails = await client.db(mongo_db).collection(mongo_coll).findOne({
        "id" : prod_id
    });
    var responseData = {};
    if(_productDetails){
        responseData.product = decryptProduct(_productDetails);
        responseData.status = 200;
        return res.status(200).send(responseData);
    }
    return res.status(200).send({"message":"Invalid Id","status":200});
});

client.close();
module.exports = router;