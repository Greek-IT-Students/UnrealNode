
'use strict';
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
app.use('/static', express.static('public'));
app.use(replacer);

app.use('/api/', router);

app.use('/', (req, res, next) => {
    next(new Error('no method'));
});

app.use(function (err, req, res, next) {
    console.error(err);

    res.json({status: 400, message: err.message});
});

process.on('uncaughtException', function (err) {
    console.error('uncaughtException: ', err.message);
    console.error(err.stack);
});

app.listen(app.get('port'), function () {
    console.log('AuthSystem started on port', app.get('port'));
});

process.on('SIGTERM', () => {
    app.close(() => {
        process.exit(0);
    });
});