import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import multer from 'multer'
import { ErrorResponse } from './errorResponse.js';
dotenv.config({path:'./.env'});

let supabase;
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    
if(supabaseUrl && supabaseKey)
 supabase = createClient(supabaseUrl, supabaseKey);

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5 MB (in bytes)
});


const uploadImageOnSupabase = async(imageFile,path,bucketName)=>{

try {
    const { buffer, originalname, mimetype } = imageFile; // Retrieve buffer, name, and content type
    

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) throw new ErrorResponse(error.message,500);

    // Check if the specified bucket (basket) exists
    const existingBucket = buckets.find((bucket) => bucket.name === bucketName);

    if(!existingBucket){
        const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: false, // Set to false to keep the bucket private (only accessible through API)
          });

          console.log(newBucket);

        if(createError)
            throw new ErrorResponse(error.message,500);  
    }


    // Upload image to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucketName) // Name of your storage bucket in Supabase
      .upload(`${path}/${originalname}`, buffer, {
        contentType: mimetype, // Set the content type
        upsert: false, // Do not overwrite existing file with the same name
      });

    if (error) throw new ErrorResponse(error.message,500);

    return data;

  } catch (error) {
    console.log('Error uploading video:', error.message);
}
  

}

  export {
    uploadImageOnSupabase
  }