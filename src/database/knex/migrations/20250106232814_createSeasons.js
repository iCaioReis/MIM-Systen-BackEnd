exports.up = knex => knex.schema.createTable("seasons", table => {
    table.increments("id");
    table.text("image");

    table
        .enum("status", ["active", "inative"], { useNative: true, enumName: "status" })
        .notNullable()
        .defaultTo("active");

    table.text("name").notNullable();

    table.timestamp("start_date").notNullable();
    table.timestamp("end_date").notNullable();

    
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("seasons");