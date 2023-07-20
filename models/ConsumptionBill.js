const mongoose = require('mongoose');

const consumptionBillSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
  },
  quantityConsumed: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ConsumptionBill = mongoose.model('ConsumptionBill', consumptionBillSchema);

module.exports = ConsumptionBill;