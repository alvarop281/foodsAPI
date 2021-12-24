import { Request, Response } from 'express';

// Middleware
import { successResponse, failResponse } from '../middlewares/response';

// Interface
import { AddressI } from '../interfaces/Address';

// Models
import { selectAdrressesByUserId } from '../models/address.model';

export async function getAllAddressFromUser( req: Request, res: Response ){
    const userId: string = req.params.userId;
    const addresses: AddressI[] = await selectAdrressesByUserId( userId );

    // Fail response
    if(!addresses[0]) return res.status(401).json(
        failResponse({
            "msg": "Addresses do not exist",
            "param": "userId",
        })
    );

    // Success Response
    return res.status(200).json(
        successResponse( { addresses }, [] )
    )
}