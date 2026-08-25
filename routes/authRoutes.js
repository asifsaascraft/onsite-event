import express from "express";

import {
  registerAdmin,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import createUploader from "../middlewares/upload.js";
import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";

import {
  registerAdminValidator,
  loginValidator,
  updateProfileValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/authValidator.js";

const router =
  express.Router();

const uploadProfileImage =
  createUploader("profile-images");

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
// Update Admin Profile
// ==========================================
router.patch(
  "/profile",
  protect,
  authorize("admin"),
  uploadProfileImage.single("profileImage"),
  updateProfileValidator,
  validate,
  updateProfile,
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