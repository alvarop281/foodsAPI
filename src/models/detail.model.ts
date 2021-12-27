import { connect } from "../db";

// Interface
import { DetailI } from '../interfaces/DetailI';

export async function selectAllDetailsByOrderId( orderId: string ){
    const conn = await connect();

    const details: any = await conn.query( 'SELECT * FROM details WHERE details.order_id=? ', orderId );
    conn.end();
    
    return details[0];
}

export async function selectDetailByOrderIdAndFoodId( orderId: string, foodId: string ){
    const conn = await connect();

    const detail: any = await conn.query( 'SELECT id, ordered_quantity, unit_price, total_by_product, food_id, order_id FROM details WHERE details.order_id=? AND details.food_id =?', [ orderId, foodId ] );
    conn.end();
    
    return detail[0][0];
}

export async function createADetail( newDetail: DetailI ){
    const conn = await connect();

    await conn.query( 'INSERT INTO details SET ?', newDetail );
    conn.end();
    return 0;
}

export async function selectDetailByOrderIdAndId( orderId: string, id: string ){
    const conn = await connect();

    const detail: any = await conn.query( 'SELECT id, ordered_quantity, unit_price, total_by_product, food_id, order_id FROM details WHERE details.order_id=? AND details.id =?', [ orderId, id ] );
    conn.end();
    
    return detail[0][0];
}

export async function updateDetailById( data: any, id: string ){
    const conn = await connect();

    await conn.query('UPDATE details SET ? WHERE details.id =?', [data, id]);
    conn.end();

    return 0;
}

export async function deleteDetailById( id: string ){
    const conn = await connect();

    await conn.query( 'DELETE FROM details WHERE details.id =?', id );
    conn.end();
    
    return 0;
}