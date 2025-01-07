exports.up = knex => knex.schema.createTable("events", table => {
    table.increments("id");
    table.text("image");

    table
        .enum("status", ["active", "inative"], { useNative: true, enumName: "status" })
        .notNullable()
        .defaultTo("active");

    table.text("name").notNullable();
    table.timestamp("start_date").notNullable();
    table.timestamp("end_date").notNullable();

    table
        .enum("modality", ["marching_cup_proof", "social_proof"], { useNative: true, enumName: "modalities" })
        .notNullable()
        .defaultTo("marching_cup_proof");
    table.integer("judge_id").references("id").inTable("users").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("events");