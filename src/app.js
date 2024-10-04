import express from 'express';
import { router as userRouter} from './routes/user.routes.js';
import {router as adminRouter } from './routes/admin.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandling.middleware.js';


const app = express();


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/v1/user',userRouter);

app.use('/api/v1/admin',adminRouter);

app.get('/get-token',(req,res)=>{
    return res.json({token:"21232tokeenaa"});
})


// app.use('/hello',(req,res)=>res.send())

app.use(errorHandler);


export {app}