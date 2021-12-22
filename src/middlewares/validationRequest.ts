import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';

import { failResponse } from './response';

export function validationRequest(req: Request, res: Response, next: NextFunction){
    // Check for errors in the request
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json(
            failResponse( errors.array() )
        );
    }

    next();
}