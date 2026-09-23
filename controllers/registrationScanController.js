import mongoose from "mongoose";
import GroupCategory from "../models/GroupCategory.js";
import RegistrationScan from "../models/RegistrationScan.js";
import RegistrationData from "../models/RegistrationData.js";
import RegDataType from "../models/RegDataType.js";
import Category from "../models/Category.js";
import Privilege from "../models/Privilege.js";
import Event from "../models/Event.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";
import buildSortQuery from "../utils/sort.js";
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



// ==========================================
// Get Registration Scan Summary
// ==========================================
export const getRegistrationScanSummary = asyncHandler(
  async (req, res) => {
    const { eventId } = req.params;

    // ==========================================
    // Validate Event ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new AppError("Invalid event ID.", 400);
    }

    // ==========================================
    // Check Event
    // ==========================================

    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError("Event not found.", 404);
    }

    // ==========================================
    // Get Categories
    // ==========================================

    const categories = await Category.find({
      eventId,
      status: "active",
    })
      .populate(
        "groupCategoryId",
        "groupCategoryName description",
      )
      .sort({
        createdAt: 1,
      });

    // ==========================================
    // Prepare Summary
    // ==========================================

    const summary = [];

    for (const category of categories) {
      // ==========================================
      // Get Allowed Registration Data Types
      // ==========================================

      const privileges = await Privilege.find({
        eventId,
        categoryId: category._id,
        isAllowed: true,
      }).select("regDataTypeId");

      const regDataTypeIds = privileges.map(
        (privilege) => privilege.regDataTypeId,
      );

      // ==========================================
      // Total Eligible Registration Data
      // ==========================================

      const total = await RegistrationData.countDocuments({
        eventId,
        regDataTypeId: {
          $in: regDataTypeIds,
        },
      });

      // ==========================================
      // Total Scanned
      // ==========================================

      const scanned = await RegistrationScan.countDocuments({
        eventId,
        categoryId: category._id,
      });

      // ==========================================
      // Coverage
      // ==========================================

      const coverage =
        total > 0
          ? Math.round((scanned / total) * 100)
          : 0;

      // ==========================================
      // Add Category Summary
      // ==========================================

      const groupCategoryId = category.groupCategoryId;

      let groupCategory = summary.find(
        (item) =>
          item.groupCategory._id.toString() ===
          groupCategoryId._id.toString(),
      );

      if (!groupCategory) {
        groupCategory = {
          groupCategory: {
            _id: groupCategoryId._id,
            groupCategoryName:
              groupCategoryId.groupCategoryName,
          },

          categories: [],
        };

        summary.push(groupCategory);
      }

      groupCategory.categories.push({
        categoryId: category._id,
        categoryName: category.categoryName,
        scanned,
        total,
        coverage,
      });
    }

    // ==========================================
    // Response
    // ==========================================

    return successResponse(res, {
      message: "Registration scan summary fetched successfully.",

      data: summary,
    });
  },
);

// ==========================================
// Get All Registration Scans
// ==========================================
export const getRegistrationScans = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // ==========================================
  // Validate Event ID
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID.", 400);
  }

  // ==========================================
  // Check Event
  // ==========================================

  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  // ==========================================
  // Pagination
  // ==========================================

  const { page, limit, skip } = getPagination(req);

  // ==========================================
  // Query
  // ==========================================

  const query = {
    eventId,
  };

  // ==========================================
  // Sort
  // ==========================================

  const sortQuery = buildSortQuery(
    req,
    ["scannedAt", "createdAt"],
    "scannedAt",
  );

  // ==========================================
  // Get Registration Scans
  // ==========================================
  const [scans, total] = await Promise.all([
    RegistrationScan.find(query)
      .populate(
        "eventId",
        "eventName eventShortName",
      )
      .populate(
        "registrationDataId",
        "regNum name email mobile",
      )
      .populate(
        "categoryId",
        "categoryCode categoryName status groupCategoryId",
      )
      .sort(sortQuery)
      .skip(skip)
      .limit(limit),

    RegistrationScan.countDocuments(query),
  ]);

  // ==========================================
  // Response
  // ==========================================

  return successResponse(res, {
    message: "Registration scans fetched successfully.",

    data: scans,

    pagination: buildPaginationMeta(
      total,
      page,
      limit,
    ),
  });
});


// ==========================================
// Get Registration Scan By ID
// ==========================================
export const getRegistrationScanById = asyncHandler(
  async (req, res) => {
    const { eventId, id } = req.params;

    // ==========================================
    // Validate Event ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new AppError("Invalid event ID.", 400);
    }

    // ==========================================
    // Validate Registration Scan ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(
        "Invalid registration scan ID.",
        400,
      );
    }

    // ==========================================
    // Check Event
    // ==========================================

    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError("Event not found.", 404);
    }

    // ==========================================
    // Get Registration Scan
    // ==========================================

    const registrationScan =
      await RegistrationScan.findOne({
        _id: id,
        eventId,
      })
        .populate(
          "eventId",
          "eventName eventShortName",
        )
        .populate(
          "registrationDataId",
          "regNum name email mobile",
        )
        .populate({
          path: "categoryId",
          select:
            "categoryCode categoryName status groupCategoryId",
          populate: {
            path: "groupCategoryId",
            select:
              "groupCategoryName description",
          },
        });

    // ==========================================
    // Check Registration Scan
    // ==========================================

    if (!registrationScan) {
      throw new AppError(
        "Registration scan not found in this event.",
        404,
      );
    }

    // ==========================================
    // Response
    // ==========================================

    return successResponse(res, {
      message: "Registration scan fetched successfully.",

      data: registrationScan,
    });
  },
);