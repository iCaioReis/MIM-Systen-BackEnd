const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class HorsePresenterEventController {
    async create(request, response) {
        const { presenter_id, horse_id, event_id } = request.body;

        if (!presenter_id) {
            throw new AppError("O campo Competidor é obrigatório.", 400);
        }
        if (!horse_id) {
            throw new AppError("O campo Cavalo é obrigatório.", 400);
        }
        if (!event_id) {
            throw new AppError("Erro ao tentar registrar", 400);
        }

        const horseData = await knex('horses').where({id: horse_id}).first();
       
        const recordAlreadyExists =
            await knex("horsesPresentersEvent")
                .where({
                    horse_id,
                    event_id
                })
                .first();

        if (recordAlreadyExists) {
            throw new AppError("Já existe um registro deste animal neste evento!", 500);
        }

        const [horseId] = await knex("horsesPresentersEvent").insert({ presenter_id, horse_id, event_id, category:`${horseData.gender}-${horseData.march}-${horseData.without_registration}`}).returning('id');

        return response.status(201).json({ id: horseId });
    }

    async show(request, response) {
        const { id } = request.params;
        try {
            const HorsesPresentersEvent = await knex("horsesPresentersEvent as hpe")
                .where({ "hpe.event_id": id })
                .leftJoin("horses as h", "h.id", "hpe.horse_id")
                .leftJoin("presenters as p", "p.id", "hpe.presenter_id")
                .select(
                    "hpe.id",
                    "hpe.event_id",
                    "hpe.vest",
                    "hpe.category",
                    "hpe.result",
                    "hpe.champion_of_champions_result",
                    "hpe.created_at",
                    "hpe.updated_at",
                    "h.id as horse_id",
                    "h.name as horse_name",
                    "h.born as horse_born",
                    "h.gender as horse_gender",
                    "p.id as presenter_id",
                    "p.name as presenter_name"
                )
                .orderBy("h.born", "cres");
    
            const formattedResponse = HorsesPresentersEvent.map(item => ({
                id: item.id,
                event_id: item.event_id,
                horse: {
                    id: item.horse_id,
                    name: item.horse_name,
                    born: item.horse_born,
                    gender: item.horse_gender,
                },
                presenter: {
                    id: item.presenter_id,
                    name: item.presenter_name,
                },
                vest: item.vest,
                category: item.category,
                result: item.result,
                champion_of_champions_result: item.champion_of_champions_result,
                created_at: item.created_at,
                updated_at: item.updated_at,
            }));
    
            return response.status(200).json(formattedResponse);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    async delete(request, response) {
        const { id } = request.params;
    
        try {
            const rowsDeleted = await knex("horsesPresentersEvent").where({ id }).delete();
    
            if (rowsDeleted === 0) {
                return response.status(404).json({ message: "Registro não encontrado." });
            }
    
            return response.status(200).json({ message: "Registro deletado com sucesso." });
        } catch (error) {
            console.error("Erro ao deletar registro:", error);
            return response.status(500).json({ message: "Erro ao deletar registro." });
        }
    }

    async update(request, response) {
        const { id } = request.params;
        const { presenter_id, horse_id, categorie_id } = request.body;

        const register = await knex("horsesPresentersEvent").where({ id }).first();

        if (!presenter_id) {
            throw new AppError("Não foi possível atualizar registro!");
        }

        if (!horse_id) {
            throw new AppError("Não foi possível atualizar registro!");
        }

        if (!register) {
            throw new AppError("Não foi possível atualizar registro!");
        }

        const recordAlreadyExists = await knex("horsesPresentersEvent")
            .where({
                presenter_id,
                horse_id,
                categorie_id: register.categorie_id
            })
            .first();

        const recordHorses = await knex("horsesPresentersEvent")
            .where({
                horse_id,
                categorie_id
            })
        if (recordHorses.length >= 2) {
            throw new AppError("Este cavalo já está registrado em outros dois competidores nesta categoria!", 400);
        }

        if (recordAlreadyExists && recordAlreadyExists.id != id) {
            throw new AppError("Já existe um registro com este competidor e cavalo nesta categoria!", 500);
        }

        await knex("horsesPresentersEvent").update(
            { presenter_id, horse_id }
        ).where({ id: id }).returning('*');

        return response.json(register);
    }
}

module.exports = HorsePresenterEventController;