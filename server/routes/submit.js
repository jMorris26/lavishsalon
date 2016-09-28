'use strict';

var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var querystring = require('querystring');
var https = require('https');


router.post('/', function(req, res){
  if((!req.body.fname) || (!req.body.lname) || (!req.body.email) || (!req.body.phone_num)){
    res.status(400).send({message: 'Incomplete form'});
    return;
  }

  var serviceArr = [];

  //styles object, key is name in database, equal to string
  var styles = {
    "womenscut" : " Women's Cut & Style",
    "haircut" : " Great Haircut",
    "manscut" : " Gentleman's Shampoo & Cut",
    "childscut" : " Child's Cut",
    "shampoo" : " Shampoo & Blowout",
    "ironworks" : " Iron Works",
    "formal" : " Formal Style",
    "tapein" : " Tape In Extension Application",
    "remove_ext" : " Removal of Extensions",
    "root_touch" : " Root Touch Up",
    "allcolor" : " All Over Color",
    "manscolor" : " Gentleman's Color",
    "accentcolor" : " Accent Color",
    "part_hilight" : " Partial Highlight",
    "half_hilight" : " Half Head Highlight",
    "full_hilight" : " Full Head Highlight",
    "corrective" : " Corrective Color",
    "base_perm" : " Basic Perm",
    "spiral_perm" : " Spiral Perm",
    "eyebrow_wax" : " Eyebrow Wax",
    "lip_wax" : " Lip and Chin Wax",
    "underam_wax" : " Underarm Wax",
    "bikini_wax" : " Bikini Wax",
    "redken" : " Redken® Chemistry Shots",
    "miracle" : " Miracle Hair Max",
    "ind_pedi" : " Indulgent Pedicure",
    "gel_pedi" : " Gel Polish Pedicure",
    "trad_mani" : " Traditional Manicure",
    "gel_mani" : " Gel Polish Manicure",
    "design" : " Design Add-On",
    "polish_change" : " Polish Change",
    "eyelash_ext" : " Eyelash Extension Application",
    "eyelash_fill" : " Eyelash Extension Fill"
  };

  for(var s in req.body.services){
    if(styles[s]){
      if(req.body.services[s] === true){
        serviceArr.push(styles[s]);
      }
    }
  }


  console.log(serviceArr);
  console.log('REQ******', req.body.services);

  function sendElasticEmail() {
  	// Make sure to add your username and api_key below.

  	var post_data = querystring.stringify({

  		'username' : 'morris.jess26@gmail.com',
  		'api_key': process.env.ELASTICEMAIL_KEY,
  		'from': 'morris.jess26@gmail.com',
  		'from_name' : 'Lavish Salon',
  		'to' : 'morris.jess26@gmail.com',
  		'subject' : 'Confirm Your Appointment at Lavish Salon',
      'reply_to' : req.body.email,
      'reply_to_name' : req.body.fname + ' ' + req.body.lname,
      'template' : 'lavishtemplate',
      'merge_firstname' : req.body.fname,
      'merge_lastname' : req.body.lname,
      'merge_email' : req.body.email,
      'merge_phone' : req.body.phone_num,
      'merge_birthdate' : req.body.date,
      'merge_title' : req.body.hour + ':' + req.body.minute + ' ' + req.body.amORpm,
      'merge_industry' : serviceArr,
      'merge_organizationname' : req.body.comments

  	});



  	// Object of options.
  	var post_options = {
  		host: 'api.elasticemail.com',
  		path: '/mailer/send',
  		port: '443',
  		method: 'POST',
  		headers: {
  			'Content-Type': 'application/x-www-form-urlencoded',
  			'Content-Length': post_data.length
  		}
  	};
  	var result = '';
  	// Create the request object.
  	var post_req = https.request(post_options, function(response) {
  		response.setEncoding('utf8');
  		response.on('data', function (chunk) {
        console.log('chunk', chunk);
  			result = chunk;
  		});
  		response.on('error', function (e) {
  			result = 'Error: ' + e.message;
        console.log('Error: ', e.message);
  		});
  	});

  	// Post to Elastic Email
  	post_req.write(post_data);
  	post_req.end();
    console.log('result: ', result);
    res.json({result: result});
    // return result;
  }

  console.log(sendElasticEmail());

  // TODO: stretch goal: SMS alert
  // function sendElasticSms(){
  //   var post_data = querystring.stringify({
  //     'api_key' : process.env.ELASTICEMAIL_KEY,
  //     'to' : process.env.PNUM,
  //     'body' : req.body.fname + ' ' + req.body.lname + ' has requested an appointment for ' + req.body.date + ' at ' + req.body.hour + ':' + req.body.minute + ' ' + req.body.amORpm + '!'
  //   });
  // }




  // knex('clients').insert({
  //   fname: req.body.fname,
  //   lname: req.body.lname,
  //   email: req.body.email,
  //   phone_num: req.body.phone_num
  // })
  // .returning('*')
  // .then(function(clientInfo){
  //   // console.log('client info: ', clientInfo);
  //   return knex('appointments').insert({
  //     client_id: clientInfo[0].id,
  //     date: req.body.date,
  //     hour: req.body.hour,
  //     minute: req.body.minute,
  //     amORpm: req.body.amORpm
  //   })
  //   .returning('*')
  //   .then(function(apptInfo){
  //     // console.log('appointment info: ', apptInfo);
  //     return knex('services').insert({
  //       appointment_id: apptInfo[0].id,
  //       womenscut: req.body.womenscut,
  //       haircut: req.body.haircut,
  //       manscut: req.body.manscut,
  //       childscut: req.body.childscut,
  //       shampoo: req.body.shampoo,
  //       ironworks: req.body.ironworks,
  //       formal: req.body.formal,
  //       tapein: req.body.tapein,
  //       remove_ext: req.body.remove_ext,
  //       root_touch: req.body.root_touch,
  //       allcolor: req.body.allcolor,
  //       manscolor: req.body.manscolor,
  //       accentcolor: req.body.accentcolor,
  //       part_hilight: req.body.part_hilight,
  //       half_hilight: req.body.half_hilight,
  //       full_hilight: req.body.full_hilight,
  //       corrective: req.body.corrective,
  //       base_perm: req.body.base_perm,
  //       spiral_perm: req.body.spiral_perm,
  //       eyebrow_wax: req.body.eyebrow_wax,
  //       lip_wax: req.body.lip_wax,
  //       underarm_wax: req.body.underam_wax,
  //       bikini_wax: req.body.bikini_wax,
  //       redken: req.body.redken,
  //       miracle: req.body.miracle,
  //       ind_pedi: req.body.ind_pedi,
  //       gel_pedi: req.body.gel_pedi,
  //       trad_mani: req.body.trad_mani,
  //       gel_mani: req.body.gel_mani,
  //       design: req.body.design,
  //       polish_change: req.body.polish_change,
  //       eyelash_ext: req.body.eyelash_ext,
  //       eyelash_fill: req.body.eyelash_fill,
  //       comments: req.body.comments
  //     })
  //     .returning('*')
  //     .then(function(data){
  //       console.log(data);
  //       res.json(data);
  //     }, function(err){
  //       console.log(err);
  //     });
  //   }, function(err){
  //     console.log(err);
  //   });
  // }, function(err){
  //   console.log(err);
  // });


  //var totalAppt = {};


});

