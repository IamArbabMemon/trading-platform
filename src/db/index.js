import mongoose from "mongoose";

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
