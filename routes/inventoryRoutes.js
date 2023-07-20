const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const InventoryItem = require('../models/InventoryItem');
const ConsumptionBill = require('../models/ConsumptionBill');
const AdditionBill = require('../models/AdditionBill');

// Add consumption bill
router.post('/consumption', async (req, res) => {
  try {
    const { itemId, quantityConsumed } = req.body;

    // Check if itemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Invalid itemId' });
    }

    const inventoryItem = await InventoryItem.findById(itemId);

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    const consumptionBill = new ConsumptionBill({
      item: itemId,
      quantityConsumed,
    });

    inventoryItem.stockQuantity -= quantityConsumed;

    await consumptionBill.save();
    await inventoryItem.save();

    res.status(201).json(consumptionBill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// Add addition bill
router.post('/addition', async (req, res) => {
  try {
    const { itemId, quantityAdded } = req.body;

    // Check if itemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Invalid itemId' });
    }

    // Find the inventory item with the provided itemId
    let inventoryItem = await InventoryItem.findById(itemId);

    // If the inventory item does not exist, create a new one
    if (!inventoryItem) {
      inventoryItem = new InventoryItem({
        _id: itemId, 
        name: 'salt', 
        description: 'a pure salt', 
        stockQuantity: 0, 
    });
  }

    // Create a new addition bill
    const additionBill = new AdditionBill({
      item: itemId,
      quantityAdded,
    });

    // Update the stockQuantity of the inventory item
    inventoryItem.stockQuantity += quantityAdded;

    // Save the addition bill and inventory item to the database
    await additionBill.save();
    await inventoryItem.save();

    res.status(201).json(additionBill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
  
  module.exports = router;