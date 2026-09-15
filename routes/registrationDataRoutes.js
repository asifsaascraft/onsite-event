import express from "express";
import {
  createRegistrationData,
  getRegistrationData,
  getRegistrationDataById,
  updateRegistrationData,
  deleteRegistrationData,
} from "../controllers/registrationDataController.js";
import protect from "../middlewares/protect.js";
import authorizeEvent from "../middlewares/authorizeEvent.js";
import validate from "../middlewares/validate.js";
import {
  createRegistrationDataValidator,
  updateRegistrationDataValidator,
} from "../validators/registrationDataValidator.js";

const router = express.Router();

// ==========================================
// Create RegistrationData
// ==========================================
router.post(
  "/events/:eventId/registration-data",
  protect,
  authorizeEvent,
  createRegistrationDataValidator,
  validate,
  createRegistrationData,
);

// ==========================================
// Get All RegistrationData
// ==========================================
router.get(
  "/events/:eventId/registration-data",
  protect,
  authorizeEvent,
  getRegistrationData,
);

// ==========================================
// Get RegistrationData By ID
// ==========================================
router.get(
  "/events/:eventId/registration-data/:id",
  protect,
  authorizeEvent,
  getRegistrationDataById,
);

// ==========================================
// Update RegistrationData
// ==========================================
router.patch(
  "/events/:eventId/registration-data/:id",
  protect,
  authorizeEvent,
  updateRegistrationDataValidator,
  validate,
  updateRegistrationData,
);

// ==========================================
// Delete RegistrationData
// ==========================================
router.delete(
  "/events/:eventId/registration-data/:id",
  protect,
  authorizeEvent,
  deleteRegistrationData,
);

export default router;