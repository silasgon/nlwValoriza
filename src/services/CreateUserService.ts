import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { hash } from "bcryptjs";

interface IUserRequest{
    name: string;
    email: string;
    admin?: boolean;
    password: string;
}

class CreateUserService {

    async execute( {name, email, admin = false, password}: IUserRequest){
        
        const usersRepository = getCustomRepository(UsersRepositories);

        //Verifica se o email foi preenchido
        //Se não tiver lança uma exceção de email incorrect
        if (!email) {
            throw new Error("Email incorrect");
        }

        //busca no repository o usuário pelo email
        const userAlreadyExists = await usersRepository.findOne({ 
            email
        });

        //verifica se o usuário existe dispara um error
        if (userAlreadyExists) {
            throw new Error("User already exists");
        }

        //encript o password recebido pelo user;
        const passwordHash = await hash(password, 8);

        //cria uma instancia do objeto user com os atributos que serão inseridos
        const user = usersRepository.create({ 
            name,
            email,
            admin,
            password: passwordHash, 
        })

        //Salva o objeto "user" no repository e depois no BD
        await usersRepository.save(user);

        return user;
    }
}

export { CreateUserService };