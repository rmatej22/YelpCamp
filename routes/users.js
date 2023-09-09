const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (error) => {
        if (error) {
          return next(error);
        }
        req.flash("success", "Welcome to YelpCamp!");
        res.redirect("/campgrounds");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  // use the storeReturnTo middleware to save the returnTo value from session to res.locals
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true,
  }),
  (req, res) => {
    req.flash("success", "welcome back!");
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
