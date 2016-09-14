'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

router.get('/restricted', function(req, res){
  res.json(); //{ message: 'You are authenticated!' }
});

module.exports = router;
