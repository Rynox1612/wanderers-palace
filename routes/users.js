const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/signup");
});

router.post("/register", (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    req.flash("error", "Passwords do not match");
    return res.redirect("/users/register");
  } else {
    const newUser = new User({ username, email });
    User.register(newUser, password);
    req.flash("success", "You are registered");
    res.redirect("/listings");
  }
});

module.exports = router;
