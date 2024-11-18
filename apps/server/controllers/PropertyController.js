// controllers/propertyController.js

const Property = require("../models/PropertyModel");
const Amenity = require("../models/AmenitiesModel");
const { validateProperty } = require("../utils/validation");

// Create a new property
exports.createProperty = async (req, res) => {
  try {
    const { isValid, errors } = validateProperty(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const user = req.user;
    const {
      title,
      slug,
      details,
      mainImage,
      images,
      isReadyToPublish = user?.role === "admin",
    } = req.body;

    const { amenities, ...rest } = details;
    // Check if all provided amenities exist
    const amenityRecords = await Amenity.find({ _id: { $in: amenities } });
    if (amenityRecords.length !== amenities.length) {
      return res
        .status(400)
        .json({ error: "One or more amenities do not exist" });
    }

    const property = new Property({
      title,
      slug,
      details: rest,
      amenities,
      mainImage,
      images,
      isReadyToPublish,
    });

    await property.save();
    res
      .status(201)
      .json({ message: "Property created successfully", property });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating property", details: error.message });
  }
};

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isReadyToPublish: true }).populate(
      "amenities"
    );
    res.status(200).json(properties);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching properties", details: error.message });
  }
};

// Get a single property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const { isValid, errors } = validateProperty(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const property = await Property.findOne({ slug: req.params.slug }).populate(
      "amenities"
    );
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching property", details: error.message });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  try {
    const { isValid, errors } = validateProperty(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const user = req.user;
    const {
      id,
      title,
      slug,
      details,
      mainImage,
      images,
      isReadyToPublish = user?.role === "admin",
    } = req.body;

    const { amenities, ...rest } = details;

    // Validate amenities if provided
    if (amenities) {
      const amenityRecords = await Amenity.find({ _id: { $in: amenities } });
      if (amenityRecords.length !== amenities.length) {
        return res
          .status(400)
          .json({ error: "One or more amenities do not exist" });
      }
    }

    const property = await Property.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        details: rest,
        mainImage,
        images,
        isReadyToPublish,
      },
      { new: true }
    );

    if (!property) return res.status(404).json({ error: "Property not found" });
    res
      .status(200)
      .json({ message: "Property updated successfully", property });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating property", details: error.message });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting property", details: error.message });
  }
};

exports.getNonPublishedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isReadyToPublish: false });
    res.status(200).json(properties);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching properties", details: error.message });
  }
};

exports.publishProperty = async (req, res) => {
  try {
    const { id } = req.body;
    const property = await Property.findByIdAndUpdate(
      id,
      { isReadyToPublish: true },
      { new: true }
    );
    if (!property) return res.status(404).json({ error: "Property not found" });
    res
      .status(200)
      .json({ message: "Property published successfully", property });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error publishing property", details: error.message });
  }
};
