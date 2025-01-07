const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class SeasonsController {
    async create(request, response) {
        const {
            status,
            created_at,

            image,

            name,
            start_date,
            end_date,

        } = request.body;

        if (!name || !start_date || !end_date) {
            throw new AppError("Informe todos os campos obrigatórios!", 400);
        }

        const [seasonId] = await knex("seasons").insert({
            status,
            created_at,

            image,

            name,
            start_date,
            end_date,

        }).returning('id');

        return response.status(201).json({ id: seasonId });
    }

    async show(request, response) {
        const { id } = request.params;
        const { last } = request.query;

        let Season = await knex("seasons").where({ id }).first();

        if (last === "true") {
            Season = await knex("seasons").orderBy("created_at", "desc").first();
        };

        return response.json({Season})
    }

    async index(request, response) {
        const { name } = request.query;

        const Seasons = await knex("seasons")
            .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
            .orderBy("name");

        return response.json({ Seasons })
    }

    async update(request, response) {
        const { id } = request.params;
        const {
            status,
            created_at,

            image,

            name,
            start_date,
            end_date,

        } = request.body;
        

        const season = await knex("seasons").where({ id }).first();

        if (!season) {
            throw new AppError("Evento não encontrado!");
        };

        if (!name || !start_date || !end_date) {
            throw new AppError("Informe todos os campos obrigatórios!", 400);
        }

        await knex("seasons").update({
            status,
            created_at,

            image,

            name,
            start_date,
            end_date,

        }).where({ id: id });

        return response.json();
    }

    async delete(request, response) {
        const { id } = request.params;

        const res = await knex("seasons").where({ id }).delete();

        return response.json();
    }
}

module.exports = SeasonsController;