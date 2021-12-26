import { connect } from "../db";

// Interface
import { OrdersI } from "../interfaces/OrderI";

export async function createAAddress( newOrder: OrdersI ){
    const conn = await connect();

    await conn.query( 'INSERT INTO orders SET ?', newOrder );
    conn.end();
    return 0;
}

export async function selectActiveOrderByUserId( userId: string ){
    const conn = await connect();

    const order: any = await conn.query( 'SELECT * FROM orders WHERE orders.user_id=? AND orders.status = "active"', userId );
    conn.end();
    
    return order[0][0];
}

export async function selectAllOrderByUserId( userId: string ){
    const conn = await connect();

    const orders: any = await conn.query( 'SELECT * FROM orders WHERE orders.user_id=? ', userId );
    conn.end();
    
    return orders[0];
}

export async function selectOrderByOrderId( id: string ){
    const conn = await connect();

    const order: any = await conn.query( 'SELECT * FROM orders WHERE orders.id=? ', id );
    conn.end();
    
    return order[0][0];
}

export async function updateOrderById( data: any, id: string ){
    const conn = await connect();

    await conn.query('UPDATE orders SET ? WHERE orders.id =?', [data, id]);
    conn.end();

    return 0;
}