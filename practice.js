import { tempInitialRegistrationModel } from "./src/models/tempForInitialRegistration.model.js";
import mongoose from "mongoose";

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
dotenv.config({path:'./.env'});

let supabase;
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    
if(supabaseUrl && supabaseKey)
 supabase = createClient(supabaseUrl, supabaseKey);

(

    async()=>{
        // const db = await mongoose.connect( process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Mangal_Keshav_trading"); 
        // const user = await tempInitialRegistrationModel.create({
        //     username:"memon",
        //     mobileNumber:"7513208000",
        //     email:"arbabmemon88@gmail.com",
        //  })
            
            // const result = await supabase.storage.from('Profile-Pictures').getPublicUrl('arbabmemon:6587/filename.PNG');
            // console.log(result.data.publicUrl);

            // const {result,Error} = await supabase.storage.from('Profile-Pictures').getPublicUrl('arbabmemon:6587/filename.PNG');
            // console.log(result);
            // console.log(result.publicUrl);






            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const file = await fs.readFile(path.join(__dirname,'./mypic.PNG'))
            const pathh = `arbabmemon:6587`
            const bucketName = 'Profile-Pictures'
            const originalName ="filename"

            const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) console.log(listError)

    // Check if the specified bucket (basket) exists
    const existingBucket = buckets.find((bucket) => bucket.name === bucketName);

    if(!existingBucket){
        const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true, // Set to false to keep the bucket private (only accessible through API)
          });

          console.log(newBucket);

        if(createError)
            console.log(createError)
    }


//    Upload image to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucketName) // Name of your storage bucket in Supabase
      .upload(`${pathh}/${originalName}.PNG`, file, {
          contentType: 'image/png', // Set the content type
        upsert: false, // Do not overwrite existing file with the same name
      });

      console.log(data.path)
      console.log(data);

      if(error){
        console.log(error);
        console.log("error occured")
      }


      const result = await supabase.storage.from('Profile-Pictures').getPublicUrl(data.path);
            console.log(result.data.publicUrl);


      // setTimeout(async()=>{

      //   const {result,Error} = await supabase.storage.from('Profile-Pictures').getPublicUrl(data.path);
      //   console.log(result);
      //   console.log(result.publicUrl);

      // },60000);

      



//     if (Errror) console.log(Errror);



        // const userID = user._id;
        // console.log(userID.toString());
                 
    }

)();