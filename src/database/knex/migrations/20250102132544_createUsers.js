exports.up = knex => knex.schema.createTable("users", table => {
    table.increments("id");
    table.text("image");

    table
        .enum("status", ["active", "inative"], { useNative: true, enumName: "status" })
        .notNullable()
        .defaultTo("active");

    table.text("name").notNullable();
    table.text("phone");
    table
        .enum("gender", ["male", "female"], { useNative: true, enumName: "genders" })
        .notNullable()
        .defaultTo("male");

    table.text("CPF");
    table.text("email");
    table.timestamp("born");

    table.text("login").notNullable();
    table.text("password").notNullable();
    table
        .enum("role", ["common", "administrator", "judge", "sup"], { useNative: true, enumName: "roles" })
        .notNullable()
        .defaultTo("common");

    table.text("address").notNullable();
    table.text("address_number").notNullable();
    table.text("address_neighborhood").notNullable();
    table.text("address_city").notNullable();
    table.text("address_state").notNullable();
    table.text("address_country").notNullable();
    table.text("address_cep");
    table.text("address_observation");

    table.text("pix");
    table.text("favored");
    table.text("bank");
    table.text("agency");
    table.text("account");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("users");