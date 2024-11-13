// models/Property.js
const mongoose = require("mongoose");

const SchemasModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  schema: {
    type: Map,
    required: true,
  },
  extras: {
    type: Map,
    required: false,
  },
});

module.exports = mongoose.model("Schemas", SchemasModel);
