import { body } from "express-validator";

// ==========================================
// Create GroupCategory Validator
// ==========================================

export const createGroupCategoryValidator = [
  body("groupCategoryName")
    .trim()
    .notEmpty()
    .withMessage(
      "Group category name is required.",
    )
    .isLength({ max: 250 })
    .withMessage(
      "Group category name cannot exceed 250 characters.",
    ),

  body("description")
    .optional()
    .trim(),
];

// ==========================================
// Update GroupCategory Validator
// ==========================================

export const updateGroupCategoryValidator = [
  body("groupCategoryName")
    .trim()
    .notEmpty()
    .withMessage(
      "Group category name is required.",
    )
    .isLength({ max: 250 })
    .withMessage(
      "Group category name cannot exceed 250 characters.",
    ),

  body("description")
    .optional()
    .trim(),
];