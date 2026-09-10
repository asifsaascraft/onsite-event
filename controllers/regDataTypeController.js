import mongoose from "mongoose";

import RegDataType from "../models/RegDataType.js";
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
// Create RegDataType
// ==========================================

export const createRegDataType = asyncHandler(
  async (req, res) => {
    const { eventId } = req.params;
    const { regDataTypeName } = req.body;

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
    // Check Duplicate RegDataType
    // ==========================================

    const existingRegDataType =
      await RegDataType.findOne({
        eventId,
        regDataTypeName: regDataTypeName.trim(),
      });

    if (existingRegDataType) {
      throw new AppError(
        "Reg data type name already exists in this event.",
        409,
      );
    }

    // ==========================================
    // Create RegDataType
    // ==========================================

    const regDataType =
      await RegDataType.create({
        eventId,
        regDataTypeName,
      });

    // ==========================================
    // Populate Event
    // ==========================================

    await regDataType.populate("eventId");

    return successResponse(res, {
      statusCode: 201,
      message:
        "Reg data type created successfully.",
      data: regDataType,
    });
  },
);

// ==========================================
// Get All RegDataTypes
// ==========================================

export const getRegDataTypes = asyncHandler(
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
        "regDataTypeName",
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
          "regDataTypeName",
          "createdAt",
        ],
        "createdAt",
      );

    // ==========================================
    // Get RegDataTypes
    // ==========================================

    const [
      regDataTypes,
      total,
    ] = await Promise.all([
      RegDataType.find(query)
        .populate("eventId")
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),

      RegDataType.countDocuments(query),
    ]);

    return successResponse(res, {
      message:
        "Reg data types fetched successfully.",
      data: regDataTypes,
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
// Get RegDataType By ID
// ==========================================

export const getRegDataTypeById =
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
          "Invalid reg data type ID.",
          400,
        );
      }

      // ==========================================
      // Check Event
      // ==========================================

      const event = await Event.findById(
        eventId,
      );

      if (!event) {
        throw new AppError(
          "Event not found.",
          404,
        );
      }

      // ==========================================
      // Get RegDataType
      // ==========================================

      const regDataType =
        await RegDataType.findOne({
          _id: id,
          eventId,
        }).populate("eventId");

      if (!regDataType) {
        throw new AppError(
          "Reg data type not found in this event.",
          404,
        );
      }

      return successResponse(res, {
        message:
          "Reg data type fetched successfully.",
        data: regDataType,
      });
    },
  );

// ==========================================
// Update RegDataType
// ==========================================

export const updateRegDataType =
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
          "Invalid reg data type ID.",
          400,
        );
      }

      // ==========================================
      // Check Event
      // ==========================================

      const event = await Event.findById(
        eventId,
      );

      if (!event) {
        throw new AppError(
          "Event not found.",
          404,
        );
      }

      // ==========================================
      // Get RegDataType
      // ==========================================

      const regDataType =
        await RegDataType.findOne({
          _id: id,
          eventId,
        });

      if (!regDataType) {
        throw new AppError(
          "Reg data type not found in this event.",
          404,
        );
      }

      // ==========================================
      // RegDataType Name
      // ==========================================

      if (
        req.body.regDataTypeName !==
        undefined
      ) {
        const existing =
          await RegDataType.findOne({
            eventId,
            regDataTypeName:
              req.body.regDataTypeName.trim(),
            _id: {
              $ne: id,
            },
          });

        if (existing) {
          throw new AppError(
            "Reg data type name already exists in this event.",
            409,
          );
        }

        regDataType.regDataTypeName =
          req.body.regDataTypeName;
      }

      // ==========================================
      // Save
      // ==========================================

      await regDataType.save();

      // ==========================================
      // Populate Event
      // ==========================================

      await regDataType.populate(
        "eventId",
      );

      return successResponse(res, {
        message:
          "Reg data type updated successfully.",
        data: regDataType,
      });
    },
  );

// ==========================================
// Delete RegDataType
// ==========================================

export const deleteRegDataType =
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
          "Invalid reg data type ID.",
          400,
        );
      }

      // ==========================================
      // Delete RegDataType
      // ==========================================

      const regDataType =
        await RegDataType.findOne({
          _id: id,
          eventId,
        });

      if (!regDataType) {
        throw new AppError(
          "Reg data type not found in this event.",
          404,
        );
      }

      await regDataType.deleteOne();

      return successResponse(res, {
        message:
          "Reg data type deleted successfully.",
        data: null,
      });
    },
  );