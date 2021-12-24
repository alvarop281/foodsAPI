import { Request, Response } from 'express';

// Middleware
import { successResponse, failResponse } from '../middlewares/response';

// Interface
import { AddressI } from '../interfaces/Address';

// Models
import { 
    selectAdrressesByUserId,
    createAAddress,
    selectAdrressesByUserIAndDescriptionAndReference,
    selectAdrressByUserIdAndAddressId
} from '../models/address.model';

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

export async function createAddress( req: Request, res: Response ){
    const userId: string = req.params.userId;
    const newAddress: AddressI = req.body;
    newAddress['user_id']= userId;

    await createAAddress(newAddress)

    const address = await selectAdrressesByUserIAndDescriptionAndReference(userId, newAddress.address, newAddress.reference);

    // Success Response
    return res.status(201).json(
        successResponse( { address }, { message: "Address was created" } )
    )
}

export async function getAddressFromUser( req: Request, res: Response ){
    const userId: string = req.params.userId;
    const addressId: string = req.params.addressId;

    const address: AddressI = await selectAdrressByUserIdAndAddressId( userId, addressId );

    // Fail response
    if(!address) return res.status(401).json(
        failResponse({
            "msg": "Addresses do not exist",
            "param": "userId",
        })
    );

    // Success Response
    return res.status(200).json(
        successResponse( { address }, [] )
    )
}