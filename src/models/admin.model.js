import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique:true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse:true,
    trim: true,
    lowercase: true,
  },
  mobileNumber: {
    type: String,
    trim: true,
    required: true,
    sparse:true,
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
    trim: true,
    default:null
  },
  address: {
    country: { type: String},
    state:{type:String},
    city: { type: String}
    
  },
  
  aadhaar: {
    type: String,
    trim: true,
    unique: true,
    sparse: true, // Only non-null values will be checked for uniqueness
    validate: {
      validator: function (v) {
        return v ? /\d{12}/.test(v) : true; // Aadhaar number should have 12 digits or can be empty initially
      },
      message: props => `${props.value} is not a valid Aadhaar number!`,
    },
    default: undefined
  },
  
  
  pan: {
    type: String,
    unique: true,
    trim: true,
    // required:true,
    sparse:true,
    validate: {
      validator: function (v) {

        return v ? /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(v) : true; // PAN number format or can be empty initially
      },
      message: props => `${props.value} is not a valid PAN number!`,
    },
    default: undefined
  },

  profilePhoto: {
    type: String,  // File path to the profile photo
    required: false,
    default:undefined
  },

  profileLocalPath:{
    type: String,  // File path to the profile photo
    required: false,
    default:undefined
  },

  
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
  },

  AdhaarCardPicture: {
    type: String,  // File path to the signature image
    //required: true,
    default:undefined
  },

  PanCardPicture: {
    type: String,  // File path to the signature image
    //required: true,
    default:undefined
  }

},{timestamps:true});

const adminModel = mongoose.model('Admin', userSchema);

export{
    adminModel
};
