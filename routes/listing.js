const express = require("express");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { isLoggedIn } = require("../middleware.js");
const { validateSchema } = require("../middleware.js");

// Validating middleware

// Index route
router.get("/", async (req, res) => {
  let properties = await Listing.find().populate("owner");
  res.render("index", { properties });
});

// Create Route
router.post(
  "/",
  isLoggedIn,
  validateSchema,
  wrapAsync(async (req, res) => {
    let property = new Listing({
      ...req.body.listing,
      owner: res.locals.currUser._id,
    });
    await property.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
  })
);

// NEW FORM
router.get("/new", isLoggedIn, async (req, res) => {
  console.log(req.user);
  res.render("new");
});

// Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let property = await Listing.findById(id)
      .populate("review")
      .populate("owner");
    if (!property) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    res.render("property.ejs", { property });
  })
);

// Edit page
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let property = await Listing.findById(id);
    if (!property) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    res.render("edit", { property });
  })
);

// Edit route
router.post(
  "/:id",
  validateSchema,
  wrapAsync(async (req, res) => {
    let property = req.body.listing;
    let { id } = req.params;
    req.flash("success", "Successfully updated the listing!");
    await Listing.findByIdAndUpdate(id, property, {
      new: true,
      runValidators: true,
    });

    res.redirect(`/listings/${id}`);
  })
);

// Destroy route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const property = await Listing.findByIdAndDelete(id);
    if (!property) {
      req.flash("error", "Cannot find your requested listing!");
      return res.redirect("/listings");
    }

    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
  })
);

module.exports = router;
