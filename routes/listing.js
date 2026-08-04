const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// Index route, Create route
router.route("/")
.get(
  wrapAsync(listingController.index)
)
.post(
  isLoggedIn,
  validateListing,
  upload.single("listing[image]"),
  wrapAsync(listingController.addNewListing),
);


//  Add Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show route, Update route, Delete route
router.route("/:id")
.get(
  wrapAsync(listingController.showListing),
)
.put(
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.editListing),
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing),
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm),
);

module.exports = router;
