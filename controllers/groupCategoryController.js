import mongoose from "mongoose";

import GroupCategory from "../models/GroupCategory.js";
import Event from "../models/Event.js";

import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/response.js";

import {
  getPagination,
  buildPaginationMeta,
} from "../utils/pagination.js";

import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";

// ==========================================
// Create GroupCategory
// ==========================================

export const createGroupCategory = asyncHandler(
  async (req, res) => {
    const { eventId } = req.params;
    const {
      groupCategoryName,
      description,
    } = req.body;

    // ==========================================
    // Validate Event ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new AppError(
        "Invalid event ID.",
        400,
      );
    }

    // ==========================================
    // Check Event
    // ==========================================

    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(
        "Event not found.",
        404,
      );
    }

    // ==========================================
    // Check Duplicate GroupCategory
    // ==========================================

    const existingGroupCategory =
      await GroupCategory.findOne({
        eventId,
        groupCategoryName:
          groupCategoryName.trim(),
      });

    if (existingGroupCategory) {
      throw new AppError(
        "Group category name already exists in this event.",
        409,
      );
    }

    // ==========================================
    // Create GroupCategory
    // ==========================================

    const groupCategory =
      await GroupCategory.create({
        eventId,
        groupCategoryName,
        description,
      });

    // ==========================================
    // Populate Event
    // ==========================================

    await groupCategory.populate("eventId");

    return successResponse(res, {
      statusCode: 201,
      message:
        "Group category created successfully.",
      data: groupCategory,
    });
  },
);

// ==========================================
// Get All GroupCategories
// ==========================================

export const getGroupCategories = asyncHandler(
  async (req, res) => {
    const { eventId } = req.params;

    // ==========================================
    // Validate Event ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new AppError(
        "Invalid event ID.",
        400,
      );
    }

    // ==========================================
    // Check Event
    // ==========================================

    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(
        "Event not found.",
        404,
      );
    }

    // ==========================================
    // Pagination
    // ==========================================

    const {
      page,
      limit,
      skip,
    } = getPagination(req);

    // ==========================================
    // Search
    // ==========================================

    const searchQuery =
      buildSearchQuery(req, [
        "groupCategoryName",
        "description",
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

    const sortQuery =
      buildSortQuery(
        req,
        [
          "groupCategoryName",
          "createdAt",
        ],
        "createdAt",
      );

    // ==========================================
    // Get GroupCategories
    // ==========================================

    const [
      groupCategories,
      total,
    ] = await Promise.all([
      GroupCategory.find(query)
        .populate("eventId", "eventName eventShortName")
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),

      GroupCategory.countDocuments(query),
    ]);

    return successResponse(res, {
      message:
        "Group categories fetched successfully.",
      data: groupCategories,
      pagination:
        buildPaginationMeta(
          total,
          page,
          limit,
        ),
    });
  },
);

// ==========================================
// Get GroupCategory By ID
// ==========================================

export const getGroupCategoryById =
  asyncHandler(
    async (req, res) => {
      const {
        eventId,
        id,
      } = req.params;

      // ==========================================
      // Validate IDs
      // ==========================================

      if (
        !mongoose.Types.ObjectId.isValid(
          eventId,
        )
      ) {
        throw new AppError(
          "Invalid event ID.",
          400,
        );
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          id,
        )
      ) {
        throw new AppError(
          "Invalid group category ID.",
          400,
        );
      }

      // ==========================================
      // Check Event
      // ==========================================

      const event =
        await Event.findById(
          eventId,
        );

      if (!event) {
        throw new AppError(
          "Event not found.",
          404,
        );
      }

      // ==========================================
      // Get GroupCategory
      // ==========================================

      const groupCategory =
        await GroupCategory.findOne({
          _id: id,
          eventId,
        }).populate("eventId");

      if (!groupCategory) {
        throw new AppError(
          "Group category not found in this event.",
          404,
        );
      }

      return successResponse(res, {
        message:
          "Group category fetched successfully.",
        data: groupCategory,
      });
    },
  );

// ==========================================
// Update GroupCategory
// ==========================================

export const updateGroupCategory =
  asyncHandler(
    async (req, res) => {
      const {
        eventId,
        id,
      } = req.params;

      // ==========================================
      // Validate IDs
      // ==========================================

      if (
        !mongoose.Types.ObjectId.isValid(
          eventId,
        )
      ) {
        throw new AppError(
          "Invalid event ID.",
          400,
        );
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          id,
        )
      ) {
        throw new AppError(
          "Invalid group category ID.",
          400,
        );
      }

      // ==========================================
      // Check Event
      // ==========================================

      const event =
        await Event.findById(
          eventId,
        );

      if (!event) {
        throw new AppError(
          "Event not found.",
          404,
        );
      }

      // ==========================================
      // Get GroupCategory
      // ==========================================

      const groupCategory =
        await GroupCategory.findOne({
          _id: id,
          eventId,
        });

      if (!groupCategory) {
        throw new AppError(
          "Group category not found in this event.",
          404,
        );
      }

      // ==========================================
      // GroupCategory Name
      // ==========================================

      if (
        req.body.groupCategoryName !==
        undefined
      ) {
        const existing =
          await GroupCategory.findOne({
            eventId,
            groupCategoryName:
              req.body.groupCategoryName.trim(),
            _id: {
              $ne: id,
            },
          });

        if (existing) {
          throw new AppError(
            "Group category name already exists in this event.",
            409,
          );
        }

        groupCategory.groupCategoryName =
          req.body.groupCategoryName;
      }

      // ==========================================
      // Description
      // ==========================================

      if (
        req.body.description !==
        undefined
      ) {
        groupCategory.description =
          req.body.description;
      }

      // ==========================================
      // Save
      // ==========================================

      await groupCategory.save();

      // ==========================================
      // Populate Event
      // ==========================================

      await groupCategory.populate(
        "eventId",
      );

      return successResponse(res, {
        message:
          "Group category updated successfully.",
        data: groupCategory,
      });
    },
  );

// ==========================================
// Delete GroupCategory
// ==========================================

export const deleteGroupCategory =
  asyncHandler(
    async (req, res) => {
      const {
        eventId,
        id,
      } = req.params;

      // ==========================================
      // Validate IDs
      // ==========================================

      if (
        !mongoose.Types.ObjectId.isValid(
          eventId,
        )
      ) {
        throw new AppError(
          "Invalid event ID.",
          400,
        );
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          id,
        )
      ) {
        throw new AppError(
          "Invalid group category ID.",
          400,
        );
      }

      // ==========================================
      // Delete GroupCategory
      // ==========================================

      const groupCategory =
        await GroupCategory.findOne({
          _id: id,
          eventId,
        });

      if (!groupCategory) {
        throw new AppError(
          "Group category not found in this event.",
          404,
        );
      }

      await groupCategory.deleteOne();

      return successResponse(res, {
        message:
          "Group category deleted successfully.",
        data: null,
      });
    },
  );