import mongoose from "mongoose";

import RegistrationData from "../models/RegistrationData.js";
import RegDataType from "../models/RegDataType.js";
import Event from "../models/Event.js";

import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/response.js";

import { getPagination, buildPaginationMeta } from "../utils/pagination.js";

import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";

// ==========================================
// Generate Registration Number
// ==========================================
const generateRegistrationNumber = async (eventId) => {
  const count = await RegistrationData.countDocuments({
    eventId,
  });

  return `SPOT-${String(count + 1).padStart(3, "0")}`;
};

// ==========================================
// Create RegistrationData
// ==========================================
export const createRegistrationData = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const {
    regDataTypeId,
    name,
    email,
    mobile,
    mciNumber,
    address,
    city,
    state,
    country,
    reference,
    note,
  } = req.body;

  // ==========================================
  // Validate Event ID
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID.", 400);
  }

  // ==========================================
  // Validate RegDataType ID
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(regDataTypeId)) {
    throw new AppError("Invalid reg data type ID.", 400);
  }

  // ==========================================
  // Check Event
  // ==========================================

  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  // ==========================================
  // Check RegDataType
  // ==========================================

  const regDataType = await RegDataType.findOne({
    _id: regDataTypeId,
    eventId,
  });

  if (!regDataType) {
    throw new AppError("Reg data type not found in this event.", 404);
  }

  // ==========================================
  // Create RegistrationData
  // ==========================================

  let registrationData;

  for (let attempt = 0; attempt < 5; attempt++) {
    const regNum = await generateRegistrationNumber(eventId);

    try {
      registrationData = await RegistrationData.create({
        eventId,
        regDataTypeId,
        name,
        regNum,
        email,
        mobile,
        mciNumber,
        address,
        city,
        state,
        country,
        reference,
        note,
      });

      break;
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }
    }
  }

  if (!registrationData) {
    throw new AppError(
      "Unable to generate registration number. Please try again.",
      500,
    );
  }

  // ==========================================
  // Populate Event
  // ==========================================

  await registrationData.populate("eventId", "eventName eventShortName");

  // ==========================================
  // Populate RegDataType
  // ==========================================

  await registrationData.populate("regDataTypeId", "regDataTypeName");

  return successResponse(res, {
    statusCode: 201,
    message: "Registration data created successfully.",
    data: registrationData,
  });
});

// ==========================================
// Get All RegistrationData
// ==========================================

export const getRegistrationData = asyncHandler(async (req, res) => {
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
  // Search
  // ==========================================

  const searchQuery = buildSearchQuery(req, [
    "regNum",
    "name",
    "email",
    "mobile",
    "mciNumber",
    "city",
    "state",
    "country",
    "reference",
  ]);

  // ==========================================
  // Query
  // ==========================================

  const query = {
    eventId,
    ...searchQuery,
  };

  // ==========================================
  // Sort
  // ==========================================

  const sortQuery = buildSortQuery(
    req,
    ["regNum", "name", "createdAt"],
    "createdAt",
  );

  // ==========================================
  // Get RegistrationData
  // ==========================================

  const [registrationData, total] = await Promise.all([
    RegistrationData.find(query)
      .populate("eventId", "eventName eventShortName")
      .populate("regDataTypeId", "regDataTypeName")
      .sort(sortQuery)
      .skip(skip)
      .limit(limit),

    RegistrationData.countDocuments(query),
  ]);

  return successResponse(res, {
    message: "Registration data fetched successfully.",
    data: registrationData,
    pagination: buildPaginationMeta(total, page, limit),
  });
});

// ==========================================
// Get RegistrationData By ID
// ==========================================

export const getRegistrationDataById = asyncHandler(async (req, res) => {
  const { eventId, id } = req.params;

  // ==========================================
  // Validate IDs
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID.", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid registration data ID.", 400);
  }

  // ==========================================
  // Check Event
  // ==========================================

  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  // ==========================================
  // Get RegistrationData
  // ==========================================

  const registrationData = await RegistrationData.findOne({
    _id: id,
    eventId,
  })
    .populate("eventId", "eventName eventShortName")
    .populate("regDataTypeId", "regDataTypeName");

  if (!registrationData) {
    throw new AppError("Registration data not found in this event.", 404);
  }

  return successResponse(res, {
    message: "Registration data fetched successfully.",
    data: registrationData,
  });
});

