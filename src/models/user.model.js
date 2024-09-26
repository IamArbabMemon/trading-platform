import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);  // Indian 10-digit mobile number validation
      },
      message: props => `${props.value} is not a valid mobile number!`
    },
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    country: { type: String},
    state:{type:String},
    //line2: { type: String },
    city: { type: String}
    // state: { type: String, required: true },
    // pincode: {
    //   type: String,
    //   required: true,
    //   validate: {
    //     validator: function (v) {
    //       return /\d{6}/.test(v);  // Indian 6-digit pincode validation
    //     },
    //     message: props => `${props.value} is not a valid pincode!`
    //   },
    // },
  },
  aadhaar: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\d{12}/.test(v);  // Aadhaar number should have 12 digits
      },
      message: props => `${props.value} is not a valid Aadhaar number!`
    },
    default:null
  },

  pan: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(v);  // PAN number format
      },
      message: props => `${props.value} is not a valid PAN number!`
    },
    default:null
  },

  profilePhoto: {
    type: String,  // File path to the profile photo
    required: false,
    default:null
  },

  signature: {
    type: String,  // File path to the signature image
    required: true,
    default:null
  },

  kycStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }
  
},{timestamps:true});

const userModel = mongoose.model('User', userSchema);

export{
    userModel
};
