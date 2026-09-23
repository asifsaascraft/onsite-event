import express from "express";
import {
  getDashboardStats,
  getRecentScans,
} from "../controllers/dashboardController.js";
import protect from "../middlewares/protect.js";
import authorizeEvent from "../middlewares/authorizeEvent.js";

const router = express.Router();

// ==========================================
// Get Dashboard Stats
// ==========================================
router.get(
  "/events/:eventId/dashboard/stats",
  protect,
  authorizeEvent,
  getDashboardStats,
);

// ==========================================
// Get Recent Scans Feed
// ==========================================
router.get(
  "/events/:eventId/dashboard/recent-scans",
  protect,
  authorizeEvent,
  getRecentScans,
);

export default router;