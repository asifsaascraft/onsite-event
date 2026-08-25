import express from "express";

import {
  createOrganizer,
  getOrganizers,
  getOrganizerById,
  updateOrganizer,
  deleteOrganizer,
} from "../controllers/organizerController.js";

import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";

const router =
  express.Router();

// ==========================================
// Create Organizer
// ==========================================
router.post(
  "/",
  protect,
  authorize("admin"),
  createOrganizer,
);

// ==========================================
// Get All Organizers
// ==========================================
router.get(
  "/",
  protect,
  authorize("admin"),
  getOrganizers,
);

// ==========================================
// Get Organizer By ID
// ==========================================
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getOrganizerById,
);

// ==========================================
// Update Organizer
// ==========================================
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateOrganizer,
);

// ==========================================
// Delete Organizer
// ==========================================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOrganizer,
);

export default router;