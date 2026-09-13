import express from "express";

import {
  createCategory,
  getCategories,
  getActiveCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import protect from "../middlewares/protect.js";

import authorizeEvent from "../middlewares/authorizeEvent.js";

import validate from "../middlewares/validate.js";

import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../validators/categoryValidator.js";

const router = express.Router();

// ==========================================
// Create Category
// ==========================================
router.post(
  "/events/:eventId/categories",
  protect,
  authorizeEvent,
  createCategoryValidator,
  validate,
  createCategory,
);

// ==========================================
// Get All Categories
// ==========================================
router.get(
  "/events/:eventId/categories",
  protect,
  authorizeEvent,
  getCategories,
);

// ==========================================
// Get Active Categories
// IMPORTANT: Keep before /:id
// ==========================================
router.get(
  "/events/:eventId/categories/active",
  protect,
  authorizeEvent,
  getActiveCategories,
);

// ==========================================
// Get Category By ID
// ==========================================
router.get(
  "/events/:eventId/categories/:id",
  protect,
  authorizeEvent,
  getCategoryById,
);

// ==========================================
// Update Category
// ==========================================
router.patch(
  "/events/:eventId/categories/:id",
  protect,
  authorizeEvent,
  updateCategoryValidator,
  validate,
  updateCategory,
);

// ==========================================
// Delete Category
// ==========================================
router.delete(
  "/events/:eventId/categories/:id",
  protect,
  authorizeEvent,
  deleteCategory,
);

export default router;