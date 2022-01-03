import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Middleware
import { successResponse, failResponse } from '../middlewares/response';

// Interface
import { UserI } from '../interfaces/UserI';

// Models
import { 
    updateAUser,
    selectUserByPhoneAndDNI,
    selectUserDniByDNIAndId,
    selectUserPhoneByPhoneAndId
} from '../models/user.model';

export async function updateUser( req: Request, res: Response ){
    // Save data
    const newUserData: UserI = req.body;
    const id: string = req.params.userId;

    // If request has password, encripted it
    if( newUserData['password'] ){
        newUserData['password'] = bcrypt.hashSync(newUserData.password, 10);
    }

    // Validate if dni was used by another user
    const checkDni: UserI = await selectUserDniByDNIAndId( newUserData.dni, id );
    const checkPhone: UserI = await selectUserPhoneByPhoneAndId( newUserData.phone_number, id );
    
    if ( checkPhone || checkDni ) res.status(401).json(
        failResponse([{
            "msg": "DNI or Phone already used",
            "param": "phone_number or dni",
        }])
    );
    else{
        // Update data
        await updateAUser( newUserData, id );
    
        // Retrieve user_id to update the new token
        const user: UserI = await selectUserByPhoneAndDNI( newUserData.dni, newUserData.phone_number );
        const token: string = jwt.sign( { user }, process.env.TOKEN_SECRET || 'secretToken', {
            expiresIn: 60 * 60 * 24 * 31
        });
    
        // Success Response
        return res.status(200).json(
            successResponse( { user }, [ { message: "User was updated", token }] )
        )
    }
}