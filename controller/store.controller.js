const storeService = require('../services/store.service');

// Add store branch
exports.addStore = async (req, res, next) => {
  try {
    const result = await storeService.addStoreService(req.body);
    res.status(201).json({
      success: true,
      status: "success",
      message: "Store branch created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Add / Seed multiple stores
exports.addAllStore = async (req, res, next) => {
  try {
    const result = await storeService.addAllStoreService(req.body);
    res.status(200).json({
      success: true,
      message: 'Store branches seeded/added successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};

// Get all stores (Admin)
exports.getAllStores = async (req, res, next) => {
  try {
    const result = await storeService.getStoresService();
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// Get active stores (Client)
exports.getActiveStores = async (req, res, next) => {
  try {
    const result = await storeService.getActiveStoresService();
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

// Delete store branch
exports.deleteStore = async (req, res, next) => {
  try {
    await storeService.deleteStoreService(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Store branch deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update store branch details
exports.updateStore = async (req, res, next) => {
  try {
    const result = await storeService.updateStoreService(req.params.id, req.body);
    res.status(200).json({
      success: true,
      status: true,
      message: 'Store branch updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get single store details
exports.getSingleStore = async (req, res, next) => {
  try {
    const result = await storeService.getSingleStoreService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
