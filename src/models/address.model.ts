import { connect } from "../db";

// Interface
import { AddressI } from "../interfaces/Address";

export async function selectAdrressesByUserId( userId: string ){
    const conn = await connect();

    const categories: any = await conn.query( 'SELECT id, address, reference, user_id FROM addresses WHERE addresses.user_id=?', userId );
    conn.end();
    
    return categories[0];
}

export async function createAAddress( newAddress: AddressI ){
    const conn = await connect();

    await conn.query( 'INSERT INTO addresses SET ?', newAddress );
    conn.end();
    return 0;
}


export async function selectAdrressesByUserIAndDescriptionAndReference( userId: string, address: string, reference: string ){
    const conn = await connect();

    const categories: any = await conn.query( 'SELECT id, address, reference, user_id FROM addresses WHERE addresses.user_id=? AND addresses.address = ? AND addresses.reference =?', [ userId, address, reference ] );
    conn.end();
    
    return categories[0][0];
}

export async function selectAdrressByUserIdAndAddressId( userId: string, addressId: string ){
    const conn = await connect();

    const category: any = await conn.query( 'SELECT id, address, reference, user_id FROM addresses WHERE addresses.user_id=? AND addresses.id=?', [userId, addressId] );
    conn.end();
    
    return category[0][0];
}


export async function updateAddressById( data: any, id: string ){
    const conn = await connect();

    await conn.query('UPDATE addresses SET ? WHERE addresses.id =?', [data, id]);
    conn.end();

    return 0;
}

export async function deleteAdrressById( addressId: string ){
    const conn = await connect();
    await conn.query( 'DELETE FROM addresses WHERE addresses.id=? ',  addressId );
    conn.end();
    
    return 0;
}