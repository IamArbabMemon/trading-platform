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

const tempForLoginAdminModel = mongoose.model('tempForLoginForAdmin', tempModelSchema);

export{
   tempForLoginAdminModel
};


