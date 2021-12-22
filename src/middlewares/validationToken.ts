import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

// Middlewares
import { failResponse } from "./response";

// Interfaces
import { UPayload } from '../interfaces/UPayload';

export function validationToken(req: Request, res: Response, next: NextFunction){
    const token = req.header('auth-token');
    if(!token) return res.status(401).json(
        failResponse({
            "msg": "Access denied",
            "param": "token",
        })
    )

    try{

        const payload = jwt.verify(token, process.env.TOKEN_SECRET|| 'secretToken') as UPayload;
        req.user = payload.user;

    }catch( err ){

        return res.status(401).json(
            failResponse({
                "msg": "Access denied",
                "param": "token",
            })
        )
        
    }

    next();
}