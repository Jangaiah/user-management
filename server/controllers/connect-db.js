import mongoose from "mongoose";

export async function  dbConnect(){
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to DB with server port:',process.env.PORT);
}
