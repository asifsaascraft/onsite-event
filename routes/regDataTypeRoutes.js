import express from "express";

import {
  createRegDataType,
  getRegDataTypes,
  getRegDataTypeById,
  updateRegDataType,
  deleteRegDataType,
} from "../controllers/regDataTypeController.js";

import protect from "../middlewares/protect.js";
import authorizeEvent from "../middlewares/authorizeEvent.js";
import validate from "../middlewares/validate.js";

import {
  createRegDataTypeValidator,
  updateRegDataTypeValidator,
} from "../validators/regDataTypeValidator.js";

const router = express.Router();

// ==========================================
// Create RegDataType
// ==========================================
router.post(
  "/events/:eventId/reg-data-types",
  protect,
  authorizeEvent,
  createRegDataTypeValidator,
  validate,
  createRegDataType,
);

// ==========================================
// Get All RegDataTypes
// ==========================================

router.get(
  "/events/:eventId/reg-data-types",
  protect,
  authorizeEvent,
  getRegDataTypes,
);

// ==========================================
// Get RegDataType By ID
// ==========================================

router.get(
  "/events/:eventId/reg-data-types/:id",
  protect,
  authorizeEvent,
  getRegDataTypeById,
);

// ==========================================
// Update RegDataType
// ==========================================

router.patch(
  "/events/:eventId/reg-data-types/:id",
  protect,
  authorizeEvent,
  updateRegDataTypeValidator,
  validate,
  updateRegDataType,
);

// ==========================================
// Delete RegDataType
// ==========================================

router.delete(
  "/events/:eventId/reg-data-types/:id",
  protect,
  authorizeEvent,
  deleteRegDataType,
);

export default router;