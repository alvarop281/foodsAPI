import { connect } from "../db";


export async function selectAllDetailsByOrderId( orderId: string ){
    const conn = await connect();

    const details: any = await conn.query( 'SELECT * FROM details WHERE details.order_id=? ', orderId );
    conn.end();
    
    return details[0];
}