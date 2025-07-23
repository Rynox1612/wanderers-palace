const mongoose=require("mongoose");

let Schema=mongoose.Schema;

let listingSchema=new Schema({
    title: {
        type: String,
    },

    description: {
        type: String,
    },

    price: {
        type: Number,
    },

    image:{
        url:{
        type: String,
    },
    },

    country: {
        type: String
    }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports= Listing;