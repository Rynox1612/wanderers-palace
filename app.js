const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./Schema.js");
const e = require("express");
const { equal } = require("joi");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

let MONGOOSE_URL = "mongodb://127.0.0.1:27017/WanderPalace";
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect(MONGOOSE_URL);
}

// Validating middleware
const validateSchema = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  // let errorMsg = error.details.map((el) => el.message).join(", ");
  let errorMsg = error.details
    .map((el) => {
      return el.message;
    })
    .join(", ");
  if (error) {
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

app.listen("8080", () => {
  console.log("server is listening on port 8080");
});

// Index route
app.get("/listings", async (req, res) => {
  let properties = await Listing.find();
  res.render("index", { properties });
});

// Create Route
app.post(
  "/listings",
  validateSchema,
  wrapAsync(async (req, res) => {
    let property = new Listing(req.body.listing);
    await property.save();
    res.redirect("/listings");
  })
);

// NEW FORM
app.get("/listings/new", async (req, res) => {
  res.render("new");
});

// Show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let property = await Listing.findById(id);
    res.render("property.ejs", { property });
  })
);

// Edit page
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let property = await Listing.findById(id);
    res.render("edit", { property });
  })
);

// Edit route
app.post(
  "/listings/:id",
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
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.get("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

app.use((err, req, res, next) => {
  res.send("Something went wrong");
});
