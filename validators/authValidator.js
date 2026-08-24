import {
  body,
} from "express-validator";

// ==========================================
// Admin Register
// ==========================================

export const registerAdminValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage(
      "Full name is required.",
    )
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      "Full name must be between 2 and 100 characters.",
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required.",
    )
    .isEmail()
    .withMessage(
      "Please enter a valid email address.",
    )
    .normalizeEmail(),

  body("mobile")
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Please enter a valid mobile number.",
    ),

  body("password")
    .notEmpty()
    .withMessage(
      "Password is required.",
    )
    .isLength({
      min: 8,
      max: 128,
    })
    .withMessage(
      "Password must be between 8 and 128 characters.",
    ),
];

// ==========================================
// Login
// ==========================================

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required.",
    )
    .isEmail()
    .withMessage(
      "Please enter a valid email address.",
    )
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage(
      "Password is required.",
    ),
];

// ==========================================
// Forgot Password
// ==========================================

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required.",
    )
    .isEmail()
    .withMessage(
      "Please enter a valid email address.",
    )
    .normalizeEmail(),
];

// ==========================================
// Reset Password
// ==========================================

export const resetPasswordValidator = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage(
      "Reset token is required.",
    ),

  body("password")
    .notEmpty()
    .withMessage(
      "Password is required.",
    )
    .isLength({
      min: 8,
      max: 128,
    })
    .withMessage(
      "Password must be between 8 and 128 characters.",
    ),
];