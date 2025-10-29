import * as fs from 'fs';
// import { errorHandler } from './error-handler.js'

export const getVideo = async (req, res) => {
    try{
        const { fileName } = req.params;
        res.writeHead(200, { "Content-Type": "video/mp4" });
        fs.createReadStream(`videos/${fileName}`).pipe(res);
    }
    catch(error){
        // errorHandler(error)
        console.log('Error: ',error);
    }
}
