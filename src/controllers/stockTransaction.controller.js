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
            totalAmount:totalAmount
        
          });
    
        

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
    
        const userStockDetails =  await stockTransactionModel.create({
          userId:user.userObjectID,
          stockName:stockName,
          transactionType:transactionType,
          stockQuantity:stockQuantity,
          pricePerUnit:pricePerUnit,
          totalAmount:totalAmount
        });
  
       return res.status(200).json({message:"Action has been completed",data:{stockName:userStockDetails.stockName,stockQuantity:userStockDetails.stockQuantity}});

}catch(err){
    next(err)
}

};



export {
    buyStocks,
    sellStocks,
    getUserStockTransaction
}


