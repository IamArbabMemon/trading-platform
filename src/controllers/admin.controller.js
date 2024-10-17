import { accountActivationEmailText, accountFreezeEmailText, forgetPasswordText, loginOTPText, rejectionEmailText } from "../mailTemplates.js";
import jwt from 'jsonwebtoken';
import { adminModel } from "../models/admin.model.js";
import { tempForForgetPasswordAdminModel } from "../models/tempForForgetPasswordAdmin.model.js";
import { tempForLoginAdminModel } from "../models/tempForLoginAdmin.model.js";
import { userModel } from "../models/user.model.js";
import { ErrorResponse } from "../utils/errorResponse.js"
import { getUserZID } from "../utils/generateUserZID.js";
import bcrypt from 'bcryptjs';
import { generateOTP } from "../utils/generateOTP.js";
import { sendAccountActivationMail, sendAccountFreezeMail, sendOTPMail, sendRejectionMail, sendWelcomeMail } from "../utils/mailer.js";



const getAllUsers = async(req,res,next)=>{
    try {
        console.log(req.user.userRole);
        if(!req.user)
            throw new ErrorResponse("User is not logged in ",400);

        // if(req.user.userRole!=='admin' || req.user.userRole!=='moderator')
            if(req.user.userRole==='user')
            throw new ErrorResponse("User do not have admin rights to get all users",400);

        const allUsers =  await userModel.aggregate([
          {
            $match: {
              role:'user'
            }
          },
          {
            $lookup: {
              from: "accounts", // The name of the collection to join with
              localField: "account", // Field from the User collection
              foreignField: "_id", // Field from the Account collection
              as: "accountDetails" // Output field for account details
            }
          },
          {
            $unwind: {
              path: "$accountDetails",
              preserveNullAndEmptyArrays: true // Preserve users with no matching account
            }
          },
          {
            $unwind: {
              path: "$accountDetails.bankDetails", // Unwind the bankDetails array (if it's an array)
              preserveNullAndEmptyArrays: true // In case bankDetails is empty or null
            }
          },
          {
            $project: {
              username: 1,
              email: 1,
              mobileNumber: 1,
              address: 1,
              kycStatus: 1,
              status: 1,
              role: 1,
              profilePhoto: 1,
              profileLocalPath: 1,
              signature: 1,
              aadhaar: 1,
              pan: 1,
              // Include all the fields from accountDetails, including bankDetails
              "accountDetails._id": 1,
              "accountDetails.user": 1,
              "accountDetails.incomeProof": 1,
              "accountDetails.role": 1,
              "accountDetails.createdAt": 1,
              "accountDetails.updatedAt": 1,
              "accountDetails.bankDetails.bankName": 1,      // Project bankName from bankDetails
              "accountDetails.bankDetails.accountNumber": 1, // Project accountNumber from bankDetails
              "accountDetails.bankDetails.ifsc": 1,          // Project ifsc from bankDetails
              "accountDetails.bankDetails.micrCode": 1,      // Project micrCode from bankDetails
              "accountDetails.bankDetails.branchName": 1     // Project branchName from bankDetails
            }
          }
        ]);

        return res.status(200).json(allUsers);


    } catch (err) {
        next(err);
    }
};


