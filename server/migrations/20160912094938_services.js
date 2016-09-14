'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('services', function(table){
    table.increments();
    table.integer('appointment_id');
    table.boolean('womenscut');
    table.boolean('haircut');
    table.boolean('manscut');
    table.boolean('childscut');
    table.boolean('shampoo');
    table.boolean('ironworks');
    table.boolean('formal');
    table.boolean('tapein');
    table.boolean('remove_ext');
    table.boolean('root_touch');
    table.boolean('allcolor');
    table.boolean('manscolor');
    table.boolean('accentcolor');
    table.boolean('part_hilight');
    table.boolean('half_hilight');
    table.boolean('full_hilight');
    table.boolean('corrective');
    table.boolean('base_perm');
    table.boolean('spiral_perm');
    table.boolean('eyebrow_wax');
    table.boolean('lip_wax');
    table.boolean('underarm_wax');
    table.boolean('bikini_wax');
    table.boolean('redken');
    table.boolean('miracle');
    table.boolean('ind_pedi');
    table.boolean('gel_pedi');
    table.boolean('trad_mani');
    table.boolean('gel_mani');
    table.boolean('design');
    table.boolean('polish_change');
    table.boolean('eyelash_ext');
    table.boolean('eyelash_fill');
    table.string('comments');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('services');
};
