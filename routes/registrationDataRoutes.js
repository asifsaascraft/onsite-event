import express from "express";
import {
  createRegistrationData,
  getRegistrationData,
  getRegistrationDataSummary,
  getRegistrationDataById,
  updateRegistrationData,
  deleteRegistrationData,
  deleteAllRegistrationData,
  importRegistrationData,
  printRegistrationData,
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
// Get RegistrationData Summary
// ==========================================
router.get(
  "/events/:eventId/registration-data/summary",
  protect,
  authorizeEvent,
  getRegistrationDataSummary,
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
// Print RegistrationData
// ==========================================
router.patch(
  "/events/:eventId/registration-data/:id/print",
  protect,
  authorizeEvent,
  printRegistrationData,
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