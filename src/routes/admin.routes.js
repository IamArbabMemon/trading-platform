import {Router} from 'express';
import { checkAuthentication } from '../middlewares/authentication.middleware.js';
import { getAllUsers } from '../controllers/admin.controller.js';

const router = Router();

router.route('/getAllUsers').post(getAllUsers);

router.route('/healthCheck').get((req,res)=>res.send("OKAYYY"));






export {router};