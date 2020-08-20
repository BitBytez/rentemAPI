// Imports

const router = require('express').Router(); // for routing

const {MongoClient} = require('mongodb');
const client = new MongoClient(process.env.DEV_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
client.connect();

const {dataEncrypt, DecrpytUser} = require('../encryption')
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
    if(!userDetails.email){
        return res.status(404).send({"message":"Email required", "status" : 404});
    }
    const hashEmail = dataEncrypt(userDetails.email);
    emailExists = await client.db(privateDB).collection(userCollection).findOne({
        email: hashEmail
    });
    // // TODO grab data from database and return data OR make sure userdata n database data is same
    //* Email already exists, so returning user input as output
    if(emailExists){
        console.log(emailExists);
        var userData = {}
        userData.user = DecrpytUser(emailExists);
        userData.message = "email exists";
        userData.status = 200;
        return res.status(200).send(userData);
    }

    // * Email doesn't exists
    //encrpyt data
    // TODO write all these in a for loop
    const hashId = dataEncrypt(userDetails.id);
    const hashName = dataEncrypt(userDetails.name);
    const hashPhoto = dataEncrypt(userDetails.photo); // right now, photo is assumed as string

    userData = new devUser({
        email : hashEmail,
        id : hashId,
        name : hashName,
        photo : hashPhoto
    });
    await client.db(privateDB).collection(userCollection).insertOne(userData);
    req.body.message = "email doesn't exists";
    req.body.status = 200;
    return res.status(200).send(req.body);
});

client.close();
module.exports = router;
