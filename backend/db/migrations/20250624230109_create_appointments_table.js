// backend/db/migrations/<TIMESTAMP>_create_appointments_table.js
exports.up = function(knex) {
  return knex.schema.createTable('appointments', function(table) {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.dateTime('scheduled_date').notNullable();
    table.string('client_name', 255).notNullable();
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('appointments');
};