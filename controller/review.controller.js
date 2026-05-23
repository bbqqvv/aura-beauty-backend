const mongoose = require("mongoose");
const Order = require("../model/Order");
const Products = require("../model/Products");
const Review = require("../model/Review");
const User = require("../model/User");

// add a review
exports.addReview = async (req, res,next) => {
  const { userId, productId, rating, comment } = req.body;
  try {
    // Count orders of the user containing this product
    const orderCount = await Order.countDocuments({
      user: new mongoose.Types.ObjectId(userId),
      "cart._id": productId
    });

    if (orderCount === 0) {
      return res
        .status(400)
        .json({ message: "Bạn phải mua sản phẩm này mới có thể viết đánh giá!" });
    }

    // Count reviews this user has submitted for this product
    const reviewCount = await Review.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId)
    });

    if (reviewCount >= orderCount) {
      return res
        .status(400)
        .json({ message: "Bạn đã đánh giá hết số lần mua của sản phẩm này. Hãy mua thêm để tiếp tục đánh giá!" });
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

// reply to a review
exports.replyReview = async (req, res, next) => {
  try {
    const { reply } = req.body;
    const reviewId = req.params.id;
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { reply },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ message: 'Reply added successfully', review });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// update a review by user within 24h
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Enforce 24-hour limit
    const reviewAgeInHours = (new Date() - new Date(review.createdAt)) / (1000 * 60 * 60);
    if (reviewAgeInHours >= 24) {
      return res.status(400).json({ message: "Đã quá 24 giờ kể từ khi gửi đánh giá, bạn không thể chỉnh sửa!" });
    }
    
    review.rating = rating;
    review.comment = comment;
    await review.save();
    
    res.json({ message: 'Đánh giá đã được cập nhật thành công!', review });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
