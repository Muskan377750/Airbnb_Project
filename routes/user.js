const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.signupForm)
.post(
  wrapAsync(userController.signedUpUser),
);


router.route("/login")
.get( userController.loginForm)
.post(saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loggedinUser,
);

router.get("/logout", userController.loggedoutUser);

module.exports = router;
