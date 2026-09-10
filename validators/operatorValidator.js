import { body } from "express-validator";

export const operatorLoginValidator = [
  body("operatorLoginCode")
    .trim()
    .notEmpty()
    .withMessage(
      "Operator login code is required.",
    )
    .isLength({ max: 30 })
    .withMessage(
      "Operator login code cannot exceed 30 characters.",
    ),
];