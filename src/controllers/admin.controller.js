import { userModel } from "../models/user.model.js";
import { ErrorResponse } from "../utils/errorResponse.js"


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


export {
    getAllUsers
}