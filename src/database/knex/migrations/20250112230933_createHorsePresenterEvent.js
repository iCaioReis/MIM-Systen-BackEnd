exports.up = knex => knex.schema.createTable("horsesPresentersEvent", table => {
    table.increments("id");
    
    table.integer("event_id").references("id").inTable("events").notNullable();
    table.integer("horse_id").references("id").inTable("horses").notNullable();
    table.integer("presenter_id").references("id").inTable("presenters").notNullable();
    table.integer("vest");

    table.text("category");
    table.integer("result");
    table.integer("champion_of_champions_result");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("horsesPresentersEvent");