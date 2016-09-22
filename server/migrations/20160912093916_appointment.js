'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('appointments', function(table){
    table.increments();
    table.integer('client_id');
    table.string('date');
    table.integer('hour');
    table.integer('minute');
    table.string('amORpm');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('appointments');
};