// ==========================================
// Update RegistrationData
// ==========================================

export const updateRegistrationData = asyncHandler(async (req, res) => {
  const { eventId, id } = req.params;

  const {
    regDataTypeId,
    name,
    email,
    mobile,
    mciNumber,
    address,
    city,
    state,
    country,
    reference,
    note,
  } = req.body;

  // ==========================================
  // Validate IDs
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID.", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid registration data ID.", 400);
  }

  // ==========================================
  // Check Event
  // ==========================================

  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError("Event not found.", 404);
  }

  // ==========================================
  // Get RegistrationData
  // ==========================================

  const registrationData = await RegistrationData.findOne({
    _id: id,
    eventId,
  });

  if (!registrationData) {
    throw new AppError("Registration data not found in this event.", 404);
  }

  // ==========================================
  // RegDataType
  // ==========================================

  if (regDataTypeId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(regDataTypeId)) {
      throw new AppError("Invalid reg data type ID.", 400);
    }

    const regDataType = await RegDataType.findOne({
      _id: regDataTypeId,
      eventId,
    });

    if (!regDataType) {
      throw new AppError("Reg data type not found in this event.", 404);
    }

    registrationData.regDataTypeId = regDataTypeId;
  }

  // ==========================================
  // Name
  // ==========================================

  if (name !== undefined) {
    registrationData.name = name;
  }

  // ==========================================
  // Email
  // ==========================================

  if (email !== undefined) {
    registrationData.email = email;
  }

  // ==========================================
  // Mobile
  // ==========================================

  if (mobile !== undefined) {
    registrationData.mobile = mobile;
  }

  // ==========================================
  // MCI Number
  // ==========================================

  if (mciNumber !== undefined) {
    registrationData.mciNumber = mciNumber;
  }

  // ==========================================
  // Address
  // ==========================================

  if (address !== undefined) {
    registrationData.address = address;
  }

  // ==========================================
  // City
  // ==========================================

  if (city !== undefined) {
    registrationData.city = city;
  }

  // ==========================================
  // State
  // ==========================================

  if (state !== undefined) {
    registrationData.state = state;
  }

  // ==========================================
  // Country
  // ==========================================

  if (country !== undefined) {
    registrationData.country = country;
  }

  // ==========================================
  // Reference
  // ==========================================

  if (reference !== undefined) {
    registrationData.reference = reference;
  }

  // ==========================================
  // Note
  // ==========================================

  if (note !== undefined) {
    registrationData.note = note;
  }

  // ==========================================
  // Save
  // ==========================================

  await registrationData.save();

  // ==========================================
  // Populate Event
  // ==========================================

  await registrationData.populate("eventId", "eventName eventShortName");

  // ==========================================
  // Populate RegDataType
  // ==========================================

  await registrationData.populate("regDataTypeId", "regDataTypeName");

  return successResponse(res, {
    message: "Registration data updated successfully.",
    data: registrationData,
  });
});

// ==========================================
// Delete RegistrationData
// ==========================================

export const deleteRegistrationData = asyncHandler(async (req, res) => {
  const { eventId, id } = req.params;

  // ==========================================
  // Validate IDs
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID.", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid registration data ID.", 400);
  }

  // ==========================================
  // Get RegistrationData
  // ==========================================

  const registrationData = await RegistrationData.findOne({
    _id: id,
    eventId,
  });

  if (!registrationData) {
    throw new AppError("Registration data not found in this event.", 404);
  }

  // ==========================================
  // Delete RegistrationData
  // ==========================================

  await registrationData.deleteOne();

  return successResponse(res, {
    message: "Registration data deleted successfully.",
    data: null,
  });
});
