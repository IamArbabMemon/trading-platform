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

      default:null
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
    required:true
  },

  incomeProof: {
    type: String,  // File path to the uploaded income proof
    required: false,
     default:null   // Required only for F&O trading
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
    default:null
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }

},{timestamps:true});

const accountModel = mongoose.model('Account', accountSchema);

export{
    accountModel
};
