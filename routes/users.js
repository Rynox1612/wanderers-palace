const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");

let redirectUrl = (req, res, next) => {
  res.locals.redirectUrl = req.session.redirectUrl;
  next();
};

router.get("/register", (req, res) => {
  res.render("users/signup");
});

router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password, confirm_password } = req.body;
      if (password !== confirm_password) {
        req.flash("error", "Passwords do not match");
        return res.redirect("/register");
      } else {
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", "Welcome to Wanderer's Palace");
          res.redirect("/listings");
        });
      }
    } catch (e) {
      if (e.code == 11000) {
        req.flash("error", "Email already exist");
        res.redirect("/register");
      }
      next(e);
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  redirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    faliureFlash: "User not found",
  }),
  wrapAsync(async (req, res) => {
    let { username } = req.body;
    console.log(username);
    req.flash("success", "User login sucessfully ");
    console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    console.log(redirectUrl);

    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "User logged out successfully");
    res.redirect("/listings");
  });
});

module.exports = router;
