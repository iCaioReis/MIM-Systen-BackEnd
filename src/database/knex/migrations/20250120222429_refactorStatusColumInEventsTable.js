exports.up = async knex => {
    // Desabilita temporariamente as verificações de chave estrangeira
    await knex.raw('PRAGMA foreign_keys = OFF');

    // 1. Remove a chave estrangeira da tabela 'horsesPresentersEvent' que referencia 'events'
    await knex.schema.alterTable("horsesPresentersEvent", table => {
        table.dropForeign(["event_id"]); // Supondo que a chave estrangeira seja 'event_id'
    });

    // 2. Adiciona uma nova coluna 'status' na tabela 'events'
    await knex.schema.alterTable("events", table => {
        table
            .enum('new_status', ['active', 'inative', 'making_registrations', 'finished_inscriptions', 'running', 'finished'], {
                useNative: true,
                enumName: 'status',
            })
            .notNullable()
            .defaultTo('active');
    });

    // 3. Copia os dados da coluna antiga para a nova coluna
    await knex("events").update({
        new_status: knex.raw("status")
    });

    // 4. Remove a coluna antiga 'status'
    await knex.schema.alterTable("events", table => {
        table.dropColumn("status");
    });

    // 5. Renomeia a nova coluna 'new_status' para 'status'
    await knex.schema.alterTable("events", table => {
        table.renameColumn("new_status", "status");
    });

    // 6. Restaura a chave estrangeira na tabela 'horsesPresentersEvent' que referencia 'events'
    await knex.schema.alterTable("horsesPresentersEvent", table => {
        table.foreign("event_id").references("events.id").onDelete("CASCADE");
    });

    // Restaura as verificações de chave estrangeira
    await knex.raw('PRAGMA foreign_keys = ON');
};

exports.down = async knex => {
    // Desabilita temporariamente as verificações de chave estrangeira
    await knex.raw('PRAGMA foreign_keys = OFF');

    // Caso seja necessário reverter, o processo será o inverso:

    // 1. Remove a chave estrangeira na tabela 'horsesPresentersEvent'
    await knex.schema.alterTable("horsesPresentersEvent", table => {
        table.dropForeign(["event_id"]);
    });

    // 2. Cria novamente a coluna antiga 'status' na tabela 'events'
    await knex.schema.alterTable("events", table => {
        table.string("status").notNullable().defaultTo("active");
    });

    // 3. Copia os dados da nova coluna 'status' de volta para a coluna antiga
    await knex("events").update({
        status: knex.raw("new_status")
    });

    // 4. Remove a nova coluna 'new_status'
    await knex.schema.alterTable("events", table => {
        table.dropColumn("new_status");
    });

    // 5. Restaura a chave estrangeira na tabela 'horsesPresentersEvent'
    await knex.schema.alterTable("horsesPresentersEvent", table => {
        table.foreign("event_id").references("events.id").onDelete("CASCADE");
    });

    // Restaura as verificações de chave estrangeira
    await knex.raw('PRAGMA foreign_keys = ON');
};
