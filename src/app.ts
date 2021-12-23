import express, {Application}  from "express";
import morgan from "morgan";
import cors from "cors"

// Route imports
import authRouter from './routes/auth/auth.routes';
import categoryRouter from './routes/categories/categories.routes';

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
    }

    // Routes
    routes(){

        // Auth
        this.app.use('/foods/api/v1/auth', authRouter);
            //post    http://localhost:3000/foods/api/v1/auth/signin/       Public
            //post    http://localhost:3000/foods/api/v1/auth/login/        Public
            //get     http://localhost:3000/foods/api/v1/auth/profile/      Public

        this.app.use('/foods/api/v1/categories', categoryRouter)
            //get     http://localhost:3000/foods/api/v1/categories/        Public
            //get     http://localhost:3000/foods/api/v1/categories/:id     Public
            //post    http://localhost:3000/foods/api/v1/categories/:id     Only admin
            //put     http://localhost:3000/foods/api/v1/categories/:id     Only admin
            //delete  http://localhost:3000/foods/api/v1/categories/:id     Only admin
    }

    // Listening 
    async listen(){
        await this.app.listen(this.app.get('port'));
        console.log('Server on Port', this.app.get('port'));
    }
}