import { tempInitialRegistrationModel } from "./src/models/tempForInitialRegistration.model.js";
import mongoose from "mongoose";
(

    async()=>{
        const db = await mongoose.connect( process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Mangal_Keshav_trading"); 
        const user = await tempInitialRegistrationModel.create({
            username:"memon",
            mobileNumber:"7513208000",
            email:"arbabmemon88@gmail.com",
         })
         

        const userID = user._id;
        console.log(userID.toString());
                 
    }

)();