const getUsers = async(req,res,next)=>{
    try {

      if(!req.user)
        throw new ErrorResponse("admin is not logged in ",400);

        if(req.user.userRole==='user')
        throw new ErrorResponse("User do not have admin rights to get all users",400);


        let {kycStatus} = req.query;
        let {status} = req.query;
        
        if(!kycStatus)
              kycStatus = 'pending';  

        if(!status)
            status = "active"
        
            const users =  await userModel.aggregate([
                  {
                    $match: {
                      $and: [
                        { kycStatus: kycStatus },
                        { status: status } // Match users based on kycStatus
                        // Additional conditions can be passed in here
                      ]
                    }
                  },
                  {
                    $lookup: {
                      from: "accounts", // The name of the collection to join with
                      localField: "account", // Field from the User collection
                      foreignField: "_id", // Field from the Account collection
                      as: "accountDetails" // Output field for account details
                    }
                  },
                  {
                    $unwind: {
                      path: "$accountDetails",
                      preserveNullAndEmptyArrays: true // Preserve users with no matching account
                    }
                  },
                  {
                    $unwind: {
                      path: "$accountDetails.bankDetails", // Unwind the bankDetails array (if it's an array)
                      preserveNullAndEmptyArrays: true // In case bankDetails is empty or null
                    }
                  },
                  {
                    $project: {
                      username: 1,
                      email: 1,
                      mobileNumber: 1,
                      address: 1,
                      kycStatus: 1,
                      status: 1,
                      role: 1,
                      profilePhoto: 1,
                      profileLocalPath: 1,
                      signature: 1,
                      aadhaar: 1,
                      pan: 1,
                      // Include all the fields from accountDetails, including bankDetails
                      "accountDetails._id": 1,
                      "accountDetails.user": 1,
                      "accountDetails.incomeProof": 1,
                      "accountDetails.role": 1,
                      "accountDetails.createdAt": 1,
                      "accountDetails.updatedAt": 1,
                      "accountDetails.bankDetails.bankName": 1,      // Project bankName from bankDetails
                      "accountDetails.bankDetails.accountNumber": 1, // Project accountNumber from bankDetails
                      "accountDetails.bankDetails.ifsc": 1,          // Project ifsc from bankDetails
                      "accountDetails.bankDetails.micrCode": 1,      // Project micrCode from bankDetails
                      "accountDetails.bankDetails.branchName": 1     // Project branchName from bankDetails
                    }
                  }
                ]);
        
        console.log(users);
            
        return res.status(200).json(users);

    } catch (err) {
        next(err)
    }
}




const getUsersByKYC = async(req,res,next)=>{
  try {

    if(!req.user)
      throw new ErrorResponse("admin is not logged in ",400);

      if(req.user.userRole==='user')
      throw new ErrorResponse("User do not have admin rights to get all users",400);

    let {kycStatus} = req.query;
        
        if(!kycStatus){
            kycStatus = 'pending';
          }
      
  
          const users =  await userModel.aggregate([
                {
                  $match: {
                    kycStatus: kycStatus 
                      // Match users based on kycStatus
                      // Additional conditions can be passed in here
                  }
                },
                {
                  $lookup: {
                    from: "accounts", // The name of the collection to join with
                    localField: "account", // Field from the User collection
                    foreignField: "_id", // Field from the Account collection
                    as: "accountDetails" // Output field for account details
                  }
                },
                {
                  $unwind: {
                    path: "$accountDetails",
                    preserveNullAndEmptyArrays: true // Preserve users with no matching account
                  }
                },
                {
                  $unwind: {
                    path: "$accountDetails.bankDetails", // Unwind the bankDetails array (if it's an array)
                    preserveNullAndEmptyArrays: true // In case bankDetails is empty or null
                  }
                },
                {
                  $project: {
                    username: 1,
                    email: 1,
                    mobileNumber: 1,
                    address: 1,
                    kycStatus: 1,
                    status: 1,
                    role: 1,
                    profilePhoto: 1,
                    profileLocalPath: 1,
                    signature: 1,
                    aadhaar: 1,
                    pan: 1,
                    // Include all the fields from accountDetails, including bankDetails
                    "accountDetails._id": 1,
                    "accountDetails.user": 1,
                    "accountDetails.incomeProof": 1,
                    "accountDetails.role": 1,
                    "accountDetails.createdAt": 1,
                    "accountDetails.updatedAt": 1,
                    "accountDetails.bankDetails.bankName": 1,      // Project bankName from bankDetails
                    "accountDetails.bankDetails.accountNumber": 1, // Project accountNumber from bankDetails
                    "accountDetails.bankDetails.ifsc": 1,          // Project ifsc from bankDetails
                    "accountDetails.bankDetails.micrCode": 1,      // Project micrCode from bankDetails
                    "accountDetails.bankDetails.branchName": 1     // Project branchName from bankDetails
                  }
                }
              ]);
      
      console.log(users);
          
      return res.status(200).json(users);

  } catch (err) {
      next(err)
  }
}


