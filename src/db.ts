import { createPool } from "mysql2/promise";

export async function connect(){
    const connection = await createPool ({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DB,
        connectionLimit: 10
    });
}