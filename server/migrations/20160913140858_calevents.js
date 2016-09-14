'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('calevents', function(table){
    table.increments();
    table.string('title');
    table.string('startdate');
    table.string('enddate');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('calevents');
};
