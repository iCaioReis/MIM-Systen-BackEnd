const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class JudgeHorsePresenterEventController {
    async show(request, response) {
        const { id } = request.params;
    
        // Ordem fixa das subcategorias
        const subCategoryOrder = [
            'mare-beat-0',
            'mare-beat-1',
            'mare-shredded-0',
            'mare-shredded-1',
            'castrated-beat-0',
            'castrated-beat-1',
            'castrated-shredded-0',
            'castrated-shredded-1',
            'stallion-beat-0',
            'stallion-beat-1',
            'stallion-shredded-0',
            'stallion-shredded-1',
        ];
    
        try {
            const HorsesPresentersEvent = await knex("horsesPresentersEvent as hpe")
                .where({ "hpe.event_id": id })
                .leftJoin("presenters as p", "p.id", "hpe.presenter_id")
                .leftJoin("horses as h", "h.id", "hpe.horse_id")
                .select(
                    "hpe.id",
                    "hpe.event_id",
                    "hpe.vest",
                    "hpe.category",
                    "hpe.sub_category",
                    "hpe.result",
                    "hpe.champion_of_champions_result",
                    "hpe.created_at",
                    "hpe.updated_at",
                    "h.id as horse_id",
                    "h.born as horse_born",
                    "h.gender as horse_gender",
                    "p.id as presenter_id",
                    "p.name as presenter_name"
                )
                .orderBy("hpe.category", "asc");
    
            const formattedResponse = HorsesPresentersEvent.reduce((acc, item) => {
                // Find the category
                let category = acc.find(cat => cat.category === item.category);
                if (!category) {
                    category = { 
                        category: item.category, 
                        dataCategory: [] 
                    };
                    acc.push(category);
                }
    
                // Find the sub-category
                let subCategory = category.dataCategory.find(sub => sub.subCategory === item.sub_category);
                if (!subCategory) {
                    subCategory = { 
                        subCategory: item.sub_category, 
                        dataSubCategory: [] 
                    };
                    category.dataCategory.push(subCategory);
                }
    
                // Add the item to the sub-category
                subCategory.dataSubCategory.push({
                    id: item.id,
                    event_id: item.event_id,
                    presenter: {
                        id: item.presenter_id,
                        name: item.presenter_name,
                    },
                    horse: {
                        id: item.horse_id,
                        born: item.horse_born,
                        gender: item.horse_gender,
                    },
                    vest: item.vest,
                    result: item.result,
                    champion_of_champions_result: item.champion_of_champions_result,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                });
    
                // Sort the dataSubCategory by vest
                subCategory.dataSubCategory.sort((a, b) => {
                    if (a.vest < b.vest) return -1;
                    if (a.vest > b.vest) return 1;
                    return 0;
                });
    
                return acc;
            }, []);
    
            // Sort sub-categories by the fixed order and calculate status
            formattedResponse.forEach(category => {
                category.dataCategory.sort((a, b) => {
                    const indexA = subCategoryOrder.indexOf(a.subCategory);
                    const indexB = subCategoryOrder.indexOf(b.subCategory);
                    return indexA - indexB;
                });
    
                category.dataCategory.forEach(subCategory => {
                    const total = subCategory.dataSubCategory.length;
                    const completed = subCategory.dataSubCategory.filter(item => item.result !== null).length;
    
                    if (completed === 0) {
                        subCategory.status = "active";
                    } else if (completed < total) {
                        subCategory.status = "running";
                    } else {
                        subCategory.status = "finished";
                    }
                });
            });
    
            return response.status(200).json(formattedResponse);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error" });
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

module.exports = JudgeHorsePresenterEventController;