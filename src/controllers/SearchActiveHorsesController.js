const knex = require("../database/knex");

class SearchActiveHorsesController {
    async index(request, response) {
        const { name } = request.query;
    
        try {
            const horses = await knex("horses")
                .join("presenters", "horses.presenter_id", "=", "presenters.id")
                .select(
                    "horses.id as id",
                    "horses.name as name",
                    "presenters.id as presenter_id",
                    "presenters.name as presenter_name"
                )
                .where("horses.status", "active")
                .whereLike("horses.name", `%${name.replace(/\s/g, '%')}%`)
                .orderBy("horses.name");
    
            const formattedHorses = horses.map(horse => ({
                id: horse.id,
                name: horse.name,
                presenter: {
                    id: horse.presenter_id,
                    name: horse.presenter_name,
                },
            }));
    
            return response.json(formattedHorses);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error" });
        }
    }
    
}

module.exports = SearchActiveHorsesController;