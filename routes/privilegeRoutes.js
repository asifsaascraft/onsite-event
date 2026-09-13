import express from "express";

import {
  createPrivilege,
  getPrivileges,
  getPrivilegeMatrix,
  getPrivilegeById,
  updatePrivilege,
  deletePrivilege,
  allowAllCategories,
  blockAllCategories,
} from "../controllers/privilegeController.js";

import protect from "../middlewares/protect.js";

import authorizeEvent from "../middlewares/authorizeEvent.js";

import validate from "../middlewares/validate.js";

import {
  createPrivilegeValidator,
  updatePrivilegeValidator,
} from "../validators/privilegeValidator.js";

const router = express.Router();

// ==========================================
// Create Privilege
// ==========================================
router.post(
  "/events/:eventId/privileges",
  protect,
  authorizeEvent,
  createPrivilegeValidator,
  validate,
  createPrivilege,
);

// ==========================================
// Get All Privileges
// ==========================================
router.get(
  "/events/:eventId/privileges",
  protect,
  authorizeEvent,
  getPrivileges,
);

// ==========================================
// Get Privilege Matrix
// IMPORTANT: Keep before /:id
// ==========================================
router.get(
  "/events/:eventId/privileges/matrix",
  protect,
  authorizeEvent,
  getPrivilegeMatrix,
);

// ==========================================
// Allow All Categories
// IMPORTANT: Keep before /:id
// ==========================================
router.patch(
  "/events/:eventId/privileges/reg-data-types/:regDataTypeId/allow-all",
  protect,
  authorizeEvent,
  allowAllCategories,
);

// ==========================================
// Block All Categories
// IMPORTANT: Keep before /:id
// ==========================================
router.patch(
  "/events/:eventId/privileges/reg-data-types/:regDataTypeId/block-all",
  protect,
  authorizeEvent,
  blockAllCategories,
);

// ==========================================
// Get Privilege By ID
// ==========================================
router.get(
  "/events/:eventId/privileges/:id",
  protect,
  authorizeEvent,
  getPrivilegeById,
);

// ==========================================
// Update Privilege
// ==========================================
router.patch(
  "/events/:eventId/privileges/:id",
  protect,
  authorizeEvent,
  updatePrivilegeValidator,
  validate,
  updatePrivilege,
);

// ==========================================
// Delete Privilege
// ==========================================
router.delete(
  "/events/:eventId/privileges/:id",
  protect,
  authorizeEvent,
  deletePrivilege,
);

export default router;