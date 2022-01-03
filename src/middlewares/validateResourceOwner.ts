import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';

// Middelware
import { failResponse } from './response';

// Interface
import { UserI } from '../interfaces/UserI';

export function validateResourceOwner(req: Request, res: Response, next: NextFunction){
    // Save request data
    const id: any = req.params.userId;
    const userReq: UserI = req.user;

    if ( userReq.id != id ) return res.status(403).json(
        failResponse([{
            "msg": "Unauthorized access",
            "param": "userId",
        }])
    )

    next();
}