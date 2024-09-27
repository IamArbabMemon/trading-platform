import { ErrorResponse } from "../utils/errorResponse.js";
import { userModel } from "../models/user.model.js";
import multer from 'multer';
import { uploadImageOnSupabase } from "../utils/uploadImageToSupabase.js";

// Controller for registering a new user
const registerUserStep1 = async (req, res, next) => {
  try {
    // Destructure the fields from the request body
    const {
      username,
      email,
      mobileNumber,
      address,
      role,
    } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !mobileNumber || !role || !address) {
      throw new ErrorResponse("Please provide all the required fields",400);
    }

    // Create a new user instance with the provided data
    const newUser = await userModel.create({
      username,
      email,
      mobileNumber,
      address,
      role
    });



    
    // Send a success response with the saved user data
    return res.status(201).json({
      message: 'User registered successfully!',
      user: {username:newUser.username,userObjectID:newUser._id},
    });
  } catch (error) {
    // If there are validation errors or other issues, pass them to the error handler middleware
    next(error);
  }
};


const updateAdhaar = async (req, res, next) => {
    try {
      // Destructure the fields from the request body
     
        const{userObjectID , adhaar} = req.body;
      
        if (!userObjectID || !adhaar) {
            throw new ErrorResponse("Please provide adhaar and userObjectID",400);
          }   


          if(!req.file)
            throw new ErrorResponse("PLEASE UPLOAD ADHAAR CARD PICTURE . PICTURE IS MISSING",400);
    
          const newUser = await userModel.findById(userObjectID);
    
          if(!newUser)
            throw new ErrorResponse("USER IS NOT IN THE DATABASE . MUST COMPLETE INTIAL REGISTRATION BEFORE THIS STEP",400);


          const path = `${newUser.username}:${newUser._id}`

         const imagePath =  await uploadImageOnSupabase(req.file,path,'Adhaar-Card-Pictures');
    
         console.log(imagePath);
          
        newUser.aadhaar = adhaar;
        newUser.AdhaarCardPicture = imagePath.fullPath;

        await newUser.save();
      // Send a success response with the saved user data
      return res.status(201).json({
        message: 'User registered successfully!',
        user: {username:newUser.username,userObjectID:newUser._id},
      });

    } catch (error) {
      // If there are validation errors or other issues, pass them to the error handler middleware
      next(error);
    }

  };
  

  const updatePan = async (req, res, next) => {
    try {
      // Destructure the fields from the request body
     
        const{userObjectID , pan} = req.body;
      
        if (!userObjectID || !pan) {
            throw new ErrorResponse("Please provide adhaar and userObjectID",400);
          }   

        const newUser = await userModel.findById(userObjectID);

        newUser.pan = pan;

        await newUser.save();
      // Send a success response with the saved user data
      return res.status(201).json({
        message: 'User registered successfully!',
        user: {username:newUser.username,userObjectID:newUser._id},
      });

    } catch (error) {
      // If there are validation errors or other issues, pass them to the error handler middleware
      next(error);
    }
    
  };




  
  const uploadProfilePicture = async(req,res,next)=>{

    
     try{
      if(!req.file)
        throw new ErrorResponse("PLEASE UPLOAD PROFILE PICTURE . PICTURE IS MISSING",400);

      const path = `Humdan:87942101`

     const imagePath =  await uploadImageOnSupabase(req.file,path,'Profile-Pictures');

     console.log(imagePath);

      return res.json({imagePath});

     }catch(err){
        next(err);
     }
     
  }



export{
    registerUserStep1,
    updateAdhaar,
    uploadProfilePicture,
    updatePan
};
