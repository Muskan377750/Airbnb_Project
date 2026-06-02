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
const { listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const listings = require("./routes/listing.js");
const reviews  = require("./routes/review.js");

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

//cookies
// app.get("/getcookies",(req,res)=>{
//   res.cookie("greet","Namaste");
//   res.cookie("madeIn","India");
//   res.send("Sent you some cookies");
// });
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.set("view Engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);

const sessionOptions = {
  secret:"mySecretSuperCode",
  resave:false,
  saveUninitialized:true,
};

app.use(session(sessionOptions));

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
