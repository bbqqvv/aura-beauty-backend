const express = require("express");
const router = express.Router();
const { addReview, deleteReviews, deleteReview, replyReview, updateReview} = require("../controller/review.controller");

// add a review
router.post("/add", addReview);
// delete reviews by product id
router.delete("/delete/:id", deleteReviews);
// delete a single review by review id
router.delete("/:id", deleteReview);
// reply to a review
router.put("/reply/:id", replyReview);
// update a review by user within 24h
router.put("/update/:id", updateReview);

module.exports = router;
