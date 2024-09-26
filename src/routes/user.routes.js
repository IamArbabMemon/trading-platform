import {Router} from 'express';
import { test } from '../controllers/user.controllers.js';
const router = Router();

router.route('/register-step1').get(test);


export {router};