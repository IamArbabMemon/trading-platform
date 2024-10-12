import mongoose from 'mongoose';

const tempModelSchema = new mongoose.Schema({
    username:{
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

const tempForForgetPasswordAdminModel = mongoose.model('tempForForgetPassAdmin', tempModelSchema);

export{
   tempForForgetPasswordAdminModel
};


