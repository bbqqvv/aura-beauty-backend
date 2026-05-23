const express = require("express");
const router = express.Router();
const { addReview, deleteReviews, deleteReview, replyReview} = require("../controller/review.controller");

// add a review
router.post("/add", addReview);
// delete reviews by product id
router.delete("/delete/:id", deleteReviews);
// delete a single review by review id
router.delete("/:id", deleteReview);
// reply to a review
router.put("/reply/:id", replyReview);

module.exports = router;
