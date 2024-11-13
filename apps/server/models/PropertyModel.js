// models/Property.js
const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  price: {
    type: String,
    required: false,
    min: 0,
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
  },
  amenities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
      required: true, // ensuring at least one amenity is attached
    },
  ],
  contact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  mainImage: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  listedBy: {
    type: String,
    ref: "User",
    required: true,
  },
  extras: {
    type: Map,
  },
  isReadyToPublish: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Property", PropertySchema);