module.exports = router;


// .then(function(clientInfo){ //data will be id
//   totalAppt.clientInfo = clientInfo;
//   return knex('appointments').insert({
//     client_id: clientInfo[0].id,
//     date: req.body.date,
//     hour: req.body.hour,
//     minute: req.body.minute,
//     amORpm: req.body.amORpm
//   }).returning('*').then(function(apptInfo){
//     totalAppt.apptInfo = apptInfo;
//     return knex('services').insert({
//       appointment_id: apptInfo.id,
//       womenscut: req.body.womenscut,
//       haircut: req.body.haircut,
//       manscut: req.body.manscut,
//       childscut: req.body.childscut,
//       shampoo: req.body.shampoo,
//       ironworks: req.body.ironworks,
//       formal: req.body.formal,
//       tapein: req.body.tapein,
//       remove_ext: req.body.remove_ext,
//       root_touch: req.body.root_touch,
//       allcolor: req.body.allcolor,
//       manscolor: req.body.manscolor,
//       accentcolor: req.body.accentcolor,
//       part_hilight: req.body.part_hilight,
//       half_hilight: req.body.half_hilight,
//       full_hilight: req.body.full_hilight,
//       corrective: req.body.corrective,
//       base_perm: req.body.base_perm,
//       spiral_perm: req.body.spiral_perm,
//       eyebrow_wax: req.body.eyebrow_wax,
//       lip_wax: req.body.lip_wax,
//       underam_wax: req.body.underam_wax,
//       bikini_wax: req.body.bikini_wax,
//       redken: req.body.redken,
//       miracle: req.body.miracle,
//       ind_pedi: req.body.ind_pedi,
//       gel_pedi: req.body.gel_pedi,
//       trad_mani: req.body.trad_mani,
//       gel_mani: req.body.gel_mani,
//       design: req.body.design,
//       polish_change: req.body.polish_change,
//       eyelash_ext: req.body.eyelash_ext,
//       eyelash_fill: req.body.eyelash_fill,
//       comments: req.body.comments
//     }).returning("*")
//     .then(function(serviceInfo){
//       totalAppt.serviceInfo = serviceInfo;
//       res.json(totalAppt);
//     });
//   });
// })




// knex('clients').insert({
//   fname: req.body.fname,
//   lname: req.body.lname,
//   email: req.body.email,
//   phone_num: req.body.phone_num
// })
// .returning('*')
// .then(function(data){
//   console.log(data);
//   res.json(data);
// }, function(err){
//   console.log(err);
// });
