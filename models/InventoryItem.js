const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  stockQuantity: {
    type: Number,
    default: 0,
  },
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

module.exports = InventoryItem;