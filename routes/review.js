const Listing = require("../models/listing");
const Review = require("../models/review");
const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../Schema");
const wrapAsync = require("../utils/wrapAsync");
const reviewRoute = require("../controllers/review");

// Validating middleware
const validateReviewSchema = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    // let errorMsg = error.details.map((el) => el.message).join(", ");
    let errorMsg = error.details
      .map((el) => {
        return el.message;
      })
      .join(", ");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

// CREATE REVIEW ROUTE
router.post(
  "/",
  validateReviewSchema,
  wrapAsync(reviewRoute.CreateReviewRoute)
);

//Delete review route
router.delete("/:reviewID", wrapAsync(reviewRoute.DeleteReviewRoute));

module.exports = router;
