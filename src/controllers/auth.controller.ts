import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Interface User
import { UserI } from '../interfaces/UserI';

// Model User
import { createUser, 
         selectUserByPhoneAndDNI, 
         selectUserByDNI,
         selectUserByPhone,
         selectUserById } from "../models/user.model";

// Middleware
import { successResponse, failResponse } from '../middlewares/response';

// Create User
export async function signin(req: Request, res: Response): Promise<Response> {
    // Save request data
    const newUser: UserI = req.body;
    newUser['type_of_user'] = 'buyer';
    newUser['password'] = bcrypt.hashSync(newUser.password, 10);

    // Check if ID or phone were used
    let oldDni: UserI = await selectUserByDNI( newUser.dni );
    let oldPhone: UserI = await selectUserByPhone( newUser.phone_number );
    // Fail response
    if(oldDni || oldPhone) 
        return res.status(401).json(
            failResponse({
                "msg": "DNI or phone_number already used",
                "param": "phone_number or dni",
            })
        );

    // Use user model
    await createUser( newUser );

    // Retrieve user_id to create the token
    const user: UserI = await selectUserByPhoneAndDNI( newUser.dni, newUser.phone_number );
    const token: string = jwt.sign( { user }, process.env.TOKEN_SECRET || 'secretToken', {
        expiresIn: 60 * 60 * 24 * 31
    });

    // Success Response
    return res.status(201).json(
        successResponse( { user }, { message: "User Created", token } )
    )
}

export async function login( req: Request, res: Response ) {
    const phone_number = req.body.phone_number;

    try{
        const findUser: UserI = await selectUserByPhone( phone_number );
        const passwordCredential = findUser.password;

        // Compare password
        const isValid = await bcrypt.compare(req.body.password, passwordCredential);
        if(!isValid) return res.status(401).json(
            failResponse({
                "msg": "Invalid password",
                "param": "password",
            })
        )

        // Retrieve user_id to create the token
        const user: UserI = await selectUserByPhoneAndDNI( findUser.dni, findUser.phone_number );
        const token: string = jwt.sign({user}, process.env.TOKEN_SECRET|| 'secretToken', {
            expiresIn: 60 * 60 * 24 * 31
        });

        // Success Response
        return res.status(200).json(
            successResponse( { user }, { token } )
        )

        
    }catch( err ){
        return res.status(401).json(
            failResponse({
                "msg": "Invalid phone number",
                "param": "phone_number",
            })
        )
    }

}

export async function profile(req: Request, res: Response): Promise<Response>{
    // Save request data
    const userReq: any = req.user;
    const id = userReq.id;
    // User model
    const user = await selectUserById(id);

    // Success Response
    return res.status(200).json(
        successResponse( { user }, [] )
    )
}