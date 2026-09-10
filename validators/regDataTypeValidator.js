import { body } from "express-validator";

export const createRegDataTypeValidator = [
  body("regDataTypeName")
    .trim()
    .notEmpty()
    .withMessage(
      "Reg data type name is required.",
    )
    .isLength({ max: 100 })
    .withMessage(
      "Reg data type name cannot exceed 100 characters.",
    ),
];

export const updateRegDataTypeValidator = [
  body("regDataTypeName")
    .trim()
    .notEmpty()
    .withMessage(
      "Reg data type name is required.",
    )
    .isLength({ max: 100 })
    .withMessage(
      "Reg data type name cannot exceed 100 characters.",
    ),
];