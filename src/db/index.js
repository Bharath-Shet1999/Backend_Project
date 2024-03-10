import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const DB_CONNECT = async () => {
    try{
    console.log('connecting to DB',`${process.env.MONGODB_URI}/${DB_NAME}`)
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`Connection Instanced \n DB HOST: ${connectionInstance.connection.host}`)
    }catch(err){
        console.log("Error connecting to the DB: ", err)
        process.exit(1)
    }
}

export default DB_CONNECT