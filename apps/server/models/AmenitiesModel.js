const mongoose = require("mongoose");

const AmenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensuring amenities are unique
    trim: true,
  },
  icon: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Amenity", AmenitySchema);
