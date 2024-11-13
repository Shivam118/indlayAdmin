// controllers/serviceController.js

const Service = require("../models/Service");
const { validateService } = require("../utils/validation");

// Create a new service
exports.createService = async (req, res) => {
  const { name, description, image, price, generalInfo, listedBy } = req.body;

  // Validate input data
  const { isValid, errors } = validateService(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: errors });
  }

  try {
    const service = new Service({
      name,
      description,
      image,
      price,
      generalInfo,
      listedBy,
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
  const { id } = req.params;

  try {
    const service = await Service.findById(id).populate("listedBy", "email");
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
    const services = await Service.find().populate("listedBy", "email");
    res.json(services);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching services", details: error.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  const { id } = req.params;

  // Validate input data
  const { isValid, errors } = validateService(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: errors });
  }

  try {
    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });
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
