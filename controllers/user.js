const User = require("../models/user");

module.exports.signup = async (req, res, next) => {
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
};

module.exports.login = async (req, res) => {
  let { username } = req.body;
  console.log(username);
  req.flash("success", "User login sucessfully ");
  console.log(res.locals.redirectUrl);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  console.log(redirectUrl);

  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "User logged out successfully");
    res.redirect("/listings");
  });
};
