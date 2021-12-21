import dotenv from 'dotenv';
dotenv.config();

import { App } from "./app";

async function main(){
    const app = new App(3000);
    await app.listen();
}

main();