const knex = require("../database/knex");

class PresentersIndexToHorseController {

    async index(request, response) {
        const { name } = request.query;

        const Presenters = await knex("presenters")
        .where("status", "active")
        .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
        .orderBy("name");

        return response.json(Presenters)
    }
}

module.exports = PresentersIndexToHorseController;