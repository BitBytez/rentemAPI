// Imports
const router = require('express').Router(); // for routing

const {MongoClient} = require('mongodb');
const client = new MongoClient(process.env.DEV_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
client.connect();

const {dataEncrypt, DecryptUser, encryptUser} = require('../encryption')
const devUser = require('../models/devUser.js');

const privateDB = "rentemPrivateDB";
const userCollection = "devTesting";
/*
 * No validation right now
 * Email format checking - FALSE
 * unique ID check - FALSE
 * photo format check - FALSE
*/
router.post('/verify', async (req,res)=>{
    const userDetails = req.body.user;
    var responseData = {};
    if(!userDetails.email){
        return res.status(200).send({"message":"Email required", "status" : 200});
    }
    const hashEmail = dataEncrypt(userDetails.email);
    emailExists = await client.db(privateDB).collection(userCollection).findOne({
        email: hashEmail
    });
    // // TODO grab data from database and return data OR make sure userdata n database data is same
    //* Email already exists, so returning user input as output
    if(emailExists){
        responseData.user = DecryptUser(emailExists);
        responseData.message = "email exists";
        responseData.status = 200;
        return res.status(200).send(responseData);
    }

    // * Email doesn't exists
    //encrypt data
    var userData = {};
    userData = encryptUser(req.body.user);
    await client.db(privateDB).collection(userCollection).insertOne(userData);
    responseData.user = req.body.user;
    responseData.message = "email doesn't exists";
    responseData.status = 200;
    return res.status(200).send(responseData);
});

client.close();
module.exports = router;
