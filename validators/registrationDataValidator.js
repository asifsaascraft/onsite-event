import { body } from "express-validator";

// ==========================================
// Create RegistrationData Validator
// ==========================================

export const createRegistrationDataValidator = [
  body("regDataTypeId")
    .trim()
    .notEmpty()
    .withMessage(
      "Reg data type is required.",
    ),

  body("name")
    .trim()
    .notEmpty()
    .withMessage(
      "Name is required.",
    )
    .isLength({ max: 100 })
    .withMessage(
      "Name cannot exceed 100 characters.",
    ),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage(
      "Please provide a valid email address.",
    ),

  body("mobile")
    .optional()
    .trim(),

  body("mciNumber")
    .optional()
    .trim(),

  body("address")
    .optional()
    .trim(),

  body("city")
    .optional()
    .trim(),

  body("state")
    .optional()
    .trim(),

  body("country")
    .optional()
    .trim(),

  body("reference")
    .optional()
    .trim(),

  body("note")
    .optional()
    .trim(),
];

// ==========================================
// Update RegistrationData Validator
// ==========================================

export const updateRegistrationDataValidator = [
  body("regDataTypeId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "Reg data type cannot be empty.",
    ),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "Name cannot be empty.",
    )
    .isLength({ max: 100 })
    .withMessage(
      "Name cannot exceed 100 characters.",
    ),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage(
      "Please provide a valid email address.",
    ),

  body("mobile")
    .optional()
    .trim(),

  body("mciNumber")
    .optional()
    .trim(),

  body("address")
    .optional()
    .trim(),

  body("city")
    .optional()
    .trim(),

  body("state")
    .optional()
    .trim(),

  body("country")
    .optional()
    .trim(),

  body("reference")
    .optional()
    .trim(),

  body("note")
    .optional()
    .trim(),
];