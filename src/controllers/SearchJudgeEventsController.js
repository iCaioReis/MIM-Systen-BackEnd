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
}

module.exports = SearchJudgeEventsController;
