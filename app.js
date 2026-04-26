const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.set("view Engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// app.get("/testListing",async (req,res)=>{
//     let sample1 = new Listing({
//         title: "My new Villa.",
//         description: "The expensive thing i have ever bought",
//         image:"https://unsplash.com/photos/a-house-with-a-lot-of-windows-lit-up-at-night-7OFTxbGWqwk",
//         price: 20000000,
//         location: "Shimla",
//         country: "India",
//     });

// sample1.save();
// console.log("Sample saved");
// res.send("successful testing");
// });

// Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  }),
);

//  Add Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    // if (!req.body.listing.image) {
    //   req.body.listing.image = undefined;
    // }
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing!");
    }
    const newListing = new Listing(req.body.listing);
    if(!newListing.title){
        throw new ExpressError(400, "Title is missing!");
    }
    if(!newListing.description){
        throw new ExpressError(400, "Description is missing!");
    }
    if(!newListing.price){
        throw new ExpressError(400, "Price is missing!");
    }
    if(!newListing.country){
        throw new ExpressError(400, "Country is missing!");
    }
    if(!newListing.location){
        throw new ExpressError(400, "Location is missing!");
    }
    await newListing.save();
    res.redirect("/listings");
  }),
);

//  Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  }),
);

// Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }),
);

// Update Route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing!");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }),
);

// Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

// Starting Route
app.get("/", (req, res) => {
  res.send("Hi, I am root.");
});

// app.all("/*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("App is listening on port 8080");
});
