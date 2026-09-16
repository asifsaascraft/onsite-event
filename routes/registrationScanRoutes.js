import express from "express";

import {
  scanRegistrationData,
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

export default router;