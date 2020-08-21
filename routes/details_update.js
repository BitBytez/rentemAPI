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
    dataDecrypt
} = require('../encryption');

const privateDB = "rentemPrivateDB";
const userCollection = "devTesting";

router.post('/update', async (req,res) => {
    var responseData = {}
    if(!req.body.email){
        responseData.message = "Email required";
        responseData.status = 200;
        return res.status(200).send(responseData);
    }
    
    if(req.body.mobile){
        const hashMobile = dataEncrypt(req.body.mobile);
        var mobileExists = await client.db(privateDB).collection(userCollection).findOne({
            mobile : hashMobile
        });
        if(mobileExists){
            
            responseData.message = "Mobile already Exists";
            responseData.status = 200;
            responseData.dev = {}
            responseData.dev.message = "mobile exists in email id given";
            responseData.dev.email = dataDecrypt(mobileExists.email);
            // TODO what if mobile exists with his email id only??
            return res.status(200).send(responseData);
        }
    }
    
    const hashDob = dataEncrypt(req.body.dob);
    const hashGender = dataEncrypt(req.body.gender);
    const hashMobile = dataEncrypt(req.body.mobile); //! reinitializing take care
    const hashEmail = dataEncrypt(req.body.email); //! reinitializing take care
    var userData = await client.db(privateDB).collection(userCollection).findOne({
        email: hashEmail
    });
    if(!userData){
        responseData.message = "No user Found";
        responseData.status = 200;
        return res.status(200).send(responseData);
    }
    userData.dob = hashDob;
    userData.gender = hashGender;
    userData.mobile = hashMobile;
    console.log(responseData);
    try{
        client.db(privateDB).collection(userCollection).updateOne({
            email: hashEmail
        }, {
            $set : userData
        });
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
