import { stockTransactionModel } from "../models/stockTransaction.model.js";
import { userModel } from "../models/user.model.js";
import { ErrorResponse } from "../utils/errorResponse.js"


const registerStockTransaction = async(req,res,next)=>{
  try{

    if(!req.user)
        throw new ErrorResponse("user is not logged in ",400);

        if(req.user.userRole!=='user')
        throw new ErrorResponse("only user has the rights to buy and sell",400);

        const {stockName ,transactionType ,stockQuantity ,pricePerUnit ,totalAmount ,transactionDate} = req.body; 

        if (!stockName || !transactionType || !stockQuantity || !pricePerUnit || !totalAmount || !transactionDate) {
            throw new ErrorResponse("Please provide all the required fields",400);
          }

         
       const findUser = await userModel.findById(req.user.userObjectID);
       
       if(!findUser)
        throw new ErrorResponse("user not found",400);

       const transaction = await stockTransactionModel.create({
        userId:req.user.userObjectID,
        stockName:stockName,
        transactionType:transactionType,
        stockQuantity:stockQuantity,
        pricePerUnit:pricePerUnit,
        totalAmount:totalAmount,
        transactionDate
       });

       if(!transaction)
        throw new ErrorResponse("Error occured registering transaction in database",500);

       return res.status(200).json({message:"Action has been completed",data:transaction._id});

}catch(err){
    next(err)
}

};


export {
    registerStockTransaction
}


