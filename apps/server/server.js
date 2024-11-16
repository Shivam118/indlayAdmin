// server.js
const express = require("express");
const cors = require("cors");
const userController = require("./controllers/UserController");
const propertyController = require("./controllers/PropertyController");
const amenityController = require("./controllers/AmenityController");
const serviceController = require("./controllers/ServicesController");
const schemaController = require("./controllers/SchemaController");
const { verifyToken, isAdmin } = require("./middleware/auth");
const { PORT } = require("./utils/env");
const dotenv = require("dotenv");
dotenv.config();
require("./db/connection");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
// User routes
app.post("/api/user/register", userController.registerUser); // Register User
app.post("/api/user/login", userController.loginUser); // Login User
app.get("/api/user/users", verifyToken, isAdmin, userController.getAllUsers); // Only admins can access

// Property routes
app.post("/api/property/add", verifyToken, propertyController.createProperty);
app.put("/api/property/update", verifyToken, propertyController.updateProperty);
app.get("/api/properties", verifyToken, propertyController.getAllProperties);
app.get("/api/property/nonPublished", verifyToken, propertyController.getNonPublishedProperties);
app.put("/api/property/publish", verifyToken, propertyController.publishProperty); 


// Service routes
app.post("/api/service/add", verifyToken, serviceController.createService);
app.put("/api/service/update", verifyToken, serviceController.updateService);
app.get("/api/services", verifyToken, serviceController.getAllServices);
app.get("/api/service/nonPublished", verifyToken, serviceController.getNonPublishedServices);
app.put("/api/service/publish", verifyToken, serviceController.publishService);

// Amenity routes
app.post(
  "/api/amenity/add",
  verifyToken,
  isAdmin,
  amenityController.createAmenity
); // Add Amenity
app.get("/api/amenities/all", amenityController.getAllAmenities); // Get all amenities
app.put(
  "/api/amenity/update",
  verifyToken,
  isAdmin,
  amenityController.updateAmenity
); // Update Amenity

// Schema Routes
app.post("/api/schema", verifyToken, schemaController.createSchema); // Add Schema
app.put("/api/schema", verifyToken, schemaController.updateSchema); // Update Schema
app.get("/api/schema", verifyToken, schemaController.getSchema); // Get Schema

// app.post("/api/property/login", propertyController.loginUser);
// app.get(
//   "/api/property/users",
//   verifyToken,
//   isAdmin,
//   propertyController.getAllUsers
// ); // Only admins can access

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
