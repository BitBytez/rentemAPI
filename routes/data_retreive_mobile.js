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
    DecrpytUser
} = require('../encryption');

const privateDB = "rentemPrivateDB";
const userCollection = "devTesting";

router.post('/mobile', async (req,res)=>{
    const mobile = req.body.mobile;
    // TODO country code check (what if input is +9178213192198)
    if(!mobile){
        return res.status(404).send({"message":"Mobile required"});
    }
    const hashMobile = dataEncrypt(mobile);
    mobileExists = await client.db(privateDB).collection(userCollection).findOne({
        mobile : hashMobile
    }); 
    var userData = {};
    if (mobileExists){
        userData.user = DecrpytUser(mobileExists);
        userData.message = "mobile Exists";
        userData.status = 200;
        return res.status(200).send(userData);
    }

    userData.message = "mobile Doesn't Exists";
    userData.status = 404;
    return res.status(404).send(userData);
});

client.close();
module.exports = router;
