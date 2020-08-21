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
    dataDecrypt,
    encryptUser,
    DecryptUser
} = require('../encryption');

const privateDB = "rentemPrivateDB";
const userCollection = "devTesting";

router.post('/update', async (req,res) => {
    var responseData = {}
    responseData.user = {}
    if(!req.body.email){
        responseData.message = "Email required";
        responseData.status = 200;
        return res.status(200).send(responseData);
    }
    const hashEmail = dataEncrypt(req.body.email);
    var userData = await client.db(privateDB).collection(userCollection).findOne({
        email: hashEmail
    });
    if(req.body.mobile){
        const hashMobile = dataEncrypt(req.body.mobile);
        var mobileExists = await client.db(privateDB).collection(userCollection).findOne({
            mobile : hashMobile
        });
        if(mobileExists){
            if(userData) responseData.user = DecryptUser(userData);
            responseData.message = "Mobile already Exists";
            responseData.status = 200;
            responseData.dev = {}
            responseData.dev.message = "mobile exists in email id given";
            responseData.dev.email = dataDecrypt(mobileExists.email);
            // TODO what if mobile exists with his email id only??
            return res.status(200).send(responseData);
        }
    }
    
    var tempData = encryptUser(req.body, keys = ['dob','gender','mobile']);
    
    if(!userData){
        responseData.message = "No user Found";
        responseData.status = 200;
        return res.status(200).send(responseData);
    }
    for (var x in tempData){
        userData[x] = tempData[x];
    }
    console.log(userData);
    try{
        client.db(privateDB).collection(userCollection).updateOne({
            email: hashEmail
        }, {
            $set : userData
        });
        responseData.user = DecryptUser(userData);
        responseData.message = "update successful";
        responseData.status = 200;        
        return res.status(200).send(responseData);
    }
    catch(err) {
        responseData.message = "contact dev Error 7285";
        responseData.status = 200;
        console.log(err);
        return res.status(200).send(responseData);
    }
});

client.close();
module.exports = router;