const getUsersByStatus = async(req,res,next)=>{
  try {

    if(!req.user)
      throw new ErrorResponse("admin is not logged in ",400);
      
      if(req.user.userRole==='user')
      throw new ErrorResponse("User do not have admin rights to get all users",400);


      let {status} = req.query;
        
        if(!status){
            status = 'active';
          }
      
  
          const users =  await userModel.aggregate([
                {
                  $match: {
                    status: status 
                      // Match users based on kycStatus
                      // Additional conditions can be passed in here
                  }
                },
                {
                  $lookup: {
                    from: "accounts", // The name of the collection to join with
                    localField: "account", // Field from the User collection
                    foreignField: "_id", // Field from the Account collection
                    as: "accountDetails" // Output field for account details
                  }
                },
                {
                  $unwind: {
                    path: "$accountDetails",
                    preserveNullAndEmptyArrays: true // Preserve users with no matching account
                  }
                },
                {
                  $unwind: {
                    path: "$accountDetails.bankDetails", // Unwind the bankDetails array (if it's an array)
                    preserveNullAndEmptyArrays: true // In case bankDetails is empty or null
                  }
                },
                {
                  $project: {
                    username: 1,
                    email: 1,
                    mobileNumber: 1,
                    address: 1,
                    kycStatus: 1,
                    status: 1,
                    role: 1,
                    profilePhoto: 1,
                    profileLocalPath: 1,
                    signature: 1,
                    aadhaar: 1,
                    pan: 1,
                    // Include all the fields from accountDetails, including bankDetails
                    "accountDetails._id": 1,
                    "accountDetails.user": 1,
                    "accountDetails.incomeProof": 1,
                    "accountDetails.role": 1,
                    "accountDetails.createdAt": 1,
                    "accountDetails.updatedAt": 1,
                    "accountDetails.bankDetails.bankName": 1,      // Project bankName from bankDetails
                    "accountDetails.bankDetails.accountNumber": 1, // Project accountNumber from bankDetails
                    "accountDetails.bankDetails.ifsc": 1,          // Project ifsc from bankDetails
                    "accountDetails.bankDetails.micrCode": 1,      // Project micrCode from bankDetails
                    "accountDetails.bankDetails.branchName": 1     // Project branchName from bankDetails
                  }
                }
              ]);
      
      console.log(users);
          
      return res.status(200).json(users);

  } catch (err) {
      next(err)
  }
}



const approveUser = async(req,res,next)=>{
    try {

      if(!req.user)
        throw new ErrorResponse("admin is not logged in ",400);
  
       if(req.user.userRole==='user')
            throw new ErrorResponse("User do not have admin rights to get all users",400);
  

        const {aadhaar} = req.body;

        if(!aadhaar)
            throw new ErrorResponse("Adhaar number is missing",400);

        const user = await userModel.findOne({aadhaar:aadhaar});

        if(!user)
            throw new ErrorResponse("User not found. Wrong aadhaar number ",400);

        const userZID = await getUserZID();
        
        if(!userZID)
            throw new ErrorResponse("Error in generating UserZID ",500);

        const result = await sendWelcomeMail({username:user.username,userZID:userZID,email:user.email});

        if(!result)
            throw new ErrorResponse("Error in sending email for USERZID ",500);

        user.kycStatus = 'approved';
        user.userZID=userZID;       

        await user.save();

       return res.status(200).json({message:"user has been approved and email has been sent"}); 

    } catch (err) {
        next(err);
    }
}


const rejectUser = async(req,res,next)=>{
    try {

      if(!req.user)
        throw new ErrorResponse("admin is not logged in ",400);
  
       if(req.user.userRole==='user')
            throw new ErrorResponse("User do not have admin rights to get all users",400);
  
        
        const {aadhaar} = req.body;

        if(!aadhaar)
            throw new ErrorResponse("Adhaar number is missing",400);

        const user = await userModel.findOne({aadhaar:aadhaar});

        if(!user)
            throw new ErrorResponse("User not found. Wrong aadhaar number ",400);

        const result = await sendRejectionMail({username:user.username,text:rejectionEmailText,email:user.email});

        if(!result)
            throw new ErrorResponse("Error in sending email for Rejection ",500);
        
        await userModel.deleteOne({aadhaar:user.aadhaar});

       return res.status(200).json({message:"user has been rejected and email has been sent"}); 

    } catch (err) {
        next(err);
    }
}


