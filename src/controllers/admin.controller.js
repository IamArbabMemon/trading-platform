import { rejectionEmailText } from "../mailTemplates.js";
import { userModel } from "../models/user.model.js";
import { ErrorResponse } from "../utils/errorResponse.js"
import { getUserZID } from "../utils/generateUserZID.js";
import { sendOTPMail, sendRejectionMail, sendWelcomeMail } from "../utils/mailer.js";
import { getUserByID, registerUserStep1 } from "./user.controllers.js";


const getAllUsers = async(req,res,next)=>{
    try {
        
        if(!req.user)
            throw new ErrorResponse("User is not logged in ",400);

        if(req.user.role!=='admin')
            throw new ErrorResponse("User do not have admin rights to get all users ",400);

        const allUsers = await userModel.find();

        return res.status(200).json(allUsers);


    } catch (err) {
        next(err);
    }

};


const getUsers = async(req,res,next)=>{
    try {
        let {kycStatus} = req.query;
        let {status} = req.query;
        
        if(!kycStatus)
              kycStatus = 'pending';  

        if(!status)
            status = "frozen"
        
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





export {
    getAllUsers,
    getUsers,
    approveUser,
    rejectUser,
    getUsersByKYC,
    getUsersByStatus
}