import jwt from 'jsonwebtoken';
import { ErrorResponse } from "../utils/errorResponse.js";
import { userModel } from "../models/user.model.js";
import multer from 'multer';
import crypto from 'crypto'
import { getPublicImageURL, updateImageOnSupabase, uploadImageOnSupabase } from "../utils/uploadImageToSupabase.js";
import { tempInitialRegistrationModel } from "../models/tempForInitialRegistration.model.js";
import { sendOTPMail } from "../utils/mailer.js";
import { generateOTP } from "../utils/generateOTP.js";
import { forgetPasswordText, loginOTPText, registrationText } from "../mailTemplates.js";
import bcrypt from 'bcryptjs'
import {tempForLoginModel } from "../models/tempForLogin.model.js";
import { tempForForgetPasswordModel } from '../models/tempForForgetPassword.model.js';
import { accountModel } from '../models/account.model.js';
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
      password
    } = req.body;

    const checkUserExist = await userModel.findOne({email:email});
    
    if(checkUserExist)
      throw new ErrorResponse("Email is already in used",400);

    // Check if all required fields are provided
    if (!username || !email || !mobileNumber || !role || !address || !password) {
      throw new ErrorResponse("Please provide all the required fields",400);
    }

    // Create a new user instance with the provided data
    
    let OTP = await generateOTP();

      OTP = OTP.toUpperCase();
      console.log(OTP);

    console.log("OTP FOR INITIAL REGISTRATION : ",OTP);

    const data = {
      text : registrationText,
      otp:OTP,
      subject:"OTP FOR REGISTRATION PROCESS",
      email:email
    }

    const result = await sendOTPMail(data);
    
    if(!result)
      throw new ErrorResponse("FAILED TO SEND OTP",500);

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = await tempInitialRegistrationModel.create({
      username,
      email,
      mobileNumber,
      address,
      role,
      password:hashedPassword,
      OTP:OTP
    });

    console.log("TEMP INITIAL REGISTERED USERRRR  :", newUser);

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
    
         
         if(!imagePath)
          throw new ErrorResponse("PICTURE ALREADY EXIST",400);
         
         const publicPath = await getPublicImageURL('AdhaarCard-Pictures',imagePath.path);



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
     
        const{userObjectID , pan,dob} = req.body;
      
        const checkPanCardDuplication = await userModel.findOne({pan:pan});

        if(checkPanCardDuplication)
          throw new ErrorResponse("Pan card number already in used",400);

        if (!userObjectID || !pan || !dob) {
            throw new ErrorResponse("Please provide adhaar and userObjectID",400);
          }   

          if(!req.file)
            throw new ErrorResponse("PLEASE UPLOAD PAN CARD PICTURE . PICTURE IS MISSING",400);


        const newUser = await userModel.findById(userObjectID);

        if(!newUser)
          throw new ErrorResponse("USER IS NOT IN THE DATABASE . MUST COMPLETE INTIAL REGISTRATION BEFORE THIS STEP",400);


        const path = `${newUser.username}:${newUser._id}`

        const imagePath =  await uploadImageOnSupabase(req.file,path,'PanCard-Pictures');

    
        if(!imagePath.path)
          throw new ErrorResponse("Error uplaoding image in supabase",400);

        console.log(imagePath.path);

        const publicPath = await getPublicImageURL('PanCard-Pictures',imagePath.path);

    console.log(publicPath);

        if(!publicPath)
         throw new ErrorResponse("Error occured in getting the PAN Card picture public url from supabase",500);

        
        newUser.pan = pan;
        
        newUser.PanCardPicture = publicPath;

        newUser.dob = new Date(dob);

        await newUser.save();

        // await userModel.updateOne(
        //   { _id: userObjectID }, // Filter: specify the user ID or other identifier
        //   {
        //     $set: {
        //       pan: pan,
        //       PanCardPicture: publicPath,
        //       dob: new Date(dob),
        //     }
        //   }
        // );
        


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


        if(!path)
          throw new ErrorResponse("picture already exist",400);


        const imagePath =  await uploadImageOnSupabase(req.file,path,'IncomeProof-Pictures');

        if(imagePath.message)  
          throw new ErrorResponse("Picture already exist",400);

        const publicPath = await getPublicImageURL('IncomeProof-Pictures',imagePath.path);

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

        if(!imagePath.path)
          throw new ErrorResponse("Resource already exist",400)

        const publicPath = await getPublicImageURL('Signature-Picture',imagePath.path);

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

       const publicPath = await getPublicImageURL('Profile-Pictures',imagePath.path);

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
        
        const{email,otp} = req.body;

        console.log(req.body);

        if(!email || !otp)
          throw new ErrorResponse("email OR OTP is missing",400);          

        const findUser = await tempInitialRegistrationModel.findOne({email:email});

        if(!findUser)
          throw new ErrorResponse("USER NOT FOUND",404);          

        if(!(findUser.OTP === otp)){
            await tempInitialRegistrationModel.deleteOne({email:email});
          throw new ErrorResponse("OTP NOT MATCHED",400); 
        }         


        const newUser = await userModel.create({
          username:findUser.username,
          mobileNumber:findUser.mobileNumber,
          email:findUser.email,
          address:findUser.address,
          role:findUser.role,
          password:findUser.password
        });

        await tempInitialRegistrationModel.deleteOne({email:email});

        return res.status(201).json({
          message: 'User Initial Regisration has been completed!',
          user: {username:newUser.username,userObjectID:newUser._id.toString()},
        });

      } catch (err) {
        next(err);
      }

}


