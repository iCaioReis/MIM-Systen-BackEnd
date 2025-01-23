const knex = require("../database/knex");
const AppError = require("../utils/AppError");

// Função sliceByCategory que você forneceu
function sliceByCategory(data) {
  const categories = {
    'castrated-shredded-0': [], // CASTRADO MARCHA PICADA COM REGISTRO

    'stallion-shredded-1': [], // CAVALO MARCHA PICADA SEM REGISTRO

    'stallion-foal': [], // POTRO CONTROLADO DE MARCHA PICADA

    'stallion-shredded-0': [], // CAVALO MARCHA PICADA COM REGISTRO

    'mare-shredded-1': [], // ÉGUA MARCHA PICADA SEM REGISTRO

    'mare-foal': [], // POTRA CONTROLADA DE MARCHA PICADA

    'mare-shredded-0': [], // ÉGUA MARCHA PICADA COM REGISTRO

    'castrated-shredded-1': [], // CASTRADO MARCHA PICADA SEM REGISTRO

    // MARCHA BATIDA

    'mare-beat-0': [],
    'mare-beat-1': [],

    'castrated-beat-0': [],
    'castrated-beat-1': [],

    'stallion-beat-0': [],
    'stallion-beat-1': [],
  }

  // Popula as categorias
  data.forEach((item) => {
    const categoryKey = item.category;
    categories[categoryKey].push(item);
  });

  // Ordena as categorias
  Object.keys(categories).forEach((category) => {
    categories[category].sort((a, b) => {
      const dateA = new Date(a.horse.born);
      const dateB = new Date(b.horse.born);
      return dateB - dateA; // Mais novo para o mais velho
    });
  });

  // Atribui subcategorias
  Object.keys(categories).forEach((category) => {
    const total = categories[category].length;

    if (total <= 13) {
      categories[category].forEach((obj) => (obj.sub_category = '0'));
    } else if (total <= 20) {
      const metade = Math.ceil(total / 2);
      categories[category].forEach((obj, index) => {
        obj.sub_category = index < metade ? '0' : '1';
      });
    } else {
      // Ajuste para divisão em 3 partes
      const base = Math.floor(total / 3);
      const remainder = total % 3;

      const sizeFirst = base + (remainder > 0 ? 1 : 0);
      const sizeSecond = base + (remainder > 1 ? 1 : 0);

      categories[category].forEach((obj, index) => {
        if (index < sizeFirst) {
          obj.sub_category = '0';
        } else if (index < sizeFirst + sizeSecond) {
          obj.sub_category = '1';
        } else {
          obj.sub_category = '2';
        }
      });
    }
  });

  let currentNumber = 1;
  Object.keys(categories).forEach((category) => {
    categories[category].forEach((obj) => {
      obj.vest = currentNumber++;
    });
  });

  return categories;
}

class EventsController {

  async update(request, response) {
    const { id } = request.params;
  

    // Busca o evento pelo ID
    const event = await knex("events").where({ id }).first();

    if (!event) {
      throw new AppError("Evento não encontrado!");
    }

    // Busca todos os registros na tabela horsesPresentersEvent com o event_id
    let horsesPresenters

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

        horsesPresenters = formattedResponse
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
    }

    if (!horsesPresenters.length) {
      throw new AppError("Não há registros associados a este evento.");
    }

    // Processa os dados com a função sliceByCategory
    const processedData = sliceByCategory(horsesPresenters);

    // Agora, para atualizar os registros, percorremos o processedData
    for (const category in processedData) {
      for (const item of processedData[category]) {
        await knex("horsesPresentersEvent")
          .where({ id: item.id }) // Assumindo que há um campo 'id' na tabela
          .update({
            sub_category: item.sub_category,
            vest: item.vest,
          });
      }
    }

    // Atualizando o status do evento
    await knex("events").update({ status: "finished_inscriptions" }).where({ id: id });

    return response.status(201).json({ id });
  }
}

module.exports = EventsController;
