const Schemas = require("../models/SchemasModel.js");
const { validateSchemaData } = require("../utils/validation.js");

const createSchema = async (req, res) => {
  const { name, schema } = req.body;

  // Convert schema object to Map if sent as plain object
  const schemaMap = new Map(Object.entries(schema));
  const validationErrors = validateSchemaData({ name, schema: schemaMap });
  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }
  try {
    const newSchema = new Schemas({
      name: name.trim(),
      schema: schemaMap,
    });
    const savedSchema = await newSchema.save();
    res
      .status(201)
      .json({ message: "Schema created successfully", schema: savedSchema });
  } catch (error) {
    console.error("Error creating schema:", error);
    res.status(500).json({ error: "Failed to create schema" });
  }
};

const updateSchema = async (req, res) => {
  const { name, schema } = req.body;

  // Convert schema object to Map if sent as plain object
  const schemaMap = new Map(Object.entries(schema));

  const validationErrors = validateSchemaData({ name, schema: schemaMap });
  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const schemaPlainObject = Object.fromEntries(schemaMap);

    // Find the schema by ID and update it
    const updatedSchema = await Schemas.findOneAndUpdate(
      { name: name.trim() }, // Filter criteria
      { $set: { extras: schemaPlainObject } }, // Update operation
      { new: true } // Return the updated document
    );

    if (!updatedSchema) {
      return res.status(404).json({ error: "Schema not found" });
    }

    res
      .status(200)
      .json({ message: "Schema updated successfully", schema: updatedSchema });
  } catch (error) {
    console.error("Error updating schema:", error);
    res.status(500).json({ error: "Failed to update schema" });
  }
};

const getSchema = async (req, res) => {
  try {
    const { name } = req.query;
    const schema = await Schemas.findOne({ name: name.trim() });
    res.status(200).json(schema);
  } catch (error) {
    console.error("Error fetching schemas:", error);
    res.status(500).json({ error: "Failed to fetch schemas" });
  }
};

module.exports = {
  createSchema,
  updateSchema,
  getSchema,
};
