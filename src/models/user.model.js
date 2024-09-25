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
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\d{6}/.test(v);  // Indian 6-digit pincode validation
        },
        message: props => `${props.value} is not a valid pincode!`
      },
    },
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
  },
  bankDetails: {
    accountNumber: { 
      type: String, 
      required: true,
      validate: {
        validator: function (v) {
          return /\d{9,18}/.test(v);  // Bank account number validation
        },
        message: props => `${props.value} is not a valid bank account number!`
      },
    },
    ifsc: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[A-Za-z]{4}\d{7}$/.test(v);  // IFSC code format validation
        },
        message: props => `${props.value} is not a valid IFSC code!`
      },
    },
    bankName: { type: String, required: true },
    branchName: { type: String, required: true },
  },
  incomeProof: {
    type: String,  // File path to the uploaded income proof
    required: false,  // Required only for F&O trading
  },
  profilePhoto: {
    type: String,  // File path to the profile photo
    required: true,
  },
  signature: {
    type: String,  // File path to the signature image
    required: true,
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  accountType: {
    type: String,
    enum: ['Equity', 'Commodity', 'Demat', 'F&O'],
    required: true,
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
