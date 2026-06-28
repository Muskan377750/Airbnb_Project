const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  }),
);

//  Add Route
router.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Create Route
// app.post(
//   "/listings",
//   wrapAsync(async (req, res, next) => {
// if (!req.body.listing.image) {
//   req.body.listing.image = undefined;
// }
// if (!req.body.listing) {
//   throw new ExpressError(400, "Send valid data for listing!");
// }
// const newListing = new Listing(req.body.listing);
// if(!newListing.title){
//     throw new ExpressError(400, "Title is missing!");
// }
// if(!newListing.description){
//     throw new ExpressError(400, "Description is missing!");
// }
// if(!newListing.price){
//     throw new ExpressError(400, "Price is missing!");
// }
// if(!newListing.country){
//     throw new ExpressError(400, "Country is missing!");
// }
// if(!newListing.location){
//     throw new ExpressError(400, "Location is missing!");
// }
//     await newListing.save();
//     res.redirect("/listings");
//   }),
// );

// Create new Route
router.post(
  "/",isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success"," New listing created!");
    res.redirect("/listings");
  }),
);

//  Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","Listing does not exist!");
     return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }),
);


// Edit Route
router.get(
  "/:id/edit",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }),
);

// Update Route
router.put(
  "/:id",isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing!");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
  }),
);

// Delete Route
router.delete(
  "/:id",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
  }),
);

module.exports = router;