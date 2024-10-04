import {Router} from 'express';
import { checkAuthentication } from '../middlewares/authentication.middleware.js';
import { getAllUsers,getUsers } from '../controllers/admin.controller.js';

const router = Router();

router.route('/getAllUsers').get(getAllUsers);

router.route('/getUsers').get(getUsers);

router.route('/healthCheck').get((req,res)=>res.send("OKAYYY"));



/*

1 . verify/reject request of registration user .

2. frozen/active user .

3.  



*/


export {router};