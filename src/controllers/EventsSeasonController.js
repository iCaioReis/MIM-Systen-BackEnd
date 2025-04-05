const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class EventsSeasonController {
    async show(request, response) {
        const { id } = request.params;

        // Busca a temporada específica
        const season = await knex("seasons").where({ id }).first();
        if (!season) {
            throw new AppError("Circuito não encontrado!", 404);
        }

        // Busca todos os eventos associados à temporada
        const events = await knex("events").where({ season_id: id }).orderBy("start_date", "asc");

        return response.json({ season, events }) ;
    }
}

module.exports = EventsSeasonController;
