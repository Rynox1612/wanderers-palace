const mongoose = require("mongoose");
const Review = require("./review");

let Schema = mongoose.Schema;

let listingSchema = new Schema({
  title: {
    type: String,
  },

  description: {
    type: String,
  },

  price: {
    type: Number,
  },

  image: {
    url: {
      type: String,
      set: (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvHdRZDerGbZ57-ps_PwHdfI90X4p1sr8I4w&s",
    },
  },

  country: {
    type: String,
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
