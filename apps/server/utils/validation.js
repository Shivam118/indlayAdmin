// utils/validation.js

// Validate Register Input
function validateRegisterInput(data) {
  const errors = {};

  // First Name Validation
  if (!data.firstName || typeof data.firstName !== "string") {
    errors.firstName = "First name is required and must be a string.";
  } else if (data.firstName.length < 2 || data.firstName.length > 30) {
    errors.firstName = "First name must be between 2 and 30 characters.";
  }

  // Last Name Validation
  if (!data.lastName || typeof data.lastName !== "string") {
    errors.lastName = "Last name is required and must be a string.";
  } else if (data.lastName.length < 2 || data.lastName.length > 30) {
    errors.lastName = "Last name must be between 2 and 30 characters.";
  }

  // Phone Number Validation
  if (!data.phoneNumber) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!/^[0-9]{10}$/.test(data.phoneNumber)) {
    errors.phoneNumber = "Phone number must be a valid 10-digit number.";
  }

  // Email Validation
  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format.";
  }

  // Password Validation
  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8 || data.password.length > 30) {
    errors.password = "Password must be between 8 and 30 characters.";
  }

  // Role Validation
  if (!data.role) {
    errors.role = "Role is required.";
  } else if (data.role !== "employee" && data.role !== "admin") {
    errors.role = "Role must be either 'Employee' or 'admin'.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Validate Login Input
function validateLoginInput(data) {
  const errors = {};

  // Email Validation
  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format.";
  }

  // Password Validation
  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8 || data.password.length > 30) {
    errors.password = "Password must be between 8 and 30 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Validation for Amenity data
const validateAmenity = (data) => {
  const errors = {};

  // Validate name
  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.name = "Name is required and must be a non-empty string.";
  }

  // Validate description
  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim() === ""
  ) {
    errors.description =
      "Description is required and must be a non-empty string.";
  }

  // Optional icon field validation
  if (data.icon && typeof data.icon !== "string") {
    errors.icon = "Icon, if provided, must be a string (URL).";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// Validation for Property data
const validateProperty = (data) => {
  const errors = {};

  // Validate title
  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim() === ""
  ) {
    errors.title = "Title is required and must be a non-empty string.";
  }

  // Validate description
  if (
    !data.details.description ||
    typeof data.details.description !== "string" ||
    data.details.description.trim() === ""
  ) {
    errors.description =
      "Description is required and must be a non-empty string.";
  }

  // Validate price
  if (
    typeof data.details.price !== "string" ||
    data.details.price.trim() === ""
  ) {
    errors.price = "Price is required";
  }

  // Validate location
  if (!data.details.address || typeof data.details.address !== "string") {
    errors.address = "Address is required and must be a string.";
  }
  if (!data.details.city || typeof data.details.city !== "string") {
    errors.city = "City is required and must be a string.";
  }
  if (!data.details.state || typeof data.details.state !== "string") {
    errors.state = "State is required and must be a string.";
  }
  if (!data.details.country || typeof data.details.country !== "string") {
    errors.country = "Country is required and must be a string.";
  }
  if (!data.details.postalCode || typeof data.details.postalCode !== "string") {
    errors.postalCode = "Postal code is required and must be a string.";
  }
  if (
    typeof data.details.lat !== "string" ||
    typeof data.details.lng !== "string"
  ) {
    errors.lat =
      "Coordinates are required and must include valid latitude and longitude numbers.";
    errors.lng =
      "Coordinates are required and must include valid latitude and longitude numbers.";
  }

  // Validate amenities
  if (!Array.isArray(data.details.amenities)) {
    errors.amenities = "Amenities must be an array of amenity IDs.";
  }

  if (
    !data.details.contactName ||
    typeof data.details.contactName !== "string"
  ) {
    errors.contactName = "Contact name is required and must be a string.";
  }
  if (
    !data.details.contactPhone ||
    typeof data.details.contactPhone !== "string"
  ) {
    errors.contactPhone = "Contact phone is required and must be a string.";
  }
  if (
    !data.details.contactEmail ||
    typeof data.details.contactEmail !== "string"
  ) {
    errors.contactEmail = "Contact email is required and must be a string.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// Validation for Service data
const validateService = (data) => {
  const errors = {};

  // Validate name
  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.name = "Name is required and must be a non-empty string.";
  }

  // Validate description
  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim() === ""
  ) {
    errors.description =
      "Description is required and must be a non-empty string.";
  }

  // Validate price
  if (
    data.price !== undefined &&
    (typeof data.price !== "number" || data.price < 0)
  ) {
    errors.price = "Price must be a positive number if provided.";
  }

  // Validate generalInfo
  if (!data.generalInfo || typeof data.generalInfo !== "object") {
    errors.generalInfo =
      "General information is required and must be an object.";
  } else {
    const listingTypes = ["sale", "rent"];
    const statuses = ["available", "sold", "rented"];

    if (
      !data.generalInfo.listingType ||
      !listingTypes.includes(data.generalInfo.listingType)
    ) {
      errors.listingType = `Listing type must be one of: ${listingTypes.join(
        ", "
      )}.`;
    }

    if (
      !data.generalInfo.status ||
      !statuses.includes(data.generalInfo.status)
    ) {
      errors.status = `Status must be one of: ${statuses.join(", ")}.`;
    }

    if (
      !data.generalInfo.contact ||
      typeof data.generalInfo.contact !== "object"
    ) {
      errors.contact = "Contact information is required and must be an object.";
    } else {
      if (
        !data.generalInfo.contact.name ||
        typeof data.generalInfo.contact.name !== "string"
      ) {
        errors.contactName = "Contact name is required and must be a string.";
      }
      if (
        !data.generalInfo.contact.phone ||
        typeof data.generalInfo.contact.phone !== "string"
      ) {
        errors.contactPhone = "Contact phone is required and must be a string.";
      }
      if (
        !data.generalInfo.contact.email ||
        typeof data.generalInfo.contact.email !== "string"
      ) {
        errors.contactEmail = "Contact email is required and must be a string.";
      }
    }
  }

  // Validate listedBy
  if (!data.listedBy || typeof data.listedBy !== "string") {
    errors.listedBy = "ListedBy must be a valid user email.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// Validate for Schema's
const validateSchemaData = (data) => {
  const errors = {};

  // Validate name
  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length === 0
  ) {
    errors.name = "Name is required and must be a non-empty string.";
  }

  // Validate schema (must be a Map with specific field structure)
  if (!data.schema || !(data.schema instanceof Map) || data.schema.size === 0) {
    errors.schema = "Schema is required and must be a non-empty Map.";
  } else {
    // Additional schema field validation if needed
    data.schema.forEach((value, key) => {
      if (typeof key !== "string" || key.trim() === "") {
        errors[`schema.${key}`] =
          "All keys in schema must be non-empty strings.";
      }
      if (typeof value === "undefined") {
        errors[`schema.${key}`] =
          "All fields in schema must have a defined value.";
      }
    });
  }

  return errors;
};

module.exports = {
  validateService,
  validateAmenity,
  validateProperty,
  validateRegisterInput,
  validateLoginInput,
  validateSchemaData,
};
