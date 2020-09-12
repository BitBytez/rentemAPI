const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const app = express();
const port = 3000
dotenv.config();


//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//route middlewares
app.use(logger('dev'));

//routes
const mailChecker = require('./routes/mail_checker');
const dataRetrieveMobile = require('./routes/data_retreive_mobile');
const updateDetails = require('./routes/details_update');
const productAccess = require('./routes/products');
const homePage = require('./routes/home_page');
const buyPage = require('./routes/buy_page');
const rentPage = require('./routes/rent_page');
app.use('/test',mailChecker);
app.use('/test',dataRetrieveMobile);
app.use('/test',updateDetails);
app.use('/test',productAccess);
app.use('/test', homePage);
app.use('/test',buyPage);
app.use('/test',rentPage);
app.listen(port, () => console.log('Listening on', port));
