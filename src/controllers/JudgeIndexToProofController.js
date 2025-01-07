const knex = require("../database/knex");

class JudgeIndexToProofController {

    async index(request, response) {
        const { name } = request.query;

        const Users = await knex("users")
        .where("status", "active")
        .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
        .orderBy("name");

        return response.json(Users)
    }
}

module.exports = JudgeIndexToProofController;