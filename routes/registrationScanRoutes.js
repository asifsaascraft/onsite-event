import express from "express";

import {
  scanRegistrationData,
  getRegistrationScanSummary,
} from "../controllers/registrationScanController.js";

import protect from "../middlewares/protect.js";
import authorizeEvent from "../middlewares/authorizeEvent.js";
import validate from "../middlewares/validate.js";

import {
  scanRegistrationDataValidator,
} from "../validators/registrationScanValidator.js";

const router = express.Router();

// ==========================================
// Scan RegistrationData
// ==========================================
router.post(
  "/events/:eventId/registration-data/scan/:categoryId",
  protect,
  authorizeEvent,
  scanRegistrationDataValidator,
  validate,
  scanRegistrationData,
);


// ==========================================
// Get Registration Scan Summary
// ==========================================
router.get(
  "/events/:eventId/registration-scan/summary",
  protect,
  authorizeEvent,
  getRegistrationScanSummary,
);


export default router;