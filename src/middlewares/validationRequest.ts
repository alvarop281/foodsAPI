import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';

export function validationRequest(req: Request, res: Response, next: NextFunction){
    // Check for errors in the request
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    next();
}