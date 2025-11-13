import mongoose from "mongoose";
import { env } from '../config/config.js';

export async function  dbConnect(){
    await mongoose.connect(env.db_url);
    console.log('Connected to DB with server port:', env.port);
}
