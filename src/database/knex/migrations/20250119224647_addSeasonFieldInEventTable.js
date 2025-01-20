exports.up = (knex) => knex.schema.table('events', (table) => {
    table.integer("season_id").references("id").inTable("seasons");
});

exports.down = (knex) => knex.schema.table('events', (table) => {
    table.dropColumn('season_id');
});