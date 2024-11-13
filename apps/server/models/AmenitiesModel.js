const mongoose = require("mongoose");

const AmenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensuring amenities are unique
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: { url: String, alt: String },
    required: true,
  },
});

module.exports = mongoose.model("Amenity", AmenitySchema);
