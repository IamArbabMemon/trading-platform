import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  bankDetails: {
    accountNumber: { 
      type: String,                                                  
      required: true,
      sparse:true,
      validate: {
        validator: function (v) {
          return /\d{9,18}/.test(v);  // Bank account number validation
        },
        message: props => `${props.value} is not a valid bank account number!`
      },

      default:undefined
    },
    
    micrCode: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            const micrPattern = /^\d{9}$/;
            return micrPattern.test(v);
          },
          message: props => `${props.value} is not a valid MICR code!`
        }
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
      default:null
    },
    bankName: { type: String, required: false },
    branchName: { type: String, required: false },
  },
  
  user:{
    type:mongoose.Schema.Types.ObjectId,
    unique:true,
    sparse:true,
    default:undefined
  },

  incomeProof: {
    type: String,  // File path to the uploaded income proof
    required: false,
     default:undefined   // Required only for F&O trading
  },

  accountType: {
    type: String,
    enum: ['Equity','Demat', 'F&O'],
    required: false,
  },
  
  upiId: {
    type: String,
    unique: true,
    sparse:true,
    validate: {
      validator: function (v) {

        if (v == null) return true;

        const upiIdPattern = /^[a-zA-Z0-9.\-_]{2,32}@[a-zA-Z]{2,20}$/;
        return upiIdPattern.test(v);
    
      },
      message: props => `${props.value} is not a valid UPI ID!`
    },
    default:undefined
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  accountBalance:{
    type:Number,
    default:undefined
  }

},{timestamps:true});

const accountModel = mongoose.model('Account', accountSchema);

export{
    accountModel
};
