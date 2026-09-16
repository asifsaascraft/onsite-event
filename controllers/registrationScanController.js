import mongoose from "mongoose";

import RegistrationScan from "../models/RegistrationScan.js";
import RegistrationData from "../models/RegistrationData.js";
import RegDataType from "../models/RegDataType.js";
import Category from "../models/Category.js";
import Privilege from "../models/Privilege.js";
import Event from "../models/Event.js";

import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/response.js";

// ==========================================
// Scan RegistrationData
// ==========================================

export const scanRegistrationData = asyncHandler(async (req, res) => {
  const { eventId, categoryId } = req.params;

  const { regNum } = req.body;

  // ==========================================
  // Validate Event ID
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID.", 400);
  }

  // ==========================================
  // Validate Category ID
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError("Invalid category ID.", 400);
  }

  // ==========================================
  // Check Event
  // ==========================================

  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  // ==========================================
  // Get RegistrationData by RegNum
  // ==========================================

  const registrationData = await RegistrationData.findOne({
    eventId,
    regNum,
  });

  if (!registrationData) {
    throw new AppError("Registration number not found in this event.", 404);
  }

  // ==========================================
  // Get RegDataType
  // ==========================================

  const regDataType = await RegDataType.findOne({
    _id: registrationData.regDataTypeId,
    eventId,
  });

  if (!regDataType) {
    throw new AppError("Reg data type not found in this event.", 404);
  }

  // ==========================================
  // Get Category
  // ==========================================

  const category = await Category.findOne({
    _id: categoryId,
    eventId,
  }).populate("groupCategoryId", "groupCategoryName description");

  if (!category) {
    throw new AppError("Category not found in this event.", 404);
  }

  // ==========================================
  // Check Category Status
  // ==========================================

  if (category.status !== "active") {
    throw new AppError("This category is inactive.", 403);
  }

  // ==========================================
  // Check Privilege
  // ==========================================

  const privilege = await Privilege.findOne({
    eventId,
    regDataTypeId: regDataType._id,
    categoryId: category._id,
  });

  // ==========================================
  // Privilege Not Configured
  // ==========================================

  if (!privilege) {
    throw new AppError(
      `Category "${category.categoryName}" is not allowed for reg data type "${regDataType.regDataTypeName}".`,
      403,
    );
  }

  // ==========================================
  // Privilege Not Allowed
  // ==========================================

  if (!privilege.isAllowed) {
    throw new AppError(
      `Category "${category.categoryName}" is not allowed for reg data type "${regDataType.regDataTypeName}".`,
      403,
    );
  }

  // ==========================================
  // Check Already Scanned
  // ==========================================

  const existingScan = await RegistrationScan.findOne({
    eventId,
    registrationDataId: registrationData._id,
    categoryId,
  });

  if (existingScan) {
    throw new AppError(
      "Registration has already been scanned for this category.",
      409,
    );
  }

  // ==========================================
  // Create Scan
  // ==========================================

  const registrationScan = await RegistrationScan.create({
    eventId,
    registrationDataId: registrationData._id,
    categoryId,
    isScanned: true,
    scannedAt: new Date(),
  });

  // ==========================================
  // Populate Scan
  // ==========================================

  await registrationScan.populate("eventId", "eventName eventShortName");

  await registrationScan.populate(
    "registrationDataId",
    "regNum name email mobile",
  );

  await registrationScan.populate(
    "categoryId",
    "categoryCode categoryName status groupCategoryId",
  );

  // ==========================================
  // Response
  // ==========================================

  return successResponse(res, {
    statusCode: 201,

    message: "Registration scanned successfully.",

    data: {
      scan: registrationScan,

      registration: {
        _id: registrationData._id,
        regNum: registrationData.regNum,
        name: registrationData.name,
      },

      regDataType: {
        _id: regDataType._id,
        regDataTypeName: regDataType.regDataTypeName,
      },

      category: {
        _id: category._id,
        categoryCode: category.categoryCode,
        categoryName: category.categoryName,
        status: category.status,
        groupCategoryId: category.groupCategoryId,
      },

      isAllowed: true,
      isScanned: true,
      scannedAt: registrationScan.scannedAt,
    },
  });
});
