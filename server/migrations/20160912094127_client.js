'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('clients', function(table){
    table.increments();
    table.string('fname');
    table.string('lname');
    table.string('email');
    table.string('phone_num');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('clients');
};
