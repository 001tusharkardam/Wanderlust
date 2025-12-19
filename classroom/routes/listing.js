const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const wrapAsync = require("../../utils/wrapAsync.js");
const ExpressError = require("../../utils/ExpressError.js");
const { listingSchema } = require("../../schema.js");
const Listing = require("../../models/listing.js");
const {isLoggedIn} = require("../../middleware.js");
const ListingController = require("../../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../../cloudConfig.js");
const upload = multer({storage});

router
.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,
   upload.single("image"),
  //  validateListing,
   wrapAsync(ListingController.createListing));

   //New Route
router.get("/new", isLoggedIn,ListingController.renderNewForm);

   router.route("/:id")
   .get(wrapAsync(ListingController.showListing))
   .put(isLoggedIn, upload.single("image"),  wrapAsync(ListingController.update))
   .delete(isLoggedIn, wrapAsync(ListingController.destroy));


//Edit Route
router.get("/:id/edit",
  isLoggedIn,
   wrapAsync(ListingController.edit));


module.exports = router;
