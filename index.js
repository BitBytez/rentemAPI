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
app.use('/test',mailChecker);
app.use('/test',dataRetrieveMobile);
app.use('/test',updateDetails);
app.use('/test',productAccess);

app.listen(port, () => console.log('Listening on', port));
