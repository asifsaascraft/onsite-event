import express from "express";
import {
  createRegistrationData,
  getRegistrationData,
  getRegistrationDataById,
  updateRegistrationData,
  deleteRegistrationData,
  deleteAllRegistrationData,
  importRegistrationData,
} from "../controllers/registrationDataController.js";
import protect from "../middlewares/protect.js";
import authorizeEvent from "../middlewares/authorizeEvent.js";
import validate from "../middlewares/validate.js";
import {
  createRegistrationDataValidator,
  updateRegistrationDataValidator,
} from "../validators/registrationDataValidator.js";
import uploadRegistrationData from "../middlewares/uploadRegistrationData.js";
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
// Import RegistrationData
// ==========================================
router.post(
  "/events/:eventId/registration-data/import",
  protect,
  authorizeEvent,
  uploadRegistrationData.single("file"),
  importRegistrationData,
);


// ==========================================
// Delete All RegistrationData
// ==========================================
router.delete(
  "/events/:eventId/registration-data",
  protect,
  authorizeEvent,
  deleteAllRegistrationData,
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