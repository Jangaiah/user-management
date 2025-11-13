import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { env } from './config/config.js';
import { userRouter } from './routers/user-routers.js';
import { videoRouter } from './routers/video-routers.js';
import { dbConnect } from "./controllers/connect-db.js";
import { mfaRouter } from "./routers/mfa-router.js";

try{
    const app = express();
    const port = env.port || 3000;
    const host = env.host || '0.0.0.0';
    await dbConnect();
    const corsOptions = {
      credentials: true,
      origin: ['http://localhost:80','http://localhost:3000', 'http://localhost:4200', 'http://kingjangaiah.com'] // Whitelist allowed origins
    };
    app.disable('x-powered-by');
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use('/api/user',userRouter);
    app.use('/api/mfa',mfaRouter);
    app.use('/api/video',videoRouter);

    app.listen(port, host, () => {console.log(`Server is running on host: ${host} port: ${port}`);});

}catch(error){
    console.log(error);
}
