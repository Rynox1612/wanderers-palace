const cloudinary = require("../cloudConfig"); // import your config
const fs = require("fs");
const Listing = require("../models/listing"); // assuming this is your Mongoose model

module.exports.CreateRoute = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "wanderers-palace",
    });
    console.log(result);
    fs.unlinkSync(req.file.path);

    // Create new listing with both text and image data
    const property = new Listing(req.body.listing);
    property.image = {
      url: result.secure_url,
      filename: result.public_id,
    };

    await property.save();

    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error uploading:", err);
    req.flash("error", "Something went wrong while uploading!");
    res.redirect("/listings/new");
  }
};

module.exports.Index = async (req, res) => {
  let properties = await Listing.find();
  res.render("index", { properties });
};

module.exports.RenderCreateForm = async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to create listing");
    req.session.redirectUrl = req.originalUrl;
    res.redirect("/login");
  } else {
    console.log(req.user);
    res.render("new");
  }
};

module.exports.ShowRoute = async (req, res) => {
  let { id } = req.params;
  let property = await Listing.findById(id).populate("review");
  if (!property) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  res.render("property.ejs", { property });
};

module.exports.RenderEditForm = async (req, res) => {
  let { id } = req.params;
  let property = await Listing.findById(id);
  if (!property) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  res.render("edit", { property });
};

module.exports.EditRoute = async (req, res) => {
  let property = req.body.listing;
  let { id } = req.params;
  req.flash("success", "Successfully updated the listing!");
  await Listing.findByIdAndUpdate(id, property, {
    new: true,
    runValidators: true,
  });

  res.redirect(`/listings/${id}`);
};

module.exports.DestroyRoute = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  const property = await Listing.findByIdAndDelete(id);
  if (!property) {
    req.flash("error", "Cannot find your requested listing!");
    return res.redirect("/listings");
  }

  req.flash("success", "Successfully deleted the listing!");
  res.redirect("/listings");
};
