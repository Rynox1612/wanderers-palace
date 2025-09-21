const Listing = require("../models/listing");
const Review = require("../models/review");
const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../Schema");
const wrapAsync = require("../utils/wrapAsync");

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
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    await newReview.save();
    await listing.review.push(newReview);
    await listing.save();
    req.flash("success", "Successfully added a new review!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete review route
router.delete(
  "/:reviewID",
  wrapAsync(async (req, res) => {
    let { id, reviewID } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
