// Imports
const router = require('express').Router(); // for routing

const {
    MongoClient
} = require('mongodb');
const client = new MongoClient(process.env.DEV_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const privateDB = "rentemPrivateDB";
const categoryCollection = "categories";

client.connect();

//! JUST A BASIC ONE.. NEED TO UPDATE A LOT

router.get('/searchBar/:data', async(req, res)=>{
    const data = req.params["data"];
    if(!data){
        return res.status(200).send({"message" : "Require a parameter"});
    }
    var responseData = {};
    
    responseData.trending = [];

    const pattern = "^" + data;
    console.log(new RegExp(pattern));
    const _relatedCategories = await client.db(privateDB).collection(categoryCollection).find({
        "name" : {$regex : new RegExp(pattern) , $options : 'i'}
    }).toArray();
    responseData.categories = _relatedCategories;
    const _relatedTrending = await client.db("rentemDB").collection("trending").find({
        "name" : {$regex : new RegExp(pattern), $options : 'i'}
    }).toArray();
    responseData.trending = _relatedTrending;
    responseData.status = 200;
    return res.status(200).send(responseData);
});
client.close();
module.exports = router;