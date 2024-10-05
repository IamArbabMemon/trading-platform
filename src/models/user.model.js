import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
    trim: true,
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
    trim: true,
    default:null
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
    trim: true,
    unique: true,
    // required:true,
    validate: {
      validator: function (v) {
        return v ? /\d{12}/.test(v) : true; // Aadhaar number should have 12 digits or can be empty initially
      },
      message: props => `${props.value} is not a valid Aadhaar number!`,
    },
    default: null,
  },

  dob:{
    type:Date
  },

  pan: {
    type: String,
    unique: true,
    trim: true,
    // required:true,
    validate: {
      validator: function (v) {

        return v ? /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(v) : true; // PAN number format or can be empty initially
      },
      message: props => `${props.value} is not a valid PAN number!`,
    },
    default: null,
  },

  profilePhoto: {
    type: String,  // File path to the profile photo
    required: false,
    default:null
  },

  profileLocalPath:{
    type: String,  // File path to the profile photo
    required: false,
    default:null
  },

  signature: {
    type: String,  // File path to the signature image
    //required: true,
    default:null
  },

  incomeProof: {
    type: String,  // File path to the signature image
    //required: true,
    default:null
  },

  kycStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  status:{
    type: String,
    enum: ['active', 'frozen'],
    default: 'frozen',
  },
  
  role: {
    type: String,
    enum: ['user', 'admin' ,'moderator'],
    default: 'user',
  },

  AdhaarCardPicture: {
    type: String,  // File path to the signature image
    //required: true,
    default:null
  },

  PanCardPicture: {
    type: String,  // File path to the signature image
    //required: true,
    default:null
  },

  userZID :{
  
    type: String,
    //required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // Check if the value is not empty and if it meets length and pattern requirements.
        return !v || (v.length === 6 && /^[A-Z0-9]{6}$/.test(v));
      },
      message: props => `${props.value} is not a valid Zerodha ID! It should be exactly 6 characters long, containing uppercase letters or numbers.`,
    },
    default:null
}  

},{timestamps:true});

const userModel = mongoose.model('User', userSchema);

export{
    userModel
};
