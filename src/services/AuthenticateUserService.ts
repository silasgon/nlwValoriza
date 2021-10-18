import { getCustomRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UsersRepositories } from "../repositories/UsersRepositories";


interface IAuthenticateRequest{
    email: string;
    password: string;
}

class AuthenticateUserService {

    async execute({email, password}: IAuthenticateRequest) {
        const usersRepositories = getCustomRepository(UsersRepositories)

        //Verrifica se email existe
        const user = await usersRepositories.findOne({ email });

        if (!user) {
            throw new Error("Email/Password incorrect!")
        }

        //Verifica se senha existe
        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error("Email/Password incorrect!")
        }
        
        //Gerar token
        const token = sign({
            email: user.email
        },"833368b9b2c0c18d898ee1ae0d5d5e39",{
            subject: user.id, 
            expiresIn: "1d"
        });

        return token;
        
    }
}

export { AuthenticateUserService };