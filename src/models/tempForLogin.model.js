import mongoose from 'mongoose';

const tempModelSchema = new mongoose.Schema({
    userZID:{
        type:String,
        required:true,
        trim:true
    },
      OTP:{
        type:String
      }
    


},{timestamps:true});

const tempForLoginModel = mongoose.model('tempForLogin', tempModelSchema);

export{
   tempForLoginModel
};


