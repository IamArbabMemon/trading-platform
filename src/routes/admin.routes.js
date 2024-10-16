import {Router} from 'express';
import { checkAuthentication } from '../middlewares/authentication.middleware.js';
import { activateUser, adminForgetPasswordStep1, adminForgetPasswordStep2, adminLoginStep1, adminLoginStep2, approveUser, freezeUser, getAllUsers,getUsers, getUsersByKYC, getUsersByStatus, registerAdmin, rejectUser } from '../controllers/admin.controller.js';

const router = Router();

router.route('/getAllUsers').get(checkAuthentication,getAllUsers);

router.route('/getUsers').get(checkAuthentication,getUsers);

router.route('/approveUser').post(checkAuthentication,approveUser);

router.route('/rejectUser').post(checkAuthentication,rejectUser);

router.route('/getUsersByKYC').get(checkAuthentication,getUsersByKYC);

router.route('/getUsersByStatus').get(checkAuthentication,getUsersByStatus);


router.route('/login/step1').post(adminLoginStep1);
router.route('/login/step2').post(adminLoginStep2);


router.route('/freezeUserAccount').post(checkAuthentication,freezeUser);

router.route('/activateUserAccount').post(checkAuthentication,activateUser);




router.route('/forgetPasswordStep1').post(adminForgetPasswordStep1);
router.route('/forgetPasswordStep2').post(adminForgetPasswordStep2);




router.route('/addAdmin').post(checkAuthentication,registerAdmin);



router.route('/healthCheck').get((req,res)=>res.send("OKAYYY"));



/*

1 . verify/reject request of registration user .

2. frozen/active user .

3.  



*/


export {router};