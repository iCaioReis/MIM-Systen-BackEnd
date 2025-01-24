const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class SaveChampionOfChampions {
    async update(request, response) {

        const { updates } = request.body;

        try {
            // Validar entrada
            if (!Array.isArray(updates)) {
                throw new AppError('Dados inválidos. Certifique-se de enviar event_id e updates corretamente.', 400);
            }
            // Verificar se algum registro está sem nota
            const missingNote = updates.some(record => !record.champion_of_champions_result || record.champion_of_champions_result.trim() === '');
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
            const updatePromises = updates.map(({ id, champion_of_champions_result }) => {
                if (!id || champion_of_champions_result === undefined) {
                    throw new AppError('Cada objeto no array de updates deve conter um id e um campo champion_of_champions_result.', 400);
                }

                return knex('horsesPresentersEvent')
                    .where({ id })
                    .update({ champion_of_champions_result, updated_at: knex.fn.now() });
            });

            await Promise.all(updatePromises);

            return response.status(200).json({ message: 'Atualizações realizadas com sucesso!' });

        } catch (error) {
            console.error(error);
            throw new AppError({ error: error.message || 'Erro interno do servidor.' }, 500);
        }
    }
}

module.exports = SaveChampionOfChampions;