const userLoginStep1 = async(req,res,next)=>{

  try {
    const {userZID,password} = req.body;

    console.log(req.body);
  
    if(!userZID || !password)
        throw new ErrorResponse("Login Credential missing",400);

    const user= await userModel.findOne({userZID:userZID});

  console.log(user);

    if(!user)
      throw new ErrorResponse("User not found",404);

      console.log(user.password);
      
    const passIsCorrect = await bcrypt.compare(password,user.password);

    console.log(passIsCorrect);

    if(!passIsCorrect)
      throw new ErrorResponse("Incorrect Password",400);

    const OTP = await generateOTP();

    const result = await sendOTPMail({text:loginOTPText,otp:OTP,email:user.email,subject:"Login OTP"});

    if(!result)
      throw new ErrorResponse("FAILED TO SEND OTP",500);

    await tempForLoginModel.create({
          userZID:userZID,
          OTP:OTP
    });

    return res.status(201).json({
      message: 'LOGIN OTP HAS BEEN SENT SUCCESSFULLY!'
    });


  } catch (err) {
    next(err);
  }


}




const userLoginStep2 = async(req,res,next)=>{

  try {
    const {userZID,OTP} = req.body;
  
      console.log(req.body);

    if(!userZID || !OTP)
        throw new ErrorResponse("OTP OR USERZID IS MISSING",400);
    
    
    const findUser = await tempForLoginModel.findOne({userZID:userZID});

      if(!findUser)
        throw new ErrorResponse("User credentials are missing USERZID not found",400);

      if(!(findUser.OTP === OTP)){
        await tempForLoginModel.deleteOne({userZID:userZID});
        throw new ErrorResponse("OTP NOT MATCHED",400);          
      }


        const detailedUser = await userModel.findOne({userZID:userZID});
    
      // const token = await jwt.sign({username:detailedUser.username,userRole:detailedUser.role,userZID:detailedUser.userZID}, process.env.JWT_SECRET_KEY);

      const token = await jwt.sign(
        {
          username: detailedUser.username,
          userRole: detailedUser.role,
          userZID: detailedUser.userZID,
          userObjectID : detailedUser._id.toString()
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' } // Set the token to expire in 1 hour
      );
      
        
      await tempForLoginModel.deleteOne({userZID:userZID});

        res.cookie('token', token, {
         httpOnly: true,
     });

     return res.status(200).json({message:"Access token has been set",token, userData:{username:detailedUser.username,userRole:detailedUser.role,userZID:detailedUser.userZID,userObjectID:detailedUser._id.toString()}});

       
  } catch (err) {
    next(err);
  }


};

const userLogout = async(req,res,next)=>{
  try{

           if(!req.user)
              throw new ErrorResponse('User is not logged in or authenticated',400);

             // Clear the token from the cookie
             res.clearCookie('token', {
              httpOnly: true
          });
  
          // Send response confirming logout
          return res.status(200).json({ message: "You have successfully logged out." });


  }catch(err){
     next(err);
  }
};


const forgetPasswordStep1 = async(req,res,next)=>{

    try {
      const {userZID} = req.body;
  
      const findUser = await userModel.findOne({userZID:userZID});
  
      if(!findUser)
        throw new ErrorResponse("User not found or wrong user ID",404);
  
      const OTP = await generateOTP();
  
       const result = await sendOTPMail({text:forgetPasswordText,email:findUser.email,otp:OTP,subject:"FORGET PASSWORD OTP"});
       
       if(!result)
        throw new ErrorResponse("Failed to send OTP email",500);
  
       await tempForForgetPasswordModel.create({
        userZID:userZID,
        OTP:OTP
       });

       return res.status(200).json({message:"OTP HAS BEEN SENT"});

    } catch (err) {
      next(err);
    }
   
};


const forgetPasswordStep2 = async(req,res,next)=>{

  try {
    const {userZID,OTP,newPassword} = req.body;

      if(!userZID || !OTP || !newPassword)
        throw new ErrorResponse("Request body data is missing some field",400);

    const isOTPCorrect = await tempForForgetPasswordModel.findOne({ userZID: userZID, OTP: OTP });

    if(!isOTPCorrect){
      await tempForForgetPasswordModel.deleteOne({userZID:userZID});
      throw new ErrorResponse("OTP NOT MATCHED",400);
    }

      const hashedPassword = await bcrypt.hash(newPassword,10);

      const user = await userModel.findOne({userZID:userZID});

      user.password = hashedPassword;

      await user.save();

    return res.status(200).json({message:"Password has been changed successfully"});

  } catch (err) {
    next(err);
  }
 
};


const verifyAdhaar = async(req,res,next)=>{
  try {
        console.log("inside verify adhaar");

      const {userObjectID,adhaar} = req.body;

      console.log(req.body);

     if(!userObjectID || !adhaar)
        throw new ErrorResponse("UserObjectID or adhaar is missing",400);   

     const user = await userModel.findById(userObjectID);

     if(!user) 
      throw new ErrorResponse("User not found",400);
    
     if(user.aadhaar !== adhaar)
      throw new ErrorResponse("Adhaar Card Number is not matched with the previous Adhaar Card Number you have provided",400);

     return res.status(200).json({message:"Adhaar Card Number has been verified"});

  } catch (err) {
    next(err);
  }
}


const insertBankAccountInfo = async(req,res,next)=>{

  try {
    
      const {bankDetails,userObjectID} = req.body;

      if(!bankDetails || !userObjectID)
        throw new ErrorResponse("bankDetails Object OR userObjectID is missing",400);

        const userBio = await userModel.findById(userObjectID);



      const data = await accountModel.create({
        bankDetails:bankDetails,
        user:userObjectID,
        incomeProof:userBio.incomeProof
      });

      console.log(data);

      return res.status(200).json({message:"Bank Info has been successfully inserted"});

  } catch (err) {
    next(err);
  }


};


const updateUserProfileDetails = async(req,res,next)=>{
  try {
    
      if(!req.user)
          throw new ErrorResponse("User is not logged in ",400);

       const {userDetailsObject} = req.body; 

       const user = await userModel.findById(req.user.userObjectID);

      


  } catch (err) {
    next(err);
  }
};


const getUser = async(req,res,next)=>{
  try {
    
      if(!req.user)
          throw new ErrorResponse("User is not logged in ",400);

      const user = await userModel.findById(req.user.userObjectID).select('username email mobileNumber userZID profilePhoto');

      if(!user)
        throw new ErrorResponse("User not found",404); 

      return res.status(200).json({message:'user has been fetched succesfully',user:user});

  } catch (err) {
    next(err);
  }
};


const getUserByID = async(req,res,next)=>{
  try {
    
      const {userObjectID} = req.body;

    if(!userObjectID)
      throw new ErrorResponse("userObjectID is missing",400);

      if(!req.user)
          throw new ErrorResponse("User is not logged in ",400);

      const user = await userModel.findById(userObjectID).select('username email mobileNumber userZID profilePhoto');

      if(!user)
        throw new ErrorResponse("User not found",404); 

      return res.status(200).json({message:'user has been fetched succesfully',user:user});

  } catch (err) {
    next(err);
  }

};




export{
    registerUserStep1,
    updateAdhaar,
    uploadProfilePicture,
    updatePan,
    updateIncomeProof,
    updateSignature,
    updateProfilePicture,
    finalizeIntitialRegistration,
    userLoginStep1,
    userLoginStep2,
    userLogout,
    forgetPasswordStep1,
    verifyAdhaar,
    insertBankAccountInfo,
    forgetPasswordStep2,
    getUser,
    getUserByID
};
