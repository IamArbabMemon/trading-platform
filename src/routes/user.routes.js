import {Router} from 'express';
import { finalizeIntitialRegistration, forgetPasswordStep1, forgetPasswordStep2, getUser, insertBankAccountInfo, registerUserStep1,updateAdhaar,updateIncomeProof,updatePan,updateProfilePicture,updateSignature,uploadProfilePicture, userLoginStep1, userLoginStep2, userLogout, verifyAdhaar} from '../controllers/user.controllers.js';
import multer from 'multer';
import { checkAuthentication } from '../middlewares/authentication.middleware.js';
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5 MB (in bytes)
});

const router = Router();

// router.route('/register-step1').post(registerUserStep1);
// router.route('/updateAdhaar').post(upload.single('adhaar-pic'),updateAdhaar);
// router.route('/upload-profile-picture').post(upload.single('profile-pic'),uploadProfilePicture);
// router.route('/updatePanCard').post(upload.single('panCard-pic'),updatePan);
// router.route('/updateIncomeProof').post(upload.single('incomeProof-pic'),updateIncomeProof);
// router.route('/updateUserSignaturePic').post(upload.single('userSignature-pic'),updateSignature);
// router.route('/finalizeInitialRegistration').post(finalizeIntitialRegistration);

/*

(err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    // Handle file size limit error
    return res.status(400).json({ error: 'File size is too large. Max limit is 5MB.' });
  }

  // Handle other errors
  return res.status(500).json({ error: 'An unknown error occurred!' });
};



*/
// const fileSizeHandling = async (err, req, res, next) => {
//   if (err.code === 'LIMIT_FILE_SIZE') {
//     // Handle file size limit error
//     return res.status(400).json({ error: 'File size is too large. Max limit is 5MB.' });
//   }

//   // Handle 
// };



// // route to be accessed by logged in user those who have token for authentication
// router.route('/updateUserProfilePicture').post(upload.single('profile-pic'),updateProfilePicture);
// User registration and initial steps
router.route('/register-step1').post(registerUserStep1);
router.route('/finalizeInitialRegistration').post(finalizeIntitialRegistration);

// Document uploads
router.route('/upload-profile-picture').post(upload.single('profile-pic'),uploadProfilePicture);
router.route('/updatePanCard').post(upload.single('panCard-pic'), updatePan);
router.route('/updateAdhaar').post(upload.single('adhaar-pic'), updateAdhaar);

router.route('/updateIncomeProof').post(upload.single('incomeProof-pic'), updateIncomeProof);
router.route('/updateUserSignaturePic').post(upload.single('userSignature-pic'), updateSignature);

router.route('/forgetPasswordStep1').post(forgetPasswordStep1);
router.route('/forgetPasswordStep2').post(forgetPasswordStep2);

router.route('/login/step1').post(userLoginStep1);
router.route('/login/step2').post(userLoginStep2);



// Authenticated user actions
router.route('/updateUserProfilePicture').post(checkAuthentication,upload.single('profile-pic'), updateProfilePicture);
router.route('/logout').post(checkAuthentication,userLogout);

router.route('/verifyAdhaarNumber').post(verifyAdhaar);

router.route('/insertBankDetails').post(insertBankAccountInfo);


router.route('/getUser').get(checkAuthentication,getUser);


router.route('/healthCheck').get((req,res)=>res.send("OKAYYY"));

/*

todo: 

1. link bank account manually or upi .. how to deal with upi 

4. update user details after discussing with ahsan

5. browser does not have cookie .

6. 


*/

export {router};