'use strict';

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

router.post('/welcome', function(req, res, next){
  if(!(req.body.username === process.env.ADMIN_USERNAME && req.body.password === process.env.ADMIN_PASSWORD)) {
    res.status(401).send({message: 'Incorrect username or password'});
    return;
  }

  // TODO: replace this info with env password / username

  var profile = {
    first_name: process.env.FIRSTNAME,
    last_name: process.env.LASTNAME,
    email: 'amandamherrington@gmail.com',
    id: 123
  };

  var token = jwt.sign(profile, 'secret');
  res.status(200).json({ token: token });
});



module.exports = router;
