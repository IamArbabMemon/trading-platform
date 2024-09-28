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

const tempForLoginModel = mongoose.model('tempForLogin', tempModelSchema);

export{
   tempForLoginModel
};


