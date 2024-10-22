import {Router} from 'express';
import { checkAuthentication } from '../middlewares/authentication.middleware.js';
import { getUserStockTransaction, registerStockTransaction } from '../controllers/stockTransaction.controller.js';

const router = Router();

router.route('/registerTransaction').post(checkAuthentication,registerStockTransaction);

router.route('/getUserStockTransactionDetails').get(checkAuthentication,getUserStockTransaction);



export {router};