import express, {Application}  from "express";
import morgan from "morgan";
import cors from "cors";
import upload from 'express-fileupload';

// Route imports
import authRouter from './routes/auth/auth.routes';
import categoryRouter from './routes/categories/categories.routes';
import foodRouter from './routes/foods/foods.routes';
import userRouter from './routes/users/users.routes';

export class App{
    private app: Application;

    constructor ( private port?: number | string ){
        this.app = express();
        this.settings();
        this.middleware();
        this.routes();
    }

    // Settings
    settings(){
        // Set port number, by default port 3000
        this.app.set( 'port', this.port || process.env.PORT || 3000 );
    }

    // Middleware
    middleware(){
        this.app.use( morgan('dev') );
        this.app.use( cors() );            // Allows cors
        this.app.use( express.json() );    // Allows to receive form data in json format
        this.app.use( upload({
            createParentPath: true,
            limits: {
                fileSize: 2 * 1024 * 1024 * 1024        //2MB max
            }
        }) );            //Upload file
    }

    // Routes
    routes(){

        // Auth
        this.app.use('/foods/api/v1/auth', authRouter);
            //post    http://localhost:3000/foods/api/v1/auth/signin/           Public
            //post    http://localhost:3000/foods/api/v1/auth/login/            Public
            //get     http://localhost:3000/foods/api/v1/auth/profile/          Public

        this.app.use('/foods/api/v1/categories', categoryRouter);
            //get     http://localhost:3000/foods/api/v1/categories/            Public
            //post    http://localhost:3000/foods/api/v1/categories/            Only admin
            //get     http://localhost:3000/foods/api/v1/categories/:id         Public
            //put     http://localhost:3000/foods/api/v1/categories/:id         Only admin
            //delete  http://localhost:3000/foods/api/v1/categories/:id         Only admin
            //get     http://localhost:3000/foods/api/v1/categories/:id/foods/  Public
            //post    http://localhost:3000/foods/api/v1/categories/:id/foods/  Only admin

        this.app.use('/foods/api/v1/foods', foodRouter)
            //get     http://localhost:3000/foods/api/v1/foods/:id              Public
            //put     http://localhost:3000/foods/api/v1/foods/:id              Only admin
            //delete  http://localhost:3000/foods/api/v1/foods/:id              Only admin

        this.app.use('/foods/api/v1/users', userRouter);
            //put     http://localhost:3000/foods/api/v1/users/:id              Only the owner
            //get     http://localhost:3000/foods/api/v1/users/:id/addresses/   Only the owner
    }

    // Listening 
    async listen(){
        await this.app.listen(this.app.get('port'));
        console.log('Server on Port', this.app.get('port'));
    }
}