'use strict';

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

router.post('/welcome', function(req, res, next){
  if(!(req.body.username === 'jane.doe' && req.body.password === '1234')) {
    res.status(401).send({message: 'Incorrect username or password'});
    return;
  }

  var profile = {
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@doe.com',
    id: 123
  };

  var token = jwt.sign(profile, 'secret');
  res.status(200).json({ token: token });
});



module.exports = router;
