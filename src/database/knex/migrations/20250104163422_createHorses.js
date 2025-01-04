exports.up = knex => knex.schema.createTable("horses", table => {
    table.increments("id");
    table.text("image");

    table
        .enum("status", ["active", "inative"], { useNative: true, enumName: "status" })
        .notNullable()
        .defaultTo("active");

    table.text("name").notNullable();
    table.text("surname").notNullable();

    table
        .enum("gender", ["castrated", "stallion", "mare"], { useNative: true, enumName: "genders" })
        .notNullable()
        .defaultTo("castrated");

    table.boolean("without_registration").defaultTo(false);
    table.text("chip");
    table.text("register");
    table.timestamp("born");

    table.text("mother").notNullable();
    table.text("father").notNullable();
    table
        .enum("march", ["beat", "shredded"], { useNative: true, enumName: "marchs" })
        .notNullable()
        .defaultTo("beat");

    table.integer("presenter_id").references("id").inTable("presenters");

    table.text("owner").notNullable();

    table.text("address").notNullable();
    table.text("farm").notNullable();
    
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("horses");