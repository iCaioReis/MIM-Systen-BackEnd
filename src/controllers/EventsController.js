const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class EventsController {
    async create(request, response) {
        const { status, name, start_date, end_date, modality, judge_id, season_id } = request.body;

        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
        if (!start_date) {
            throw new AppError("O campo Data Início é obrigatório.", 400);
        }
        if (!end_date) {
            throw new AppError("O campo Data Fim é obrigatório.", 400);
        }
        if (!modality) {
            throw new AppError("O campo modalidade é obrigatório.", 400);
        }
        if (!judge_id) {
            throw new AppError("O campo Juiz é obrigatório.", 400);
        }
        if (!season_id) {
            throw new AppError("O campo Temporada é obrigatório.", 400);
        }

        const [eventId] = await knex("events").insert({ status, name, start_date, end_date, modality, judge_id, season_id }).returning('id');

        return response.status(201).json({ id: eventId });
    }

    async show(request, response) {
        const { id } = request.params;
        const { last } = request.query;

        let eventQuery = knex("events")
            .select(
                "events.*",
                "users.id as user_id",
                "users.name as user_name",
                "seasons.id as season_id",
                "seasons.name as season_name"
            )
            .leftJoin("users", "events.judge_id", "users.id")
            .leftJoin("seasons", "events.season_id", "seasons.id");

        if (last === "true") {
            eventQuery = eventQuery.orderBy("events.created_at", "desc").first();
        } else {
            eventQuery = eventQuery.where("events.id", id).first();
        }

        const event = await eventQuery;

        if (event) {
            const Event = {
                id: event.id,
                status: event.status,
                created_at: event.created_at,
                
                image: event.image,
                
                name: event.name,
                start_date: event.start_date,
                end_date: event.end_date,

                modality: event.modality,

                judge: {
                    id: event.user_id,
                    name: event.user_name,
                },

                season: {
                    id: event.season_id,
                    name: event.season_name,
                }
            };

            return response.json({ Event });
        }
        return response.status(404).json({ error: "Evento não encontrado!" });
    }

    async index(request, response) {
        const { name } = request.query;

        const Events = await knex("events")
            .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
            .orderBy("name");

        return response.json({ Events })
    }

    async update(request, response) {
        const { status, name, start_date, end_date, modality, judge_id, season_id } = request.body;
        const { id } = request.params;

        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
        if (!start_date) {
            throw new AppError("O campo Data Início é obrigatório.", 400);
        }
        if (!end_date) {
            throw new AppError("O campo Data Fim é obrigatório.", 400);
        }
        if (!modality) {
            throw new AppError("O campo modalidade é obrigatório.", 400);
        }
        if (!judge_id) {
            throw new AppError("O campo Juiz é obrigatório.", 400);
        }
        if (!season_id) {
            throw new AppError("O campo Temporada é obrigatório.", 400);
        }

        const event = await knex("events").where({ id }).first();

        if (!event) {
            throw new AppError("Evento não encontrado!");
        }

        await knex("events").update({ status, name, start_date, end_date, modality, judge_id, season_id }).where({ id: id });

        return response.status(201).json({ id });
    }
}

module.exports = EventsController;