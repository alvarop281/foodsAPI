import express, {Application}  from "express";
import morgan from "morgan";
import cors from "cors"

// Route imports
import authRouter from './routes/auth/auth.routes';

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
            //post    http://localhost:3000/foods/api/v1/auth/signin/   Public    Ready
            //post    http://localhost:3000/foods/api/v1/auth/login/    Public    Ready
            //get     http://localhost:3000/foods/api/v1/auth/profile/  Public

    }

    // Listening 
    async listen(){
        await this.app.listen(this.app.get('port'));
        console.log('Server on Port', this.app.get('port'));
    }
}