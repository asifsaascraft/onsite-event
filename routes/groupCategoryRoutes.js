import express from "express";
import {
  createGroupCategory,
  getGroupCategories,
  getGroupCategoryById,
  updateGroupCategory,
  deleteGroupCategory,
} from "../controllers/groupCategoryController.js";
import protect from "../middlewares/protect.js";
import authorizeEvent from "../middlewares/authorizeEvent.js";
import validate from "../middlewares/validate.js";

import {
  createGroupCategoryValidator,
  updateGroupCategoryValidator,
} from "../validators/groupCategoryValidator.js";

const router = express.Router();

// ==========================================
// Create GroupCategory
// ==========================================
router.post(
  "/events/:eventId/group-categories",
  protect,
  authorizeEvent,
  createGroupCategoryValidator,
  validate,
  createGroupCategory,
);

// ==========================================
// Get All GroupCategories
// ==========================================
router.get(
  "/events/:eventId/group-categories",
  protect,
  authorizeEvent,
  getGroupCategories,
);

// ==========================================
// Get GroupCategory By ID
// ==========================================
router.get(
  "/events/:eventId/group-categories/:id",
  protect,
  authorizeEvent,
  getGroupCategoryById,
);

// ==========================================
// Update GroupCategory
// ==========================================
router.patch(
  "/events/:eventId/group-categories/:id",
  protect,
  authorizeEvent,
  updateGroupCategoryValidator,
  validate,
  updateGroupCategory,
);

// ==========================================
// Delete GroupCategory
// ==========================================
router.delete(
  "/events/:eventId/group-categories/:id",
  protect,
  authorizeEvent,
  deleteGroupCategory,
);

export default router;