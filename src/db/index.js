import mongoose from "mongoose";
import dotenv from 'dotenv'
import { userModel } from "../models/user.model.js";
import { accountModel } from "../models/account.model.js";

dotenv.config({
  path: './.env'
})

const DBConnection = async ()=>{
    try {
        const db = await mongoose.connect( process.env.MONGO_URI || "");
        console.log("Database has been connected")
        

    } catch (error) {
      console.log("ERROR IN MONGODB CONNECTION !! "+error.message);
      process.exit(1)
    }
};

export {DBConnection}
