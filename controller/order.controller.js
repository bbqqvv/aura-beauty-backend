const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const Order = require("../model/Order");

// create-payment-intent
exports.paymentIntent = async (req, res, next) => {
  try {
    const product = req.body;
    const price = Number(product.price);
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount,
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    next(error)
  }
};
const Products = require("../model/Products");

// addOrder
exports.addOrder = async (req, res, next) => {
  try {
    const orderItems = await Order.create(req.body);

    // Update product quantities (deduct from stock)
    if (req.body.cart && req.body.cart.length > 0) {
      for (const item of req.body.cart) {
        await Products.updateOne(
          { _id: item._id },
          { $inc: { quantity: -item.orderQuantity } }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Order added successfully",
      order: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getOrders = async (req, res, next) => {
  try {
    const { page, limit, searchTerm } = req.query || {};
    const pages = Number(page) || 1;
    const limits = Number(limit) || 20;
    const skip = (pages - 1) * limits;

    let queryObject = {};
    if (searchTerm) {
      queryObject = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
          { _id: mongoose.Types.ObjectId.isValid(searchTerm) ? searchTerm : undefined }
        ].filter(condition => condition._id !== undefined || !condition._id)
      };
      
      // Fix for ID search if valid
      if (mongoose.Types.ObjectId.isValid(searchTerm)) {
        queryObject.$or = [{ _id: searchTerm }];
      } else {
        queryObject.$or = [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } }
        ];
      }
    }

    const orderItems = await Order.find(queryObject)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limits)
      .populate('user');
    
    const total = await Order.countDocuments(queryObject);

    res.status(200).json({
      success: true,
      data: orderItems,
      total,
      page: pages,
      limit: limits
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate('user');
    res.status(200).json(orderItem);
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const oldStatus = order.status;
    
    // If transitioning to cancel, restore stock
    if (newStatus === 'cancel' && oldStatus !== 'cancel') {
      if (order.cart && order.cart.length > 0) {
        for (const item of order.cart) {
          await Products.updateOne(
            { _id: item._id },
            { $inc: { quantity: item.orderQuantity } }
          );
        }
      }
    } 
    // If transitioning FROM cancel to something else, deduct stock again
    else if (oldStatus === 'cancel' && newStatus !== 'cancel') {
      if (order.cart && order.cart.length > 0) {
        for (const item of order.cart) {
          await Products.updateOne(
            { _id: item._id },
            { $inc: { quantity: -item.orderQuantity } }
          );
        }
      }
    }

    await Order.updateOne(
      { _id: req.params.id },
      { $set: { status: newStatus } }
    );

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
