const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const userRoute = require("../controllers/user");

let redirectUrl = (req, res, next) => {
  res.locals.redirectUrl = req.session.redirectUrl;
  next();
};

router
  .route("/register")
  .get((req, res) => {
    res.render("users/signup");
  })
  .post(wrapAsync(userRoute.signup));

router
  .route("/login")
  .get((req, res) => {
    res.render("users/login");
  })
  .post(
    redirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      faliureFlash: "User not found",
    }),
    wrapAsync(userRoute.login)
  );

router.get("/logout", userRoute.logout);

module.exports = router;
