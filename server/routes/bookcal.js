'use strict';
var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res){
  knex('calevents').select('id', 'date', 'starttime_hr', 'starttime_min', 'endtime_hr', 'endtime_min').then(function(data){
    var revisedData = [];
    var output;
    var fixedDate;
    var justDay;
    var justTimeStart;
    var justTimeEnd;
    var start;
    var end;

    console.log('client cal data!', data);
    for(var i = 0; i < data.length; i++){
      var clientViewAppts = {};
      output = JSON.stringify(data[i].date);
      fixedDate = output.split('T');
      justDay = fixedDate[0];

      start = justDay + data[i].starttime_hr + data[i].starttime_min;
        start = start.slice(1);
      end = justDay + data[i].endtime_hr + data[i].endtime_min;
        end = end.slice(1);

      justTimeStart = start.split('T');
        justTimeStart = justTimeStart[1];
        console.log('justTimeStart',justTimeStart);
        justTimeStart = justTimeStart.slice(0, -3);

      justTimeEnd = end.split('T');
        justTimeEnd = justTimeEnd[1];
        justTimeEnd = justTimeEnd.slice(0, -3);

      
      clientViewAppts.justtimestart = justTimeStart;
      clientViewAppts.justtimeend = justTimeEnd;
      clientViewAppts.start = start;
      clientViewAppts.end = end;
      clientViewAppts.date = justDay.slice(1);
      clientViewAppts.id = data[i].id;
      clientViewAppts.starttime_hr = data[i].starttime_hr;
      clientViewAppts.starttime_min = data[i].starttime_min;
      clientViewAppts.endtime_hr = data[i].endtime_hr;
      clientViewAppts.endtime_min = data[i].endtime_min;
      revisedData.push(clientViewAppts);
    }

    //console.log(revisedData);
    res.json(revisedData);
  }, function(err){
    console.log(err);
  });
});


module.exports = router;
