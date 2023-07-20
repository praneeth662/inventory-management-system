const mongoose = require('mongoose');

const additionBillSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
  },
  quantityAdded: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const AdditionBill = mongoose.model('AdditionBill', additionBillSchema);

module.exports = AdditionBill;