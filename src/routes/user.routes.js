import {Router} from 'express';
import { registerUserStep1,updateAdhaar } from '../controllers/user.controllers.js';

const router = Router();

router.route('/register-step1').post(registerUserStep1);
router.route('/updateAdhaar').post(updateAdhaar);


export {router};