import {Router} from 'express';
import { checkAuthentication } from '../middlewares/authentication.middleware.js';
import { registerStockTransaction } from '../controllers/stockTransaction.controller.js';

const router = Router();

router.route('/registerTransaction').post(checkAuthentication,registerStockTransaction);


export {router};