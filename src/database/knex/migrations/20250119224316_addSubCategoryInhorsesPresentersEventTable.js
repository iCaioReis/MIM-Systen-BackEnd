exports.up = (knex) => knex.schema.table('horsesPresentersEvent', (table) => {
    table.string('sub_category').nullable();
});

exports.down = (knex) => knex.schema.table('horsesPresentersEvent', (table) => {
    table.dropColumn('sub_category');
});