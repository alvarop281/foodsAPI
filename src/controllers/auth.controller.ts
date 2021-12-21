import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Interface User
import { UserI } from '../interfaces/UserI';

// Model User
import { createUser, 
         selectUserByPhoneAndDNI, 
         selectUserByDNI } from "../models/user.model";

// Create User
export async function signin(req: Request, res: Response): Promise<Response> {
    // save data
    const newUser: UserI = req.body;
    newUser['type_of_user'] = 'buyer';
    newUser['password'] = bcrypt.hashSync(newUser.password, 10);

    let oldDni: UserI = await selectUserByDNI( newUser.dni );
    if(oldDni) return res.status(401).json({ error: 'Access denied'});
    let oldPhone: UserI = await selectUserByDNI( newUser.phone_number );
    if(oldPhone) return res.status(401).json({ error: 'Access denied'});

    // Use user model
    await createUser( newUser );

    // Retrieve user_id to create the token
    const user: UserI = await selectUserByPhoneAndDNI(newUser.phone_number, newUser.dni);
    const token: string = jwt.sign( { user }, process.env.TOKEN_SECRET || 'secretToken', {
        expiresIn: 60 * 60 * 24 * 31
    });

    // Success Response
    return res.json({
        message: "User Created",
        token
    })
}