import { stockTransactionModel } from "../models/stockTransaction.model.js";
import { userModel } from "../models/user.model.js";
import { ErrorResponse } from "../utils/errorResponse.js"
import mongoose from 'mongoose'

// const registerStockTransaction = async(req,res,next)=>{
//   try{

//     console.log(req.body);

//     if(!req.user)
//         throw new ErrorResponse("user is not logged in ",400);

//         if(req.user.userRole!=='user')
//         throw new ErrorResponse("only user has the rights to buy and sell",400);

//         const {stockName ,transactionType ,stockQuantity ,pricePerUnit ,totalAmount ,transactionDate} = req.body; 

//         if (!stockName || !transactionType || !stockQuantity || !pricePerUnit || !totalAmount) {
//             throw new ErrorResponse("Please provide all the required fields",400);
//           }

         
//        const findUser = await userModel.findById(req.user.userObjectID);
       
//        if(!findUser)
//        throw new ErrorResponse("user not found",400);


//         if(findUser.kycStatus==='pending')
//         throw new ErrorResponse("user is not approved yet",400);  

//         if(findUser.status==='frozen')
//         throw new ErrorResponse("user status is frozen",400);  

//        const transaction = await stockTransactionModel.create({
//         userId:req.user.userObjectID,
//         stockName:stockName,
//         transactionType:transactionType,
//         stockQuantity:stockQuantity,
//         pricePerUnit:pricePerUnit,
//         totalAmount:totalAmount,
//        });

//        if(!transaction)
//         throw new ErrorResponse("Error occured registering transaction in database",500);

//        return res.status(200).json({message:"Action has been completed",data:transaction._id});

// }catch(err){
//     next(err)
// }

// };


const buyStocks = async(req,res,next)=>{
  try{

    console.log("inside buy ",req.body," ",req.user.pan);
    const user = req.user;


    console.log(user);



    if(!user)
        throw new ErrorResponse("user is not logged in ",400);

        if(user.userRole!=='user')
        throw new ErrorResponse("only user has the rights to buy and sell",400);

        const {stockName ,transactionType ,stockQuantity ,pricePerUnit ,totalAmount} = req.body; 

        if (!stockName || !transactionType || !stockQuantity || !pricePerUnit || !totalAmount) {
            throw new ErrorResponse("Please provide all the required fields",400);
          }
       
       
        if(user.kycStatus==='pending')
        throw new ErrorResponse("user is not approved yet",400);  

        if(user.status==='frozen')
        throw new ErrorResponse("user status is frozen",400);  


      
        const userStockDetails =  await stockTransactionModel.create({
        
            userId:user.userObjectID,
            stockName:stockName,
            transactionType:transactionType,
            stockQuantity:stockQuantity,
            pricePerUnit:pricePerUnit,
            totalAmount:totalAmount,
            userPan:user.pan
          
          });
    
        
          console.log(userStockDetails);
          // userStockDetails = await stockTransactionModel.findOneAndUpdate(
          //   { _id: user.userObjectID },
          //   { stockName:stockName }, // Filter condition
          //   { $inc: { stockQuantity: stockQuantity } }, // Increment the stock field
          //   { new: true } // Return the updated document
          // );
          // userStockDetails = await stockTransactionModel.findOneAndUpdate(
          //   { userId: user.userObjectID, stockName: stockName }, // Filter by userId and stockName
          //   { 
          //     $inc: { stockQuantity: stockQuantity } // Increment the stockQuantity
          //   },
          //   { new: true } // Return the updated document
          // );
          

       return res.status(200).json({message:"Action has been completed",data:{stockName:userStockDetails.stockName,stockQuantity:userStockDetails.stockQuantity}});

}catch(err){
    next(err)
}

};



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



const sellStocks = async(req,res,next)=>{
  try{

    console.log(req.body);

    const user = req.user;

    if(!user)
        throw new ErrorResponse("user is not logged in ",400);

        if(user.userRole!=='user')
        throw new ErrorResponse("only user has the rights to buy and sell",400);

        const {stockName ,transactionType ,stockQuantity ,pricePerUnit ,totalAmount} = req.body; 

        if (!stockName || !transactionType || !stockQuantity || !pricePerUnit || !totalAmount) {
            throw new ErrorResponse("Please provide all the required fields",400);
          }
       
       
        if(user.kycStatus==='pending')
        throw new ErrorResponse("user is not approved yet",400);  

        if(user.status==='frozen')
        throw new ErrorResponse("user status is frozen",400);  


      
// let userStockDetails = await stockTransactionModel.findOne({
//   stockName: stockName,
//   userId: user.userObjectID//mongoose.Types.ObjectId(user.userObjectID) // Convert to ObjectId if needed
// });

// console.log(userStockDetails);

    //  if(!userStockDetails)
    //   throw new ErrorResponse("This stock is not available for sale. Kindly purchase it first.",404);  

    //   if(userStockDetails.stockQuantity<stockQuantity)
    //     throw new ErrorResponse("The available stock quantity is less than the quantity you wish to sell.",404);  


        // userStockDetails = await stockTransactionModel.findOneAndUpdate(
        //   { userId: user.userObjectID, stockName: stockName }, // Filter by userId and stockName
        //   { 
        //     $inc: { stockQuantity: -stockQuantity } // Increment the stockQuantity
        //   },
        //   { new: true } // Return the updated document
        // );
    
        console.log("insidee sell ",user.pan)

        const userStockDetails =  await stockTransactionModel.create({
          userId:user.userObjectID,
          stockName:stockName,
          transactionType:transactionType,
          stockQuantity:stockQuantity,
          pricePerUnit:pricePerUnit,
          totalAmount:totalAmount,
          userPan:user.pan
        });

        console.log(userStockDetails);
  
       return res.status(200).json({message:"Action has been completed",data:{stockName:userStockDetails.stockName,stockQuantity:userStockDetails.stockQuantity}});

}catch(err){
    next(err)
}

};

const getUserTransactionHistoryAdmin = async(req,res,next)=>{
  try {
    
    const {pan} = req.body;

    if(req.user.userRole==='user')
      throw new ErrorResponse("do not have admin rights to view user stock transaction history",400);

    if(!pan)
      throw new ErrorResponse("Pan number is missing",400);

    const history = await stockTransactionModel.find({userPan:pan});


    return res.status(200).json({message:"user stock history has been fetched",data:history});

  } catch (err) {
    next(err);
  }
}

const getUsersByKYCAndStatus = async(req,res,next)=>{
  try {

    if(!req.user)
      throw new ErrorResponse("admin is not logged in ",400);

      if(req.user.userRole==='user')
      throw new ErrorResponse("User do not have admin rights to get all users",400);

      
  
          const users =  await userModel.aggregate([
                {
                  $match: {
                    kycStatus: "approved", // Shorthand equality check
                   status: "active" 
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



export {
    buyStocks,
    sellStocks,
    getUserStockTransaction,
    getUserTransactionHistoryAdmin,
    getUsersByKYCAndStatus
}


