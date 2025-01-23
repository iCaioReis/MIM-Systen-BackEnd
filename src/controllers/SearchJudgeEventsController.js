const knex = require("../database/knex");

class SearchJudgeEventsController {
    async index(request, response) {
        const { name } = request.query;
    
        try {
            const Events = await knex("events")
                .whereNotIn("status", ["active", "inactive"]) 
                .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
                .orderBy("name");
    
            return response.json(Events);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error" });
        }
    }

    async show(request, response) {
        const { id } = request.params;
        const { last } = request.query;

        let eventQuery = knex("events")
            .whereNotIn("events.status", ["active", "inactive"]) 
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
}

module.exports = SearchJudgeEventsController;
