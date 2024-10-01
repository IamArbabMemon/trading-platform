import {Router} from 'express';
import { checkAuthentication } from '../middlewares/authentication.middleware.js';
import { getAllUsers } from '../controllers/admin.controller.js';

const router = Router();

router.route('/getAllUsers').post(getAllUsers);

router.route('/healthCheck').get((req,res)=>res.send("OKAYYY"));



/*

1 . verify/reject request of registration user .

2. frozen/active user .

3.  



*/


export {router};