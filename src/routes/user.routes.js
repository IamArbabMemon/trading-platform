import {Router} from 'express';
import { finalizeIntitialRegistration, registerUserStep1,updateAdhaar,updateIncomeProof,updatePan,updateProfilePicture,updateSignature,uploadProfilePicture} from '../controllers/user.controllers.js';
import multer from 'multer';
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


// // route to be accessed by logged in user those who have token for authentication
// router.route('/updateUserProfilePicture').post(upload.single('profile-pic'),updateProfilePicture);
// User registration and initial steps
router.route('/register-step1').post(registerUserStep1);
router.route('/finalizeInitialRegistration').post(finalizeIntitialRegistration);

// Document uploads
router.route('/upload-profile-picture').post(upload.single('profile-pic'), uploadProfilePicture);
router.route('/updatePanCard').post(upload.single('panCard-pic'), updatePan);
router.route('/updateAdhaar').post(upload.single('adhaar-pic'), updateAdhaar);

router.route('/updateIncomeProof').post(upload.single('incomeProof-pic'), updateIncomeProof);
router.route('/updateUserSignaturePic').post(upload.single('userSignature-pic'), updateSignature);

// Authenticated user actions
router.route('/updateUserProfilePicture').post(upload.single('profile-pic'), updateProfilePicture);

router.route('/healthCheck').get((req,res)=>res.send("OKAYYY"));

/*

todo: 
0. intial registration form submission otp

1. login route with otp everytime

2. forget password

3. set password

4. update user details

5. middleware to check token (authentication middleware)

6. logout route

*/

export {router};