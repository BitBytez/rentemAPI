const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000
dotenv.config();

const mailChecker = require('./routes/mail_checker');

//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//route middlewares
app.use(logger('dev'));

//routes
app.use('/test',mailChecker);

app.listen(port, () => console.log('Listening on', port));
