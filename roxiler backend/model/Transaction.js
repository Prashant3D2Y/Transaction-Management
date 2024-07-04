const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dateOfSale: {
    type: Date,
    default: Date.now
  },
  sold: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
