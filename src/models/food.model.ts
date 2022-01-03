import { connect } from "../db";

// Category Interface
import { FoodI } from '../interfaces/FoodI';

export async function selectAllFoodsByCategoryId( id: string ) {
    const conn = await connect();

    const foods: any = await conn.query( 'SELECT id, title, price, img_1, img_2, description, ingredients, category_id FROM foods WHERE category_id=?', id );
    conn.end();
    
    return foods[0];
}

export async function selectFoodById( id: string ) {
    const conn = await connect();

    const food: any = await conn.query( 'SELECT id, title, price, img_1, img_2, description, ingredients, category_id FROM foods WHERE id=?', id );
    conn.end();
    
    return food[0][0];
}

export async function createAFood( newFood: FoodI ) {
    const conn = await connect();
    await conn.query( 'INSERT INTO foods SET ?', newFood );
    conn.end();
    
    return 0;
}

export async function deleteFoodById( id: string ) {
    const conn = await connect();

    const food: any = await conn.query( 'DELETE FROM foods WHERE id=?', id );
    conn.end();
    
    return 0;
}

export async function updateAFood ( data: any, id: string ){
    const conn = await connect();

    await conn.query('UPDATE foods SET ? WHERE foods.id =?', [data, id]);
    conn.end();

    return 0;
}