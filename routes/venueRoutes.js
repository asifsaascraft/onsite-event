import express from "express";

import {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
} from "../controllers/venueController.js";
import protect from "../middlewares/protect.js";
import authorize from "../middlewares/authorize.js";

import uploadFiles from "../middlewares/uploadFiles.js";

const router =
  express.Router();


// ==========================================
// Create Venue
// ==========================================
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadFiles.single(
    "uploadVenuePhoto",
  ),
  createVenue,
);


// ==========================================
// Get All Venues
// ==========================================
router.get(
  "/",
  protect,
  authorize("admin"),
  getVenues,
);


// ==========================================
// Get Venue By ID
// ==========================================
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getVenueById,
);


// ==========================================
// Update Venue
// ==========================================
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  uploadFiles.single(
    "uploadVenuePhoto",
  ),
  updateVenue,
);


// ==========================================
// Delete Venue
// ==========================================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteVenue,
);


export default router;