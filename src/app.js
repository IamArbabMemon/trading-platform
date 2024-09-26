import express from 'express';
import { router as userRouter} from './routes/user.routes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/v1/user',userRouter);




export {app}