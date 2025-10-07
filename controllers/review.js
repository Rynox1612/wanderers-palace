const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.CreateReviewRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);

  await newReview.save();
  await listing.review.push(newReview);
  await listing.save();
  req.flash("success", "Successfully added a new review!");
  res.redirect(`/listings/${id}`);
};

module.exports.DeleteReviewRoute = async (req, res) => {
  let { id, reviewID } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewID } });
  await Review.findByIdAndDelete(reviewID);
  req.flash("success", "Successfully deleted the review!");
  res.redirect(`/listings/${id}`);
};
