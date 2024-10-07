import express from 'express';
import { router as userRouter} from './routes/user.routes.js';
import {router as adminRouter } from './routes/admin.routes.js'
//import cors from 'cors'
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandling.middleware.js';


const app = express();


app.use(express.json());

// const whitelist = ['http://localhost:3000', 'https://3bb2-137-59-221-159.ngrok-free.app/login','https://3bb2-137-59-221-159.ngrok-free.app']; // Add your frontend URLs here

// // Configure CORS options
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Check if the incoming request's origin is in the whitelist
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       // Allow requests with no `origin` (like mobile apps or Postman)
//       callback(null, true); // Allow access
//     } else {
//       callback(new Error('Not allowed by CORS')); // Reject access
//     }
//   },
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// };

//app.use(cors());

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/v1/user',userRouter);

app.use('/api/v1/admin',adminRouter);

app.get('/get',(req,res)=>{
    console.log("hitting get token");

    return res.status(200).json({message:"giving you access"});

   });
    
    


// app.use('/hello',(req,res)=>res.send())

app.use(errorHandler);


export {app}