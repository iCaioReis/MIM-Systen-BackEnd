const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class PresentersController {
    async create(request, response) {
        const {
            name,
            phone,
            gender,
          
            CPF,
            email,
            born,
          
            address,
            address_number,
            address_neighborhood,
            address_city,
            address_state,
            address_country,
            address_cep,
            address_observation,
          
            pix,
            favored,
            bank,
            account,
            agency
          } = request.body;

        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }

        const [presenterId] = await knex("presenters").insert({
            name,
            phone,
            gender,
          
            CPF,
            email,
            born,
          
            address,
            address_number,
            address_neighborhood,
            address_city,
            address_state,
            address_country,
            address_cep,
            address_observation,
          
            pix,
            favored,
            bank,
            account,
            agency
          }).returning('id');

        return response.status(201).json({ id: presenterId });
    }

    async show(request, response) {
        const { id } = request.params;
        const { last } = request.query;

        let presenter = await knex("presenters").where({ id }).first();

        if (last === "true") {
            presenter = await knex("presenters").orderBy("created_at", "desc").first();
        };

        const Presenter = {...presenter.password = null, ...presenter }

        return response.json({Presenter})
    }

    async index(request, response) {
        const { name } = request.query;

        const Presenters = await knex("presenters")
        .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
        .orderBy("name");

        return response.json({Presenters})
    }

    async update(request, response) {
        const {
            name,
            phone,
            gender,
          
            CPF,
            email,
            born,
          
            address,
            address_number,
            address_neighborhood,
            address_city,
            address_state,
            address_country,
            address_cep,
            address_observation,
          
            pix,
            favored,
            bank,
            account,
            agency
          } = request.body;
        const { id } = request.params;

        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
    
        const presenterUpdated = {
            name,
            phone,
            gender,
          
            CPF,
            email,
            born,
          
            address,
            address_number,
            address_neighborhood,
            address_city,
            address_state,
            address_country,
            address_cep,
            address_observation,
          
            pix,
            favored,
            bank,
            account,
            agency
          };
        
        const presenter = await knex("presenters").where({ id }).first();

        if (!presenter) {
            throw new AppError("Usuário não encontrado!");
        }

        await knex("presenters").update(presenterUpdated).where({ id: id });

        return response.json(presenterUpdated);
    }
}

module.exports = PresentersController;