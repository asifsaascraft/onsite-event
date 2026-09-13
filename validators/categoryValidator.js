import { body } from "express-validator";

// ==========================================
// Create Category Validator
// ==========================================

export const createCategoryValidator = [
  body("categoryCode")
    .trim()
    .notEmpty()
    .withMessage("Category code is required.")
    .isLength({ max: 50 })
    .withMessage(
      "Category code cannot exceed 50 characters.",
    ),

  body("categoryName")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ max: 250 })
    .withMessage(
      "Category name cannot exceed 250 characters.",
    ),

  body("groupCategoryId")
    .trim()
    .notEmpty()
    .withMessage(
      "Group category is required.",
    ),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage(
      "Status must be either active or inactive.",
    ),

  body("day")
    .optional()
    .trim(),

  body("hall")
    .optional()
    .trim(),

  body("session")
    .optional()
    .trim(),

  body("time")
    .optional()
    .trim(),
];

// ==========================================
// Update Category Validator
// ==========================================

export const updateCategoryValidator = [
  body("categoryCode")
    .trim()
    .notEmpty()
    .withMessage("Category code is required.")
    .isLength({ max: 50 })
    .withMessage(
      "Category code cannot exceed 50 characters.",
    ),

  body("categoryName")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ max: 250 })
    .withMessage(
      "Category name cannot exceed 250 characters.",
    ),

  body("groupCategoryId")
    .trim()
    .notEmpty()
    .withMessage(
      "Group category is required.",
    ),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage(
      "Status must be either active or inactive.",
    ),

  body("day")
    .optional()
    .trim(),

  body("hall")
    .optional()
    .trim(),

  body("session")
    .optional()
    .trim(),

  body("time")
    .optional()
    .trim(),
];