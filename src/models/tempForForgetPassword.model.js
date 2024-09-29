import mongoose from 'mongoose';

const tempModelSchema = new mongoose.Schema({
    userZID:{
        type:String,
        required:true,
        trim:true
    },
      OTP:{
        type:String,
        required:true,
        trim:true
      }

},{timestamps:true});

const tempForForgetPasswordModel = mongoose.model('tempForForgetPassword', tempModelSchema);

export{
   tempForForgetPasswordModel
};


