import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";
import validate from "../middlewares/validate.js";
import createUploader from "../middlewares/upload.js";
import {
  createEventValidator,
  updateEventValidator,
} from "../validators/eventValidator.js";

const router = express.Router();

// ==========================================
// Event Logo Upload
// ==========================================
const eventLogoUpload =
  createUploader("event-logos");

// ==========================================
// Create Event
// ==========================================
router.post(
  "/",
  protect,
  authorize("admin"),
  eventLogoUpload.single("uploadEventLogo"),
  createEventValidator,
  validate,
  createEvent,
);

// ==========================================
// Get All Events
// ==========================================
router.get(
  "/",
  protect,
  authorize("admin"),
  getEvents,
);

// ==========================================
// Get Event By ID
// ==========================================
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getEventById,
);

// ==========================================
// Update Event
// ==========================================
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  eventLogoUpload.single("uploadEventLogo"),
  updateEventValidator,
  validate,
  updateEvent,
);

// ==========================================
// Delete Event
// ==========================================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteEvent,
);

export default router;