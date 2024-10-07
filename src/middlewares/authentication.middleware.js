import jwt from'jsonwebtoken';
import { ErrorResponse } from '../utils/errorResponse.js';
import dotenv from 'dotenv';
dotenv.config({
    path:'./.env'
 })

const checkAuthentication = async (req,res,next)=>{

    try{

        let token;

        token = req.headers['token'];
            console.log("TOKEN : ", token)    

        
        // If no token is found in both places, throw an error
        if (!token) {
            throw new ErrorResponse('Not authenticated, token missing', 401);
        }

        // Verify the token
        if (!process.env.JWT_SECRET_KEY) {
            throw new ErrorResponse('ENVIRONMENT VARIABLE NOT LOADED PROPERLY, JWT_SECRET_KEY is missing', 500);
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach the decoded user data to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();

        

    }catch(err){
        console.log(err.statusCode);
            next(err);
    }

}

export {
    checkAuthentication
}

