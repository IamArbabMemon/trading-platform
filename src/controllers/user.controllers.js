import { ErrorResponse } from "../utils/errorResponse.js";
import { userModel } from "../models/user.model.js";
import multer from 'multer';
import crypto from 'crypto'
import { getPublicImageURL, updateImageOnSupabase, uploadImageOnSupabase } from "../utils/uploadImageToSupabase.js";
import { tempInitialRegistrationModel } from "../models/tempForInitialRegistration.model.js";
import { sendOTPMail } from "../utils/mailer.js";
import { generateOTP } from "../utils/generateOTP.js";
import { registrationText } from "../mailTemplates.js";

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
    
    const OTP = await generateOTP();

    console.log(OTP);

    const newUser = await tempInitialRegistrationModel.create({
      username,
      email,
      mobileNumber,
      address,
      role,
      OTP:OTP
    });


    const data = {
      text : registrationText,
      otp:OTP,
      subject:"OTP FOR REGISTRATION PROCESS",
      email:email
    }

    const result = await sendOTPMail(data);
    
    if(!result)
      throw new ErrorResponse("FAILED TO SEND OTP",500);

       // Send a success response with the saved user data
    return res.status(201).json({
      message: 'OTP HAS BEEN SENT SUCCESSFULLY!'
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

         const imagePath =  await uploadImageOnSupabase(req.file,path,'AdhaarCard-Pictures');
    
         const publicPath = await getPublicImageURL('AdhaarCard-Pictures',imagePath);

         if(!publicPath)
          throw new ErrorResponse("Error occured in getting the Adhaar Card picture public url from supabase",500);
  
         console.log(imagePath);
          
        newUser.aadhaar = adhaar;
        newUser.AdhaarCardPicture = publicPath;

        await newUser.save();
      // Send a success response with the saved user data
      return res.status(201).json({
        message: 'User Adhaar Card Info has been inserted successfully!',
        user: {username:newUser.username,userObjectID:newUser._id.toString()},
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

          if(!req.file)
            throw new ErrorResponse("PLEASE UPLOAD PAN CARD PICTURE . PICTURE IS MISSING",400);


        const newUser = await userModel.findById(userObjectID);

        if(!newUser)
          throw new ErrorResponse("USER IS NOT IN THE DATABASE . MUST COMPLETE INTIAL REGISTRATION BEFORE THIS STEP",400);


        const path = `${newUser.username}:${newUser._id}`

        const imagePath =  await uploadImageOnSupabase(req.file,path,'PanCard-Pictures');

    
        const publicPath = await getPublicImageURL('PanCard-Pictures',imagePath);

        if(!publicPath)
         throw new ErrorResponse("Error occured in getting the PAN Card picture public url from supabase",500);

        
        newUser.pan = pan;
        
        newUser.PanCardPicture = publicPath;

        await newUser.save();
      // Send a success response with the saved user data
      return res.status(201).json({
        message: 'User Pan Card info has been inserted succesfully!',
        user: {username:newUser.username,userObjectID:newUser._id.toString()},
      });

    } catch (error) {
      // If there are validation errors or other issues, pass them to the error handler middleware
      next(error);
    }
    
  };


  const updateIncomeProof = async (req, res, next) => {
    try {
      // Destructure the fields from the request body
     
        const{userObjectID} = req.body;
      
        if (!userObjectID) {
            throw new ErrorResponse("Please provide adhaar and userObjectID",400);
          }   

          if(!req.file)
            throw new ErrorResponse("PLEASE UPLOAD PAN CARD PICTURE . PICTURE IS MISSING",400);


        const newUser = await userModel.findById(userObjectID);

        if(!newUser)
          throw new ErrorResponse("USER IS NOT IN THE DATABASE . MUST COMPLETE INTIAL REGISTRATION BEFORE THIS STEP",400);


        const path = `${newUser.username}:${newUser._id}`

        const imagePath =  await uploadImageOnSupabase(req.file,path,'IncomeProof-Pictures');

        const publicPath = await getPublicImageURL('IncomeProof-Pictures',imagePath);

        if(!publicPath)
         throw new ErrorResponse("Error occured in getting the Income Proof picture public url from supabase",500);


        newUser.incomeProof = publicPath;

        await newUser.save();
      // Send a success response with the saved user data
      return res.status(201).json({
        message: 'User Income proof picture has been inserted succesfully!',
        user: {username:newUser.username,userObjectID:newUser._id.toString()},
      });

    } catch (error) {
      // If there are validation errors or other issues, pass them to the error handler middleware
      next(error);
    }
    
  };


  const updateSignature = async (req, res, next) => {
    try {
      // Destructure the fields from the request body
     
        const{userObjectID} = req.body;
      
        if (!userObjectID) {
            throw new ErrorResponse("Please provide adhaar and userObjectID",400);
          }   

          if(!req.file)
            throw new ErrorResponse("PLEASE UPLOAD PAN CARD PICTURE . PICTURE IS MISSING",400);


        const newUser = await userModel.findById(userObjectID);

        if(!newUser)
          throw new ErrorResponse("USER IS NOT IN THE DATABASE . MUST COMPLETE INTIAL REGISTRATION BEFORE THIS STEP",400);


        const path = `${newUser.username}:${newUser._id}`

        const imagePath =  await uploadImageOnSupabase(req.file,path,'Signature-Picture');

        const publicPath = await getPublicImageURL('Signature-Picture',imagePath);

        if(!publicPath)
         throw new ErrorResponse("Error occured in getting the Signature picture public url from supabase",500);


        newUser.signature = publicPath;

        await newUser.save();
      // Send a success response with the saved user data
      return res.status(201).json({
        message: 'User Signature picture has been inserted succesfully!',
        user: {username:newUser.username,userObjectID:newUser._id.toString()},
      });

    } catch (error) {
      // If there are validation errors or other issues, pass them to the error handler middleware
      next(error);
    }
    
  };


  const uploadProfilePicture = async(req,res,next)=>{

     try{
    
      const {userObjectID} = req.body;
      
       if(!userObjectID) 
        throw new ErrorResponse("User ObjectID missing",400);

      if(!req.file)
        throw new ErrorResponse("PLEASE UPLOAD PROFILE PICTURE . PICTURE IS MISSING",400);

      const newUser = await userModel.findById(userObjectID);

      const path = `${newUser.username}:${newUser._id}`

      const imagePath =  await uploadImageOnSupabase(req.file,path,'Profile-Pictures');

       console.log(imagePath); 

       const publicPath = await getPublicImageURL('Profile-Pictures',imagePath);

       if(!publicPath)
        throw new ErrorResponse("Error occured in getting the proflie picutere public url from supabase",500);


      newUser.profilePhoto = publicPath;

      await newUser.save();

      return res.status(201).json({
        message: 'User Profile picture has been updated!',
        user: {username:newUser.username,userObjectID:newUser._id.toString()},
      });

     }catch(err){
        next(err);
     }
     
  }


  const updateProfilePicture = async(req,res,next)=>{

    try{
   
     const {userObjectID} = req.body;
     
      if(!userObjectID) 
       throw new ErrorResponse("User ObjectID missing",400);

     if(!req.file)
       throw new ErrorResponse("PLEASE UPLOAD PROFILE PICTURE . PICTURE IS MISSING",400);

     const newUser = await userModel.findById(userObjectID);

     const path = newUser.profilePhoto;

     const imagePath =  await updateImageOnSupabase(req.file,path,'Profile-Pictures');

    console.log(imagePath);

    //  newUser.profilePhoto = imagePath.path;

    //  await newUser.save();

     return res.status(201).json({
       message: 'User Profile picture has been updated!',
       user: {username:newUser.username,userObjectID:newUser._id.toString()},
     });

    }catch(err){
       next(err);
    }
    
 }

const finalizeIntitialRegistration = async(req,res,next)=>{

      try {
        
        const{email,OTP} = req.body;

        if(!email || !OTP)
          throw new ErrorResponse("email OR OTP is missing",400);          

        const findUser = await tempInitialRegistrationModel.findOne({email:email});

        if(!findUser)
          throw new ErrorResponse("USER NOT FOUND",404);          

        if(!(findUser.OTP === OTP))
          throw new ErrorResponse("OTP NOT MATCHED",400);          

        const newUser = await userModel.create({
          username:findUser.username,
          mobileNumber:findUser.mobileNumber,
          email:findUser.email,
          address:findUser.address,
          role:findUser.role
        });

        await tempInitialRegistrationModel.deleteOne({email:email});

        return res.status(201).json({
          message: 'User Initial Regisration has been completed!',
          user: {username:newUser.username,userObjectID:newUser._id.toString()},
        });

      } catch (error) {
        
      }

}


export{
    registerUserStep1,
    updateAdhaar,
    uploadProfilePicture,
    updatePan,
    updateIncomeProof,
    updateSignature,
    updateProfilePicture,
    finalizeIntitialRegistration
};
