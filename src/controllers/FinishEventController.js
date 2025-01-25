const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class FinishEventController {

  async update(request, response) {
    const { id } = request.params;
  
    const event = await knex("events").where({ id }).first();

    if (!event) {
      throw new AppError("Evento não encontrado!");
    }

    const HorsesPresentersEvent = await knex("horsesPresentersEvent").where({ "event_id": id })


    await knex("events").update({ status: "finished" }).where({ id: id });

    return response.status(201).json({ id });
  }
}

module.exports = FinishEventController;
