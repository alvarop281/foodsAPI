import { connect } from "../db";

// Category Interface
import { CategoryI } from "../interfaces/CategoryI";

export async function selectAllCategories() {
    const conn = await connect();

    const categories: any = await conn.query( 'SELECT * FROM categories' );
    conn.end();
    
    return categories[0];
}

export async function selectCategoryById( id: string ){
    const conn = await connect();

    const category: any = await conn.query( 'SELECT * FROM categories WHERE categories.id=?', id );
    conn.end();
    
    return category[0][0];
}

export async function createACategory( newCategory: CategoryI ){
    const conn = await connect();

    const category: any = await conn.query( 'INSERT INTO categories SET ?', newCategory );
    conn.end();

    return 0;
}

export async function selectCategoryByDescriptionAndIcon( description: string, icon: string ){
    const conn = await connect();

    const category: any = await conn.query( 'SELECT * FROM categories WHERE categories.description=? AND categories.icon=?', [ description, icon ] );
    conn.end();
    
    return category[0][0];
}

export async function updateCategoryById( data: any, id: string ){
    const conn = await connect();

    await conn.query('UPDATE categories SET ? WHERE categories.id =?', [data, id]);
    conn.end();

    return 0;
}


export async function deleteCategoryById( id: string ){
    const conn = await connect();

    const category: any = await conn.query( 'DELETE FROM categories WHERE categories.id=?', id );
    conn.end();
    
    return 0;
}