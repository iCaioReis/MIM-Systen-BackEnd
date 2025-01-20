exports.up = (knex) => knex.schema.alterTable('events', (table) => {
    table.integer("season_id").notNullable().alter();
});

exports.down = (knex) => knex.schema.alterTable('events', (table) => {
    table.integer("season_id").nullable().alter();
});