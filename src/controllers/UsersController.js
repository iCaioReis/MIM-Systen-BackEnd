const knex = require("../database/knex");
const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersController {
    async create(request, response) {
        const { 
            name, 
            phone, 
            gender, 
            CPF, 
            email, 
            born, 
            login, 
            password,
            password_confirm,
            role, 
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
            agency, 
            account 
        } = request.body;

        if(password_confirm !== password){
            throw new AppError("As senhas não conferem!.", 400);
        }
        if (!login || !password) {
            throw new AppError("Os campos Login e senha são obrigatórios.", 400);
        }
        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
    
        const checkUserExists = await knex("users").where({ login: login });

        if (checkUserExists.length > 0) {
            throw new AppError("Este Login já está em uso.");
        }

        const hashedPassword = await hash(password, 8);

        const [userId] = await knex("users").insert({ 
            name, 
            phone, 
            gender, 
            CPF, 
            email, 
            born, 
            login, 
            password: hashedPassword, 
            role, 
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
            agency, 
            account 
        }).returning('id');

        return response.status(201).json({ id: userId });
    }

    async show(request, response) {
        const { id } = request.params;
        const { last } = request.query;

        let user = await knex("users").where({ id }).first();

        if (last === "true") {
            user = await knex("users").orderBy("created_at", "desc").first();
        };

        const User = {...user.password = null, ...user }

        return response.json({User})
    }

    async index(request, response) {
        const { name } = request.query;

        const users = await knex("users")
        .whereLike("name", `%${name.replace(/\s/g, '%')}%`)
        .orderBy("name");

        const Users = users.map(user => {
            const userWithoutPassword = user;

            userWithoutPassword.password = null;

            return(userWithoutPassword)
        })

        return response.json({Users})
    }

    async update(request, response) {
        const { 
            status,
            name, 
            phone, 
            gender, 
            CPF, 
            email, 
            born, 
            login, 
            password,
            password_confirm,
            role, 
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
            agency, 
            account 
        } = request.body;

        if (!login) {
            throw new AppError("O campo Login é obrigatório.", 400);
        }
        if (!name) {
            throw new AppError("O campo Nome é obrigatório.", 400);
        }
    
        const userUpdated = { 
            status,
            name, 
            phone, 
            gender, 
            CPF, 
            email, 
            born, 
            login, 
            password,
            role, 
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
            agency, 
            account 
        };
        const { id } = request.params;

        const user = await knex("users").where({ id }).first();

        if (!password){
            userUpdated.password = user.password;
        } else {
            if(password_confirm !== password){
                throw new AppError("As senhas não conferem!.", 400);
            }

            userUpdated.password = await hash(password, 8);
        }

        if (!user) {
            throw new AppError("Usuário não encontrado!");
        }

        const checkLoginExists = await knex("users").where({ login }).first();

        if (checkLoginExists && checkLoginExists.id !== user.id) {
            throw new AppError("Login já cadastrado!");
        }

        await knex("users").update(userUpdated).where({ id: id });

        return response.json(userUpdated);
    }
}

module.exports = UsersController;