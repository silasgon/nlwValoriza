import { Request, Response, NextFunction} from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload{
    sub: string;
}


export function ensureAuthenticated(request: Request, response: Response, next: NextFunction){

    //Receber o token
    const authToken = request.headers.authorization

    //Validar se o token está preenchido
    if(!authToken){
        return response.status(401).end();
    }

    const [,token] = authToken.split(' ');
 

    //Validar se o token é válido
    try {
        //Validar se o token é válido
        const { sub } = verify(token, "833368b9b2c0c18d898ee1ae0d5d5e39") as IPayload;

        request.user_id = sub;

        return next();
    } catch (err) {
        return response.status(401).end();
    }

    //Recuperar informações do usuário



    return next();
}