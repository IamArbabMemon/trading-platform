import mongoose from "mongoose";

const stockTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: false,
  },
  stockName : {
    type: String,
    required: false,
    trim: true,
  },

  transactionType: {
    type: String,
    enum: ['buy', 'sell'],
  },

  stockQuantity: {
    type: Number,
    required: false,
    min:0
  },

  pricePerUnit: {
    type: Number,
    required: true,
    min: 0.01, // Minimum price per unit to avoid invalid values
  },

  totalAmount: {
    type: Number,
    required: true,
    min:0.01
  },

  transactionDate: {
    type: Date,
    default: Date.now,
  },

  transactionFee: {
    type: Number,
    required: false
  },

  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed',
  },

}, { timestamps: true });


const stockTransactionModel = mongoose.model('StockTransaction', stockTransactionSchema);



export{
    stockTransactionModel
};



