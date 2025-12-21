const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");
const { ref } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: ["Trending", "Iconic Cities", "Mountains", "Amazing pools", "Castles", "Camping", "Farms", "Arctic", "Domes", "Boats"],
    default: "Trending",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,  
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
geometry:{
    type:{
        type:String, // Don't do `{ object:"point"}` - that's a subdocument
        enum:["Point"], // 'location.type' must be 'Point' or 'LineString'
        required:true
    },
    coordinates: {
      type: [Number],
    }
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
     await Review.deleteMany({_id : {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;