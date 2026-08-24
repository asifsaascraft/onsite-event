import express from "express";

import {
  registerAdmin,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
  registerAdminValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/authValidator.js";

const router =
  express.Router();

// ==========================================
// Bootstrap Admin Registration
// ==========================================

router.post(
  "/register",
  registerAdminValidator,
  validate,
  registerAdmin,
);

// ==========================================
// Login
// ==========================================

router.post(
  "/login",
  loginValidator,
  validate,
  login,
);

// ==========================================
// Refresh Token
// ==========================================

router.post(
  "/refresh",
  refreshToken,
);

// ==========================================
// Logout
// ==========================================

router.post(
  "/logout",
  logout,
);

// ==========================================
// Current Admin
// ==========================================

router.get(
  "/me",
  protect,
  authorize("admin"),
  getMe,
);

// ==========================================
// Forgot Password
// ==========================================

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  forgotPassword,
);

// ==========================================
// Reset Password
// ==========================================

router.post(
  "/reset-password",
  resetPasswordValidator,
  validate,
  resetPassword,
);


export default router;