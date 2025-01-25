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
                    "h.mother as horse_mother",
                    "h.father as horse_father",
                    "h.owner as horse_owner",
                    "h.address as horse_address",
                    "h.farm as horse_farm",
                    "h.gender as horse_gender",
                    "h.name as horse_name",
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
                    category:item.category,
                    event_id: item.event_id,
                    presenter: {
                        id: item.presenter_id,
                        name: item.presenter_name,
                    },
                    horse: {
                        id: item.horse_id,
                        name: item.horse_name,
                        born: item.horse_born,
                        gender: item.horse_gender,
                        mother: item.horse_mother,
                        father: item.horse_father,
                        owner: item.horse_owner,
                        address: item.horse_address,
                        farm: item.horse_farm,
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

        const { updates } = request.body;

        try {
            // Validar entrada
            if (!Array.isArray(updates)) {
                throw new AppError('Dados inválidos. Certifique-se de enviar event_id e updates corretamente.', 400);
            }
            // Verificar se algum registro está sem nota
            const missingNote = updates.some(record => !record.result || record.result.trim() === '');
            if (missingNote) {
                return response.status(400).json({ message: 'Preencha todas as notas.' });
            }

            const event_id = updates[0].event_id

            // Validar que todos os registros possuem o mesmo event_id
            const invalidEventId = updates.some(record => record.event_id !== event_id);
            if (invalidEventId) {
                throw new AppError('Todos os registros devem ter o mesmo event_id.', 400);
            }

            

            // Verificar o status do evento
            const event = await knex('events').where({ id: event_id }).first();

            if (!event) {
                throw new AppError('Evento não encontrado.', 404);
            }

            // Validar o status do evento
            const invalidStatuses = ['making_registrations', 'active', 'inactive'];
            if (invalidStatuses.includes(event.status)) {
                throw new AppError('Operação não autorizada!', 403);
            }

            // Atualizar o status do evento, se necessário
            if (event.status === 'finished_inscriptions') {
                await knex('events').where({ id: event_id }).update({ status: 'running' });
            }

            // Atualizar os registros na tabela `horsesPresentersEvent`
            const updatePromises = updates.map(({ id, result }) => {
                if (!id || result === undefined) {
                    throw new AppError('Cada objeto no array de updates deve conter um id e um campo result.', 400);
                }

                return knex('horsesPresentersEvent')
                    .where({ id })
                    .update({ result, updated_at: knex.fn.now() , champion_of_champions_result: null});
            });

            await Promise.all(updatePromises);

            return response.status(200).json({ message: 'Atualizações realizadas com sucesso!' });

        } catch (error) {
            console.error(error);
            throw new AppError({ error: error.message || 'Erro interno do servidor.' }, 500);
        }
    }
}

module.exports = JudgeHorsePresenterEventController;