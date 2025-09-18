const express = require("express");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { listingSchema } = require("../Schema.js");

// Validating middleware
const validateSchema = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

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

// Index route
router.get("/", async (req, res) => {
  let properties = await Listing.find();
  res.render("index", { properties });
});

// Create Route
router.post(
  "/",
  validateSchema,
  wrapAsync(async (req, res) => {
    let property = new Listing(req.body.listing);
    await property.save();
    res.redirect("/listings");
  })
);

// NEW FORM
router.get("/new", async (req, res) => {
  res.render("new");
});

// Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let property = await Listing.findById(id).populate("review");
    res.render("property.ejs", { property });
  })
);

// Edit page
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let property = await Listing.findById(id);
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
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
