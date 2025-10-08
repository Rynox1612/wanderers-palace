const Listing = require("../models/listing");
module.exports.Index = async (req, res) => {
  let properties = await Listing.find();
  res.render("index", { properties });
};

module.exports.CreateRoute = async (req, res) => {
  console.log(req.file);
  let property = new Listing(req.body.listing);
  await property.save();
  req.flash("success", "Successfully made a new listing!");
  res.redirect("/listings");
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
