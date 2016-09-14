'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    logger = require('morgan'),
    expressJwt = require('express-jwt');

var root = require('./routes/index');
var api = require('./routes/login');
var submit = require('./routes/submit');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/', root);
app.use('/submit', submit);

// app.use('/welcome', expressJwt({ secret:'secret' }), api);



app.listen(port, function(){
  console.log('Server running on ' + port);
});

module.exports = app;
