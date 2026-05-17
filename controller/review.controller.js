const mongoose = require("mongoose");
const Order = require("../model/Order");
const Products = require("../model/Products");
const Review = require("../model/Review");
const User = require("../model/User");

// add a review
exports.addReview = async (req, res,next) => {
  const { userId, productId, rating, comment } = req.body;
  try {
    // Check if the user has already left a review for this product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already left a review for this product." });
    }
    const checkPurchase = await Order.findOne({
      user: new mongoose.Types.ObjectId(userId),
      "cart._id": { $in: [productId] },
    });
    if (!checkPurchase) {
      return res
        .status(400)
        .json({ message: "Without purchase you can not give here review!" });
    }

    // Create the new review
    const review = await Review.create(req.body);
    // console.log('review-->',review)

    // Add the review to the product's reviews array
    const product = await Products.findById(productId);
    product.reviews.push(review._id);
    await product.save();

    // Add the review to the user's reviews array
    const user = await User.findById(userId);
    user.reviews.push(review._id);
    await user.save();

    return res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

// delete a review (all for product)
exports.deleteReviews = async (req, res,next) => {
  try {
    const productId = req.params.id;
    const result = await Review.deleteMany({productId: productId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product reviews not found' });
    }
    res.json({ message: 'All reviews deleted for the product' });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

// delete a single review
exports.deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Remove review from product
    if (review.productId) {
      await Products.findByIdAndUpdate(review.productId, {
        $pull: { reviews: reviewId }
      });
    }

    // Remove review from user
    if (review.userId) {
      await User.findByIdAndUpdate(review.userId, {
        $pull: { reviews: reviewId }
      });
    }

    await Review.findByIdAndDelete(reviewId);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
