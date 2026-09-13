import { body } from "express-validator";

// ==========================================
// Create Privilege Validator
// ==========================================

export const createPrivilegeValidator = [
  body("regDataTypeId")
    .trim()
    .notEmpty()
    .withMessage(
      "Reg data type is required.",
    ),

  body("categoryId")
    .trim()
    .notEmpty()
    .withMessage(
      "Category is required.",
    ),

  body("isAllowed")
    .optional()
    .isBoolean()
    .withMessage(
      "isAllowed must be true or false.",
    ),
];

// ==========================================
// Update Privilege Validator
// ==========================================

export const updatePrivilegeValidator = [
  body("regDataTypeId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "Reg data type cannot be empty.",
    ),

  body("categoryId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "Category cannot be empty.",
    ),

  body("isAllowed")
    .optional()
    .isBoolean()
    .withMessage(
      "isAllowed must be true or false.",
    ),
];