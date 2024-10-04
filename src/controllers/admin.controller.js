import { userModel } from "../models/user.model.js";
import { ErrorResponse } from "../utils/errorResponse.js"
import { getUserZID } from "../utils/generateUserZID.js";
import { sendOTPMail, sendWelcomeMail } from "../utils/mailer.js";
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
            status = "active"

        
        const users = await userModel
  .find({ kycStatus: kycStatus,status:status}) // Match documents based on kycStatus and status
  .select('username email mobileNumber userZID aadhaar pan kycStatus country'); // Select specific fields

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




export {
    getAllUsers,
    getUsers,
    approveUser
}