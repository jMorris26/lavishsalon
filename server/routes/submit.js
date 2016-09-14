'use strict';

var express = require('express');
var router = express.Router();

router.post('/', function(req, res){
  if((!req.body.fname) || (!req.body.lname) || (!req.body.email) || (!req.body.phone_num)){
    res.status(400).send({message: 'Incomplete form'});
    return;
  }
  console.log(req.body);
  res.sendStatus(200);
});

module.exports = router;
