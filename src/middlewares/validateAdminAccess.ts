import {Request, Response, NextFunction} from 'express';

// Interfaces
import { UserI } from '../interfaces/UserI';

// Model
import { selectTypeOfUserById } from '../models/user.model';

// Middleware
import { failResponse } from "./response";

export async function adminAccess( req: Request, res: Response, next: NextFunction ){
    const userReq: UserI = req.user;
    const type_of_user: string = await selectTypeOfUserById( userReq.id );

    if ( type_of_user === 'buyer' ) return res.status(401).json(
        failResponse([{
            "msg": "Unauthorized access",
            "param": "User",
        }])
    )

    if ( type_of_user === 'admin' ) return next();

    return res.status(401).json(
        failResponse([{
            "msg": "Unauthorized access",
            "param": "Unauthorized",
        }])
    )

}