import mongoose from 'mongoose';

const PaymentHistorySchema = new mongoose.Schema({
  paymentReference: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'success', 'failed'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default PaymentHistorySchema;
