
'use strict';
import {HandleErrors} from "./handleErrors";

const SetDefaultResposeHeaders =  require("./ResposeHeaders").DefaultResposeHeaders;
const ErrorLog =  require("./models/ErrorLog.js");
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const replacer = require('./replacer.js');
const router = require('./router.js')
const mongoose = require('mongoose')
const hpp = require('hpp');
mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false',{
    useNewUrlParser: true,
    useCreateIndex: false,
    useFindAndModify: false
})
    .then(()=>
        console.log('Connected to mongo'))
    .catch((err) =>{
        console.log(err);
})

let app = express();

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));
//http polution
app.use(hpp());
//static content
app.use('/static', express.static('public'));
//get request data either from  body or as query params
app.use(replacer);

app.use(SetDefaultResposeHeaders());


//our main endpoints
app.use('/api/', router);

app.use('/', (req, res, next) => {
   let error = new Error('Server Error, we will work on fixing it, if the error persists contact us')
    error.details = '---Error route not found---'
    next(error);

});

app.use(function (err, req, res, next) {
    HandleErrors(err,req,res,next);
    //console.error(err.details);
    //res.json({status: 400, message: err.message});
});

process.on('uncaughtException', function (err) {
    HandleErrors(err);
    //console.error('uncaughtException: ', err.message);
    // console.error(err.stack);
});

let server = app.listen(app.get('port'), function () {
    console.log('AuthSystem started on port', app.get('port'));
});

process.on('SIGINT', () => {
    console.log('---sigint signal received---');
    console.log('---initiating shutdown---');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('db connection dropped, controlled');
            process.exit(0);
        });
    });
});

process.on('SIGTERM', () => {
    console.log('---sigterm signal received---');
    server.close(() => {

    console.log('Termination forced');

    mongoose.connection.close(false, () => {
        console.log('db connection dropped, forced');
        process.exit(0);
    });
    });
});