const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { CalculatePoints, CalculateChampionsPoints } = require("../utils/calculatePoints");

class SeasonPointsController {
    async show(request, response) {
        const { id } = request.params;

        const season = await knex("seasons").where({ id }).first();
        if (!season) {
            throw new AppError("Circuito não encontrado!", 404);
        }

        const events = await knex("events")
            .where({ season_id: id })
            .orderBy("start_date", "asc");

        const eventIds = events.map(event => event.id);
        const firstEventId = events.length > 0 ? events[0].id : null;

        const eventsPoints = await knex("horsesPresentersEvent")
            .whereIn("event_id", eventIds);

        const horseResults = {};
        const presenterResults = {};

        eventsPoints.forEach(item => {
            const isFirstEvent = item.event_id === firstEventId;
            let basePoints = CalculatePoints(item.result) + CalculateChampionsPoints(item.champion_of_champions_result) || 0;

            // Aplica multiplicador SOMENTE para cavalos no primeiro evento
            const horsePoints = isFirstEvent ? basePoints * 2 : basePoints;

            if (!horseResults[item.horse_id]) {
                horseResults[item.horse_id] = 0;
            }
            horseResults[item.horse_id] += horsePoints;

            // Presenter sempre usa basePoints (sem multiplicador)
            if (!presenterResults[item.presenter_id]) {
                presenterResults[item.presenter_id] = 0;
            }
            presenterResults[item.presenter_id] += basePoints;
        });

        const horseIds = Object.keys(horseResults);
        const horsesInfo = await knex("horses")
            .whereIn("id", horseIds)
            .select("id", "name", "gender", "march");

        const presenterIds = Object.keys(presenterResults);
        const presentersInfo = await knex("presenters")
            .whereIn("id", presenterIds)
            .select("id", "name");

        const horsesArray = horseIds.map(horse_id => {
            const info = horsesInfo.find(h => h.id === Number(horse_id));
            return {
                horse_id: Number(horse_id),
                name: info?.name || "Desconhecido",
                gender: info?.gender,
                march: info?.march,
                total_points: horseResults[horse_id]
            };
        });

        const presentersArray = presenterIds.map(presenter_id => {
            const info = presentersInfo.find(p => p.id === Number(presenter_id));
            return {
                presenter_id: Number(presenter_id),
                name: info?.name || "Desconhecido",
                total_points: presenterResults[presenter_id]
            };
        });

        // Ordenar cavalos por pontos (decrescente)
        horsesArray.sort((a, b) => b.total_points - a.total_points);

        // Ordenar apresentadores por pontos (decrescente)
        presentersArray.sort((a, b) => b.total_points - a.total_points);

        return response.json({
            season,
            events,
            horses: horsesArray,
            presenters: presentersArray
        });
    }
}

module.exports = SeasonPointsController;
