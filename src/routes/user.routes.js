import {Router} from 'express';
import { registerUserStep1,updateAdhaar,uploadProfilePicture} from '../controllers/user.controllers.js';
import multer from 'multer';
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5 MB (in bytes)
});

const router = Router();

router.route('/register-step1').post(registerUserStep1);
router.route('/updateAdhaar').post(updateAdhaar);
router.route('/upload-profile-picture').post(upload.single('profile-pic'),uploadProfilePicture);



export {router};