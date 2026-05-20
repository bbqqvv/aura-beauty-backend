const express = require('express');
const router = express.Router();
const storeController = require('../controller/store.controller');

// Add a Store branch
router.post('/add', storeController.addStore);

// Add / Seed multiple Store branches
router.post('/add-all', storeController.addAllStore);

// Get active Store branches (for clients)
router.get('/active', storeController.getActiveStores);

// Get all Store branches (for admin)
router.get('/all', storeController.getAllStores);

// Get single Store details
router.get('/get/:id', storeController.getSingleStore);

// Delete a Store branch
router.delete('/delete/:id', storeController.deleteStore);

// Update a Store branch
router.patch('/edit/:id', storeController.updateStore);

module.exports = router;
