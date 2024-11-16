// models/Property.js
const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  details: {
    type: Map,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  amenities: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Amenity",
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
  isReadyToPublish: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Property", PropertySchema);
