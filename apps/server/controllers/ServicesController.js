// controllers/serviceController.js

const Service = require("../models/ServicesModel");
const { validateService } = require("../utils/validation");

// Create a new service
exports.createService = async (req, res) => {
  const user = req.user;
  const {
    title,
    details,
    slug,
    mainImage,
    images,
    isReadyToPublish = user?.role === "admin",
  } = req.body;

  // Validate input data

  try {
    const service = new Service({
      title,
      details,
      slug,
      mainImage,
      images,
      isReadyToPublish,
    });

    // Save the new service
    const savedService = await service.save();
    res
      .status(201)
      .json({ message: "Service created successfully", service: savedService });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating service", details: error.message });
  }
};

// Get a service by ID
exports.getServiceById = async (req, res) => {
  const { slug } = req.params;

  try {
    const service = await Service.findOne({ slug });
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching service", details: error.message });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isReadyToPublish: true });
    res.json(services);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching services", details: error.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  const { id, title, details, slug, mainImage, images, isReadyToPublish } =
    req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        title,
        details,
        slug,
        mainImage,
        images,
        isReadyToPublish,
      },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating service", details: error.message });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting service", details: error.message });
  }
};

exports.getNonPublishedServices = async (req, res) => {
  try {
    const services = await Service.find({ isReadyToPublish: false });
    res.json(services);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching services", details: error.message });
  }
};

exports.publishService = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findByIdAndUpdate(
      id,
      { isReadyToPublish: true },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json({ message: "Service published successfully", service });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error publishing service", details: error.message });
  }
}