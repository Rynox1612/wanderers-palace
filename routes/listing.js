const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { listingSchema } = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const listingRoute = require("../controllers/listing.js");
const upload = require("../upload.js");

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

router
  .route("/")
  .get(wrapAsync(listingRoute.Index))
  .post(
    upload.single("listing[image]"),
    validateSchema,
    wrapAsync(listingRoute.CreateRoute)
  );

router.get("/new", wrapAsync(listingRoute.RenderCreateForm));

router
  .route("/:id")
  .get(wrapAsync(listingRoute.ShowRoute))
  .post(validateSchema, wrapAsync(listingRoute.EditRoute))
  .delete(wrapAsync(listingRoute.DestroyRoute));

router.get("/:id/edit", wrapAsync(listingRoute.RenderEditForm));

module.exports = router;
