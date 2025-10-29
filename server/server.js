import express from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from "cors";
import { userRouter } from './routers/user-routers.js';
import { videoRouter } from './routers/video-routers.js';
import { dbConnect } from "./controllers/connect-db.js";

try{
    dotenv.config();
    const app = express();
    const port = process.env.PORT;
    const host = process.env.HOST || '0.0.0.0';
    await dbConnect();
    const corsOptions = {
      credentials: true,
      origin: ['http://localhost:80','http://localhost:3000', 'http://localhost:4200', 'https://main.d1o769dc8tk9gk.amplifyapp.com/'] // Whitelist allowed origins
    };
    app.disable('x-powered-by');
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use('/api/user',userRouter);
    app.use('/api/video',videoRouter);

    app.listen(port, host, () => {console.log(`Server is running on host: ${host} port: ${port}`);});

}catch(error){
    console.log(error);
}
