// Imports
const router = require('express').Router(); // for routing

const {
    MongoClient
} = require('mongodb');
const client = new MongoClient(process.env.DEV_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
ads_db_name = 'FrontLine';
categories_db = 'rentemPrivateDB';
trending_db = 'Trending';
client.connect();
router.get('/rent', async (req, res) => {
    var responseData = {};
    const ads = await client.db(ads_db_name).collection('ads').find({}, {
        projection: {
            _id: 0
        }
    }).toArray();
    if (ads) {
        responseData.ads = ads;
    }
    const categories = await client.db(categories_db).collection('categories').find({}, {
        projection: {
            _id: 0
        }
    }).toArray();
    if (categories) {
        responseData.categories = categories;
    }
    const trending = await client.db(trending_db).collection('trend_rent').find({}, {
        projection: {
            _id: 0
        }
    }).toArray();
    if (trending) {
        responseData.trend_buy = trending;
    }
    return res.status(200).send(responseData);
});

client.close();
module.exports = router;