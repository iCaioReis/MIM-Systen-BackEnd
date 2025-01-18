const knex = require("../database/knex");

class SearchActiveHorsesController {
    async index(request, response) {
        const { name } = request.query;
    
        try {
            const Seasons = await knex("seasons")
                .where("status", "active")
                .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
                .orderBy("name");
    
            return response.json(Seasons);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error" });
        }
    }
    
}

module.exports = SearchActiveHorsesController;