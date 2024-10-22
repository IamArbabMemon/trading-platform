import { stockTransactionModel } from "../models/stockTransaction.model.js";
import { userModel } from "../models/user.model.js";
import { ErrorResponse } from "../utils/errorResponse.js"
import mongoose from 'mongoose'

const registerStockTransaction = async(req,res,next)=>{
  try{

    console.log(req.body);

    if(!req.user)
        throw new ErrorResponse("user is not logged in ",400);

        if(req.user.userRole!=='user')
        throw new ErrorResponse("only user has the rights to buy and sell",400);

        const {stockName ,transactionType ,stockQuantity ,pricePerUnit ,totalAmount ,transactionDate} = req.body; 

        if (!stockName || !transactionType || !stockQuantity || !pricePerUnit || !totalAmount) {
            throw new ErrorResponse("Please provide all the required fields",400);
          }

         
       const findUser = await userModel.findById(req.user.userObjectID);
       
       if(!findUser)
       throw new ErrorResponse("user not found",400);


        if(findUser.kycStatus==='pending')
        throw new ErrorResponse("user is not approved yet",400);  

        if(findUser.status==='frozen')
        throw new ErrorResponse("user status is frozen",400);  

       const transaction = await stockTransactionModel.create({
        userId:req.user.userObjectID,
        stockName:stockName,
        transactionType:transactionType,
        stockQuantity:stockQuantity,
        pricePerUnit:pricePerUnit,
        totalAmount:totalAmount,
       });

       if(!transaction)
        throw new ErrorResponse("Error occured registering transaction in database",500);

       return res.status(200).json({message:"Action has been completed",data:transaction._id});

}catch(err){
    next(err)
}

};



// const getUserStockTransaction = async (req, res, next) => {
//   try {
//     if (!req.user) {
//       throw new ErrorResponse("User is not logged in", 400);
//     }

//     // Log the userObjectID for debugging
//     console.log('User ObjectID:', req.user.userObjectID);

//     // Ensure userObjectID is an ObjectId
//     const userObjectId = new mongoose.Types.ObjectId(req.user.userObjectID);

//     const usersTransactions = await stockTransactionModel.aggregate([
//       {
//         $match: {
//           userId: userObjectId // Ensure correct ObjectId matching
//         }
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userDetails"
//         }
//       },
//       {
//         $unwind: {
//           path: "$userDetails",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $project: {
//           stockName: 1,
//           transactionType: 1,
//           stockQuantity: 1,
//           pricePerUnit: 1,
//           totalAmount: 1,
//           transactionDate: 1,
//           transactionFee: 1,
//           status: 1,
//           // User details
//           "userDetails.username": 1,
//           "userDetails.email": 1,
//           "userDetails.mobileNumber": 1,
//           "userDetails.address": 1,
//           "userDetails.kycStatus": 1,
//           "userDetails.status": 1,
//           "userDetails.role": 1,
//           "userDetails.profilePhoto": 1,
//           "userDetails.profileLocalPath": 1,
//           "userDetails.signature": 1,
//           "userDetails.aadhaar": 1,
//           "userDetails.pan": 1
//         }
//       }
//     ]);

//     if (!usersTransactions.length) {
//       return res.status(404).json({ message: "No stock transactions found for this user" });
//     }

//     return res.status(200).json(usersTransactions);

//   } catch (err) {
//     next(err);
//   }
// };


const getUserStockTransaction = async (req, res, next) => {
  try {
    
    if (!req.user) {
      throw new ErrorResponse("User is not logged in", 400);
    }


   if(req.user.userRole!=='user')
   throw new ErrorResponse("admin or moderator you do not have rights", 400);


      const usersTransactions = await stockTransactionModel.find({userId:req.user.userObjectID});

    if (!usersTransactions)
    throw new ErrorResponse("not have any transaction history", 404);


    return res.status(200).json(usersTransactions);

  } catch (err) {
    next(err);
  }
};




export {
    registerStockTransaction,
    getUserStockTransaction
}


