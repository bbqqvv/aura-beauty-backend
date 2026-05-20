const ApiError = require('../errors/api-error');
const Store = require('../model/Store');

// Add a single store branch
exports.addStoreService = async (data) => {
  const store = await Store.create(data);
  return store;
};

// Seed/Add multiple stores (wipes existing stores first to prevent duplicate seed)
exports.addAllStoreService = async (data) => {
  await Store.deleteMany({});
  const stores = await Store.insertMany(data);
  return stores;
};

// Get all active store branches (for clients)
exports.getActiveStoresService = async () => {
  const stores = await Store.find({ status: 'active' }).sort({ createdAt: -1 });
  return stores;
};

// Get all store branches (for admin)
exports.getStoresService = async () => {
  const stores = await Store.find({}).sort({ createdAt: -1 });
  return stores;
};

// Delete a store branch by id
exports.deleteStoreService = async (id) => {
  const store = await Store.findByIdAndDelete(id);
  return store;
};

// Update a store branch by id
exports.updateStoreService = async (id, payload) => {
  const isExist = await Store.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(404, 'Store branch not found!');
  }

  const result = await Store.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

// Get single store details by id
exports.getSingleStoreService = async (id) => {
  const result = await Store.findById(id);
  return result;
};
