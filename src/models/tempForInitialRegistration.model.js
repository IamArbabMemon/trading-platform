import mongoose from 'mongoose';

const tempModelSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      mobileNumber: {
        type: String,
        trim: true,
        required: true,
        // unique: true,
        validate: {
          validator: function (v) {
            return /\d{10}/.test(v);  // Indian 10-digit mobile number validation
          },
          message: props => `${props.value} is not a valid mobile number!`
        },

      },

      address: {
        country: { type: String},
        state:{type:String},
        city: { type: String}
        
      },

      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      },

      password:{
        type:String,
        required:true,
        // unique:true,
      },

      OTP:{
        type:String
      }
    


},{timestamps:true});

const tempInitialRegistrationModel = mongoose.model('tempInitialRegistration', tempModelSchema);

export{
   tempInitialRegistrationModel
};


