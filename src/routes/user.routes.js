import {Router} from 'express';
import { registerUserStep1 } from '../controllers/user.controllers.js';
const router = Router();

router.route('/register-step1').get(registerUserStep1);


export {router};