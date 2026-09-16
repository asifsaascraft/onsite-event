import { body } from "express-validator";

// ==========================================
// Scan RegistrationData Validator
// ==========================================

export const scanRegistrationDataValidator = [
  body("regNum")
    .trim()
    .notEmpty()
    .withMessage("Registration number is required."),
];