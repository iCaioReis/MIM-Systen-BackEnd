const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class HorsesController {
    async create(request, response) {
        const {
            status,
            name,
            surname,
            gender,

            without_registration,
            chip,
            register,

            born,

            mother,
            father,
            march,

            presenter_id,

            owner,
            address,
            farm

        } = request.body;

        if (!surname || !name) {
            throw new AppError("Os campos Nome e Apelido são obrigatórios.", 400);
        }
        if (!gender) {
            throw new AppError("O campo Sexo é obrigatório.", 400);
        }
        if (!presenter_id) {
            throw new AppError("O campo Apresentador é obrigatório.", 400);
        }
        
        if (without_registration == false) {
            if (!chip || !register) {
                throw new AppError("Os campos CHIP e Registro são obrigatórios.", 400);
            }
            const horseChipAlreadyRegistered = await knex("horses").where({ chip: chip }).first();

            if (horseChipAlreadyRegistered) {
                throw new AppError("Este CHIP já está cadastrado!", 422);
            }
        }
        if (!born) {
            throw new AppError("O campo Nascimento é obrigatório.", 400);
        }
        if (!march) {
            throw new AppError("O campo Marcha é obrigatório.", 400);
        }
        if (!mother || !father) {
            throw new AppError("Os campos Mãe e Pai do animal são obrigatórios.", 400);
        }
        if (!owner) {
            throw new AppError("O campo Proprietário é obrigatório.", 400);
        }
        if (!address || !farm) {
            throw new AppError("Os campos Endereço e Haras/Fazenda são obrigatórios.", 400);
        }



        const [horseId] = await knex("horses").insert({
            status,
            name,
            surname,
            gender,

            without_registration,
            chip,
            register,

            born,

            mother,
            father,
            march,

            presenter_id,

            owner,
            address,
            farm

        }).returning('id');

        return response.status(201).json({ id: horseId });
    }

    async show(request, response) {
        const { id } = request.params;
        const { last } = request.query;

        let horseQuery = knex("horses")
            .select(
                "horses.*",
                "presenters.id as presenter_id",
                "presenters.name as presenter_name"
            )
            .leftJoin("presenters", "horses.presenter_id", "presenters.id");

        if (last === "true") {
            horseQuery = horseQuery.orderBy("horses.created_at", "desc").first();
        } else {
            horseQuery = horseQuery.where("horses.id", id).first();
        }

        const horse = await horseQuery;

        // Formata os dados do cavalo e do apresentador como objetos aninhados
        if (horse) {
            const Horse = {
                id: horse.id,
                name: horse.name,
                image: horse.image,
                status: horse.status,
                surname: horse.surname,
                gender: horse.gender,
                without_registration: horse.without_registration,
                chip: horse.chip,
                register: horse.register,
                born: horse.born,
                mother: horse.mother,
                father: horse.father,
                march: horse.march,
                presenter_id: horse.presenter_id,
                owner: horse.owner,
                address: horse.address,
                farm: horse.farm,
                created_at: horse.created_at,

                // inclua os campos do cavalo
                presenter: {
                    id: horse.presenter_id,
                    name: horse.presenter_name,
                    // inclua outros campos do presenter se necessário
                }
            };

            return response.json({ Horse });
        }
        // Caso o cavalo não seja encontrado
        return response.status(404).json({ error: "Horse not found" });
    }

    async index(request, response) {
        const { name } = request.query;

        const Horses = await knex("horses")
            .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
            .orderBy("name");

        return response.json({ Horses })
    }

    async update(request, response) {
        const {
            status,
            name,
            surname,
            gender,

            without_registration,
            chip,
            register,

            born,

            mother,
            father,
            march,

            presenter_id,

            owner,
            address,
            farm

        } = request.body;

        if (!surname || !name) {
            throw new AppError("Os campos Nome e Apelido são obrigatórios.", 400);
        }
        if (!gender) {
            throw new AppError("O campo Sexo é obrigatório.", 400);
        }
        if (!presenter_id) {
            throw new AppError("O campo Apresentador é obrigatório.", 400);
        }
        if (without_registration == false) {
            if (!chip || !register) {
                throw new AppError("Os campos CHIP e Registro são obrigatórios.", 400);
            }
        }
        if (!born) {
            throw new AppError("O campo Nascimento é obrigatório.", 400);
        }
        if (!march) {
            throw new AppError("O campo Marcha é obrigatório.", 400);
        }
        if (!mother || !father) {
            throw new AppError("Os campos Mãe e Pai do animal são obrigatórios.", 400);
        }
        if (!owner) {
            throw new AppError("O campo Proprietário é obrigatório.", 400);
        }
        if (!address || !farm) {
            throw new AppError("Os campos Endereço e Haras/Fazenda são obrigatórios.", 400);
        }

        const horseUpdated = {
            status,
            name,
            surname,
            gender,

            without_registration,
            chip,
            register,

            born,

            mother,
            father,
            march,

            presenter_id,

            owner,
            address,
            farm
        };

        const { id } = request.params;

        const horse = await knex("horses").where({ id }).first();

        const horseChipAlreadyRegistered = await knex("horses").where({ chip }).first();

        if (!horse) {
            throw new AppError("Cavalo não encontrado!");
        };

        if (horseChipAlreadyRegistered && horseChipAlreadyRegistered.id != id) {
            throw new AppError("Este CHIP já está cadastrado!", 422);
        }

        await knex("horses").update(horseUpdated).where({ id: id });

        return response.json(horseUpdated);
    }

    async delete(request, response) {
        const { id } = request.params;

        const res = await knex("horses").where({ id }).delete();

        return response.json();
    }
}

module.exports = HorsesController;