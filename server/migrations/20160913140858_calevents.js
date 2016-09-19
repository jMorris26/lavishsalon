'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('calevents', function(table){
    table.increments();
    table.date('date');
    table.string('client_name');
    table.string('starttime_hr');
    table.string('starttime_min');
    table.string('endtime_hr');
    table.string('endtime_min');
    table.string('services');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('calevents');
};
