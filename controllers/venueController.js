import mongoose from "mongoose";
import Venue from "../models/Venue.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/response.js";
import deleteS3Object from "../utils/deleteS3Object.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";
import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";
import buildFiltersQuery from "../utils/filters.js";

// ==========================================
// Create Venue
// ==========================================
export const createVenue = asyncHandler(async (req, res) => {
  const { venueName, country, state, city, address, website, mapLink } =
    req.body;

  // ==========================================
  // Check Duplicate Venue
  // ==========================================

  const existingVenue = await Venue.findOne({
    venueName: venueName.trim(),
  });

  if (existingVenue) {
    throw new AppError("Venue with this name already exists.", 409);
  }

  if (!req.file) {
    throw new AppError("Venue photo is required.", 400);
  }

  // ==========================================
  // Create Venue
  // ==========================================

  const venue = await Venue.create({
    venueName,
    country,
    state,
    city,
    address,
    website,
    mapLink,
    uploadVenuePhoto: req.file.location,
  });

  return successResponse(res, {
    statusCode: 201,
    message: "Venue created successfully.",
    data: venue,
  });
});

// ==========================================
// Get All Venues
// ==========================================
export const getVenues = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req);

  // ==========================================
  // Search
  // ==========================================

  const searchQuery = buildSearchQuery(req, [
    "venueName",
    "country",
    "state",
    "city",
    "address",
  ]);

  // ==========================================
  // Filters
  // ==========================================

  const filtersQuery = buildFiltersQuery(req, ["country", "state", "city"]);

  // ==========================================
  // Sort
  // ==========================================

  const sortQuery = buildSortQuery(
    req,
    ["venueName", "country", "state", "city", "createdAt"],
    "createdAt",
  );

  // ==========================================
  // Combine Query
  // ==========================================

  const query = {
    ...filtersQuery,
    ...searchQuery,
  };

  // ==========================================
  // Get Venues
  // ==========================================

  const [venues, total] = await Promise.all([
    Venue.find(query).sort(sortQuery).skip(skip).limit(limit),

    Venue.countDocuments(query),
  ]);

  return successResponse(res, {
    message: "Venues fetched successfully.",
    data: venues,
    pagination: buildPaginationMeta(total, page, limit),
  });
});

// ==========================================
// Get Venue By ID
// ==========================================
export const getVenueById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // ==========================================
  // Validate ObjectId
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid venue ID.", 400);
  }

  // ==========================================
  // Find Venue
  // ==========================================

  const venue = await Venue.findById(id);

  if (!venue) {
    throw new AppError("Venue not found.", 404);
  }

  return successResponse(res, {
    message: "Venue fetched successfully.",
    data: venue,
  });
});

// ==========================================
// Update Venue
// ==========================================
export const updateVenue = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // ==========================================
  // Validate ObjectId
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid venue ID.", 400);
  }

  // ==========================================
  // Find Venue
  // ==========================================

  const venue = await Venue.findById(id);

  if (!venue) {
    throw new AppError("Venue not found.", 404);
  }

  // ==========================================
  // Update Venue Name
  // ==========================================

  if (req.body.venueName !== undefined) {
    const existingVenue = await Venue.findOne({
      venueName: req.body.venueName.trim(),

      _id: {
        $ne: id,
      },
    });

    if (existingVenue) {
      throw new AppError("Venue with this name already exists.", 409);
    }

    venue.venueName = req.body.venueName;
  }

  // ==========================================
  // Update Fields
  // ==========================================

  const fields = ["country", "state", "city", "address", "website", "mapLink"];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      venue[field] = req.body[field];
    }
  });

  // ==========================================
  // Update Photo
  // ==========================================

  if (req.file) {
    const oldPhoto = venue.uploadVenuePhoto;

    venue.uploadVenuePhoto = req.file.location;

    if (oldPhoto) {
      await deleteS3Object(oldPhoto);
    }
  }

  // ==========================================
  // Save
  // ==========================================

  await venue.save();

  return successResponse(res, {
    message: "Venue updated successfully.",
    data: venue,
  });
});

// ==========================================
// Delete Venue
// ==========================================
export const deleteVenue = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // ==========================================
  // Validate ObjectId
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid venue ID.", 400);
  }

  // ==========================================
  // Find Venue
  // ==========================================

  const venue = await Venue.findById(id);

  if (!venue) {
    throw new AppError("Venue not found.", 404);
  }

  // ==========================================
  // Delete Photo From S3
  // ==========================================

  if (venue.uploadVenuePhoto) {
    await deleteS3Object(venue.uploadVenuePhoto);
  }

  // ==========================================
  // Delete Venue
  // ==========================================

  await venue.deleteOne();

  return successResponse(res, {
    message: "Venue deleted successfully.",
    data: null,
  });
});
