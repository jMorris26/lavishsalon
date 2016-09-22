'use strict';

var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res){
  knex('calevents').select('id', 'client_name AS title', 'date', 'starttime_hr', 'starttime_min', 'endtime_hr', 'endtime_min', 'services').then(function(data){
    //console.log('THIS IS WHAT YOURE GETTING BACK: ', data);
    var revisedData = [];
    var output;
    var fixedDate;
    var justDay;
    var justTimeStart;
    var justTimeEnd;
    var start;
    var end;

    for(var i = 0; i < data.length; i++){
      var appts = {};
      output = JSON.stringify(data[i].date);
      fixedDate = output.split('T');
      justDay = fixedDate[0];

      start = justDay + data[i].starttime_hr + data[i].starttime_min;
        start = start.slice(1);
      end = justDay + data[i].endtime_hr + data[i].endtime_min;
        end = end.slice(1);

      justTimeStart = start.split('T');
        justTimeStart = justTimeStart[1];
        justTimeStart = justTimeStart.slice(0, -3);

      justTimeEnd = end.split('T');
        justTimeEnd = justTimeEnd[1];
        justTimeEnd = justTimeEnd.slice(0, -3);


      appts.justtimestart = justTimeStart;
      appts.justtimeend = justTimeEnd;
      appts.title = data[i].title;
      appts.start = start;
      appts.end = end;
      appts.date = justDay.slice(1);
      appts.services = data[i].services;
      appts.id = data[i].id;
      appts.starttime_hr = data[i].starttime_hr;
      appts.starttime_min = data[i].starttime_min;
      appts.endtime_hr = data[i].endtime_hr;
      appts.endtime_min = data[i].endtime_min;
      revisedData.push(appts);
    }

    //console.log(revisedData);
    res.json(revisedData);
  }, function(err){
    console.log(err);
  });
});

router.post('/', function(req, res){
  //console.log(req.body);
  knex('calevents').insert({
    date: req.body.date,
    client_name: req.body.client_name,
    starttime_hr: req.body.starttime_hr,
    starttime_min: req.body.starttime_min,
    endtime_hr: req.body.endtime_hr,
    endtime_min: req.body.endtime_min,
    services: req.body.services
  })
  .returning('*')
  .then(function(data){
    console.log(data);
    res.json(data);
  }, function(err){
    console.log(err);
  });
});

router.post('/:id', function(req, res){
  console.log('*********', req.body);
  knex('calevents').update({
    date: req.body.date,
    client_name: req.body.client_name,
    starttime_hr: req.body.starttime_hr,
    starttime_min: req.body.starttime_min,
    endtime_hr: req.body.endtime_hr,
    endtime_min: req.body.endtime_min,
    services: req.body.services
  })
  .where({id: req.params.id})
  .returning('*')
  .then(function(data){
    console.log('Edit data? ', data);
    res.json(data);
  }, function(err){
    console.log(err);
    res.status(500).json({message: err});
  });
});

router.delete('/:id', function(req, res){
  //console.log(req.body);
  knex('calevents').where({id: req.params.id}).del()
  .then(function(data){
    console.log(data);
    res.json(data);
  }, function(err){
    console.log(err);
  });
});

module.exports = router;


// Promise.all([
// 	knex('table').where({something: 'thing'}),
// 	knex('othertable').where({something: 'thing'}),
// ]);
//
// or you could just get all data from a table if you're only using one table
//
// like:
//
//
// knex('table').where({
// 	something: 'thing',
// 	other: 'stuff',
// 	things: 'stuff'
// }).then(etc...


// var user = req.body.user;
//
// where({
// 	id: user.id,
// 	email: user.email,
// 	birthdate: user.birthdate
// })
// .then(function(foundUser) {
// 		//found user will be an array of the users found that match that where clause
// });
//



// .then(funciton(data) {
//
// 	  var output = data + ' ' + data;
//
// });