const adminLoginStep1 = async(req,res,next)=>{

  try {
    const {username,password} = req.body;

    console.log(req.body);
  
    if(!username || !password)
        throw new ErrorResponse("Login Credential missing",400);

    const user= await adminModel.findOne({username:username});

  console.log(user);

    if(!user)
      throw new ErrorResponse("Admin not found",404);

      
    const passIsCorrect = await bcrypt.compare(password,user.password);

    console.log(passIsCorrect);

    if(!passIsCorrect)
      throw new ErrorResponse("username or password is incorrect",400);

    const OTP = await generateOTP();

    console.log(OTP);

    const result = await sendOTPMail({text:loginOTPText,otp:OTP,email:user.email,subject:"Login OTP"});

    if(!result)
      throw new ErrorResponse("FAILED TO SEND OTP",500);

    await tempForLoginAdminModel.create({
          username:username,
          OTP:OTP
    });

    return res.status(201).json({
      message: 'LOGIN OTP HAS BEEN SENT SUCCESSFULLY TO THE ADMIN!'
    });


  } catch (err) {
    next(err);
  }


}


const adminLoginStep2 = async(req,res,next)=>{

  try {
    console.log("admin logging has been hitting")
    
    const {username,OTP} = req.body;
  
    
    if(!username || !OTP)
        throw new ErrorResponse("OTP OR USERZID IS MISSING",400);
    
    
    const findUser = await tempForLoginAdminModel.findOne({username:username});

    console.log(findUser);

      if(!findUser)
        throw new ErrorResponse("Admin credentials are missing username not found",400);

      if(!(findUser.OTP === OTP)){
        await tempForLoginAdminModel.deleteMany({username:username});
        throw new ErrorResponse("OTP NOT MATCHED",400);          
      }


        const detailedUser = await adminModel.findOne({username:username});

      const token = await jwt.sign(
        {
          username: detailedUser.username,
          userRole: detailedUser.role,
          userObjectID : detailedUser._id.toString()
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' } // Set the token to expire in 1 hour
      );
      
        
      await tempForLoginAdminModel.deleteMany({username:username});

     return res.status(200).json({message:"Access token has been set",token:token, userData:{username:detailedUser.username,userRole:detailedUser.role,userObjectID:detailedUser._id.toString(),profilePic:detailedUser.profilePhoto}});
   
  } catch (err) {
    next(err);
  }


};

const registerAdmin = async (req, res, next) => {
  try {

    console.log(req.user);

    if(!req.user)
      throw new ErrorResponse("admin is not logged in ",400);


    if(req.user.userRole!=='admin')
      throw new ErrorResponse("moderator do not have admin rights to add another admin ",400);



    // Destructure the fields from the request body
    const {
      username,
      email,
      mobileNumber,
      address,
      role,
      password,
      aadhaar,
      pan
    } = req.body;

    const checkUserExist = await adminModel.findOne({email:email});
    
    if(checkUserExist)
      throw new ErrorResponse("Email is already in used",400);

    // Check if all required fields are provided
    if (!username || !email || !mobileNumber || !role || !address || !password || !aadhaar || !pan) {
      throw new ErrorResponse("Please provide all the required fields",400);
    }

    // Create a new user instance with the provided data
    
    // const data = {
    //   text : registrationText,
    //   otp:OTP,
    //   subject:"OTP FOR REGISTRATION PROCESS",
    //   email:email
    // }

   // const result = await sendOTPMail(data);
    
    // if(!result)
    //   throw new ErrorResponse("FAILED TO SEND OTP",500);

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = await adminModel.create({
      username,
      email,
      mobileNumber,
      address,
      role,
      aadhaar,
      pan,
      password:hashedPassword
    });

    console.log("Registered Admin :", newUser);

       // Send a success response with the saved user data
    return res.status(201).json({
      message: 'New Admin Registered Successfully'
    });
  } catch (error) {
    // If there are validation errors or other issues, pass them to the error handler middleware
    next(error);
  }
};




const adminForgetPasswordStep1 = async(req,res,next)=>{

  try {
    const {username} = req.body;

    if(!username)
      throw new ErrorResponse("username is missing from request body",400);

    const findUser = await adminModel.findOne({username:username});

    if(!findUser)
      throw new ErrorResponse("admin not found or wrong user ID",404);

    const OTP = await generateOTP();

     const result = await sendOTPMail({text:forgetPasswordText,email:findUser.email,otp:OTP,subject:"ADMIN FORGET PASSWORD OTP"});
     
     if(!result)
      throw new ErrorResponse("Failed to send OTP email",500);

     await tempForForgetPasswordAdminModel.create({
      username:username,
      OTP:OTP
     });

     return res.status(200).json({message:"OTP HAS BEEN SENT TO THE ADMIN"});

  } catch (err) {
    next(err);
  }
 
};


const adminForgetPasswordStep2 = async(req,res,next)=>{

try {
  const {username,OTP,newPassword} = req.body;

    if(!username || !OTP || !newPassword)
      throw new ErrorResponse("Request body data is missing some field",400);

  const isOTPCorrect = await tempForForgetPasswordAdminModel.findOne({ username: username, OTP: OTP });

  if(!isOTPCorrect){
    await tempForForgetPasswordAdminModel.deleteMany({username:username});
    throw new ErrorResponse("OTP NOT MATCHED",400);
  }

    const hashedPassword = await bcrypt.hash(newPassword,10);

    const user = await adminModel.findOne({username:username});

    user.password = hashedPassword;

    await user.save();

  return res.status(200).json({message:"Password has been changed successfully"});

} catch (err) {
  next(err);
}

};



const freezeUser = async(req,res,next)=>{
  try {

    if(!req.user)
      throw new ErrorResponse("admin is not logged in ",400);

      if(req.user.userRole==='user')
      throw new ErrorResponse("User do not have rights to freeze ",400);

      
      const {status,aadhaar} = req.body;

      if(!status || !aadhaar)
          throw new ErrorResponse("status or aadhaar is missing from request body",400);

      const user = await userModel.findOne({aadhaar:aadhaar});

      if(!user)
          throw new ErrorResponse("User not found. Wrong aadhaar number ",400);

      if(user.status==='frozen')
        throw new ErrorResponse("User is already in frozen state ",400);

      const result = await sendAccountFreezeMail({username:user.username,text:accountFreezeEmailText,email:user.email});

      if(!result)
          throw new ErrorResponse("Error in sending email for account freeze ",500);
      
      await userModel.deleteOne({aadhaar:user.aadhaar});

     return res.status(200).json({message:"user account has been freezed and email has been sent"}); 

  } catch (err) {
      next(err);
  }

}

const activateUser = async(req,res,next)=>{
  try {

    if(!req.user)
      throw new ErrorResponse("admin is not logged in ",400);

      if(req.user.userRole==='user')
      throw new ErrorResponse("User do not have rights to activate users",400);

      
      const {status,aadhaar} = req.body;

      if(!status || !aadhaar)
          throw new ErrorResponse("status or aadhaar is missing from request body",400);

      const user = await userModel.findOne({aadhaar:aadhaar});

      if(!user)
          throw new ErrorResponse("User not found. Wrong aadhaar number ",400);

      if(user.status==='active')
        throw new ErrorResponse("User is already in active state ",400);

      const result = await sendAccountActivationMail({username:user.username,text:accountActivationEmailText,email:user.email});

      if(!result)
          throw new ErrorResponse("Error in sending email for account activation ",500);
      
      await userModel.deleteOne({aadhaar:user.aadhaar});

     return res.status(200).json({message:"user account has been re-activated and email has been sent"}); 

  } catch (err) {
      next(err);
  }

}

const getAllmoderators = async(req,res,next)=>{
  try {
      console.log(req.user.userRole);
      if(!req.user)
          throw new ErrorResponse("Admin or moderator is not logged in ",400);

          if(req.user.userRole==='user')
          throw new ErrorResponse("User do not have admin rights to get all moderators",400);


      const allUsers = await adminModel.find({role:'moderator'});

      return res.status(200).json(allUsers);


  } catch (err) {
      next(err);
  }
};




export {
    getAllUsers,
    getUsers,
    approveUser,
    rejectUser,
    getUsersByKYC,
    getUsersByStatus,
    adminLoginStep1,
    adminLoginStep2,
    registerAdmin,
    adminForgetPasswordStep1,
    adminForgetPasswordStep2,
    freezeUser,
    activateUser,
    getAllmoderators
}