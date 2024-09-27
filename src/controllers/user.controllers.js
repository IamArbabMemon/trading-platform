import { ErrorResponse } from "../utils/errorResponse.js";
import { userModel } from "../models/user.model.js";


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
    } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !mobileNumber || !role || !address) {
      throw new ErrorResponse("Please provide all the required fields",400);
    }

    // Create a new user instance with the provided data
    const newUser = await userModel.create({
      username,
      email,
      mobileNumber,
      address,
      role
    });



    
    // Send a success response with the saved user data
    return res.status(201).json({
      message: 'User registered successfully!',
      user: {username:newUser.username,userObjectID:newUser._id},
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

        const newUser = await userModel.findById(userObjectID);

        newUser.aadhaar = adhaar;

        await newUser.save();
      // Send a success response with the saved user data
      return res.status(201).json({
        message: 'User registered successfully!',
        user: {username:newUser.username,userObjectID:newUser._id},
      });

    } catch (error) {
      // If there are validation errors or other issues, pass them to the error handler middleware
      next(error);
    }

  };
  

  const updatePan = async (req, res, next) => {
    try {
      // Destructure the fields from the request body
     
        const{userObjectID , pan} = req.body;
      
        if (!userObjectID || !pan) {
            throw new ErrorResponse("Please provide adhaar and userObjectID",400);
          }   

        const newUser = await userModel.findById(userObjectID);

        newUser.pan = pan;

        await newUser.save();
      // Send a success response with the saved user data
      return res.status(201).json({
        message: 'User registered successfully!',
        user: {username:newUser.username,userObjectID:newUser._id},
      });

    } catch (error) {
      // If there are validation errors or other issues, pass them to the error handler middleware
      next(error);
    }
    
  };



export{
    registerUserStep1,
    updateAdhaar
};
