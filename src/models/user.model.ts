import { connect } from "../db";

// User Interface
import { UserI } from "../interfaces/UserI";

export async function createUser( newUser: UserI ){
    const conn = await connect();

    await conn.query( 'INSERT INTO users SET ?', newUser );
    conn.end();

    return 0;
}

export async function selectUserByPhoneAndDNI(  dni: string, phone: string ){
    const conn = await connect();

    const user: any = await conn.query( 'SELECT id, full_name, dni, phone_number FROM users WHERE users.dni = ? AND users.phone_number = ?', [dni, phone] )
    conn.end();
    
    return user[0][0];
}

export async function selectUserByDNI( dni: string ){
    const conn = await connect();

    const user: any = await conn.query( 'SELECT * FROM users WHERE users.dni = ?', dni )
    conn.end();
    
    return user[0][0];
}

export async function selectUserByPhone( phone: string ){
    const conn = await connect();

    const user: any = await conn.query( 'SELECT * FROM users WHERE users.phone_number = ?', phone )
    conn.end();
    
    return user[0][0];
}