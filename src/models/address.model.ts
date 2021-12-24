import { connect } from "../db";

// Interface
import { AddressI } from "../interfaces/Address";

export async function selectAdrressesByUserId( userId: string ){
    const conn = await connect();

    const categories: any = await conn.query( 'SELECT * FROM addresses WHERE addresses.user_id=?', userId );
    conn.end();
    
    return categories[0];
}