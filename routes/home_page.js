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

db_name = "FrontLine"


router.get('/getHome', async(req, res) => {
    var responseData = {}
    responseData.ads = []
    const ads = await client.db(db_name).collection('ads').find({},{projection : {_id:0}}).toArray();
    // console.log(ads);
    if(ads){
        responseData.ads = ads;
    }
    const trend_buy = await client.db(db_name).collection('trend_buy').find({},{projection : {_id:0}}).toArray();
    if(trend_buy){
        responseData.trend_buy = trend_buy;
    }
    const trend_rent = await client.db(db_name).collection('trend_rent').find({}, {projection: {_id: 0}}).toArray();
    if(trend_rent){
        responseData.trend_rent = trend_rent;
    }
    console.log(responseData);
    return res.status(200).send(responseData);
});

client.close();
module.exports = router;