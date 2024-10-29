import {Router} from 'express';
import { checkAuthentication } from '../middlewares/authentication.middleware.js';
import { buyStocks, getUserStockTransaction, getUserTransactionHistoryAdmin, getUsersByKYCAndStatus, sellStocks } from '../controllers/stockTransaction.controller.js';

const router = Router();

router.route('/registerTransaction/buy').post(checkAuthentication,buyStocks);

router.route('/registerTransaction/sell').post(checkAuthentication,sellStocks);

router.route('/getUserStockTransactionDetails').get(checkAuthentication,getUserStockTransaction);

router.route('/getUserStockTransactions').get(checkAuthentication,getUserTransactionHistoryAdmin);

router.route('/getUserbyKycStatusAndStatus').get(checkAuthentication,getUsersByKYCAndStatus);

export {router};