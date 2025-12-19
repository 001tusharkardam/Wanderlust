const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};


module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid ID");
  }
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  })
  .populate("owner");
  if (!listing) {
   req.flash("error", "Listing you requested does not exist!");
   throw new ExpressError(404, "Listing not found");
  }

  // If geometry is missing, geocode the location and update the listing
  if (!listing.geometry || !listing.geometry.coordinates) {
    try {
      let response = await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1,
      }).send();
      listing.geometry = response.body.features[0].geometry;
      await listing.save();
    } catch (error) {
      console.error("Error geocoding location:", error);
      // Optionally, set a default geometry or handle error
    }
  }

  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
  })
  .send();



    "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file && req.file.path) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  } else {
    newListing.image = { url: DEFAULT_IMG, filename: "listingimage" };
  }
  newListing.geometry = response.body.features[0].geometry;
  
   let savedListing =  await newListing.save();
   console.log(savedListing);
  req.flash("success", "Successfully added a new listing!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   throw new ExpressError(400, "Invalid ID");
  // }
  const listing = await Listing.findById(id);
  if (!listing) {
   req.flash("error", "Listing you requested does not exist!");
   throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid ID");
  }

  const update = { ...req.body.listing };
  if (req.file && req.file.path) {
    update.image = { url: req.file.path, filename: req.file.filename };
  }

  // Geocode the location if provided
  if (req.body.listing.location) {
    try {
      let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      }).send();
      update.geometry = response.body.features[0].geometry;
    } catch (error) {
      console.error("Error geocoding location:", error);
      // Optionally, handle error
    }
  }

  const listing = await Listing.findByIdAndUpdate(id, update);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  req.flash("success", "Updated the listing!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid ID");
  }
  let deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    throw new ExpressError(404, "Listing not found");
  }
  console.log(deletedListing);
  req.flash("success", "Deleted the listing!");
  res.redirect("/listings");
};

module.exports.show = module.exports.showListing;
module.exports.create = module.exports.createListing;
module.exports.edit = module.exports.renderEditForm;
module.exports.update = module.exports.updateListing;
module.exports.destroy = module.exports.destroyListing;
