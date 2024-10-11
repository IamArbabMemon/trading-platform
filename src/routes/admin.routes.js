import {Router} from 'express';
import { checkAuthentication } from '../middlewares/authentication.middleware.js';
import { approveUser, getAllUsers,getUsers, getUsersByKYC, getUsersByStatus, rejectUser } from '../controllers/admin.controller.js';

const router = Router();

router.route('/getAllUsers').get(getAllUsers);

router.route('/getUsers').get(getUsers);

router.route('/approveUser').post(approveUser);

router.route('/rejectUser').post(rejectUser);

router.route('/getUsersByKYC').get(getUsersByKYC);

router.route('/getUsersByStatus').get(getUsersByStatus);

router.route('/healthCheck').get((req,res)=>res.send("OKAYYY"));



/*

1 . verify/reject request of registration user .

2. frozen/active user .

3.  



*/


export {router};