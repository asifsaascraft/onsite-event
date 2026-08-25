import mongoose from "mongoose";
import Event from "../models/Event.js";
import Organizer from "../models/Organizer.js";
import Venue from "../models/Venue.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/response.js";
import {
  getPagination,
  buildPaginationMeta,
} from "../utils/pagination.js";
import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";
import deleteS3Object from "../utils/deleteS3Object.js";

// ==========================================
// Create Event
// ==========================================
export const createEvent = asyncHandler(
  async (req, res) => {
    const {
      eventName,
      eventShortName,
      operatorLoginCode,
      organizerId,
      venueId,
      startDate,
      endDate,
    } = req.body;

    // ==========================================
    // Check Organizer
    // ==========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        organizerId,
      )
    ) {
      throw new AppError(
        "Invalid organizer ID.",
        400,
      );
    }

    const organizer =
      await Organizer.findById(
        organizerId,
      );

    if (!organizer) {
      throw new AppError(
        "Organizer not found.",
        404,
      );
    }

    // ==========================================
    // Check Venue
    // ==========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        venueId,
      )
    ) {
      throw new AppError(
        "Invalid venue ID.",
        400,
      );
    }

    const venue =
      await Venue.findById(venueId);

    if (!venue) {
      throw new AppError(
        "Venue not found.",
        404,
      );
    }

    // ==========================================
    // Check Event Short Name
    // ==========================================

    const existingShortName =
      await Event.findOne({
        eventShortName:
          eventShortName.trim(),
      });

    if (existingShortName) {
      throw new AppError(
        "Event short name already exists.",
        409,
      );
    }

    // ==========================================
    // Check Operator Login Code
    // ==========================================

    const existingOperatorCode =
      await Event.findOne({
        operatorLoginCode:
          operatorLoginCode.trim(),
      });

    if (existingOperatorCode) {
      throw new AppError(
        "Operator login code already exists.",
        409,
      );
    }

    // ==========================================
    // Check Dates
    // ==========================================

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      throw new AppError(
        "End date must be greater than or equal to start date.",
        400,
      );
    }

    // ==========================================
    // Create Event
    // ==========================================

    const event =
      await Event.create({
        eventName,
        eventShortName,
        operatorLoginCode,
        organizerId,
        venueId,
        startDate: start,
        endDate: end,
        uploadEventLogo:
          req.file?.location || null,
      });

    // ==========================================
    // Populate
    // ==========================================

    await event.populate([
      {
        path: "organizerId",
      },
      {
        path: "venueId",
      },
    ]);

    return successResponse(res, {
      statusCode: 201,
      message: "Event created successfully.",
      data: event,
    });
  },
);

// ==========================================
// Get All Events
// ==========================================
export const getEvents = asyncHandler(
  async (req, res) => {
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
        "eventName",
        "eventShortName",
        "operatorLoginCode",
      ]);

    // ==========================================
    // Filters
    // ==========================================

    const filtersQuery = {};

    if (req.query.organizerId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.query.organizerId,
        )
      ) {
        throw new AppError(
          "Invalid organizer ID.",
          400,
        );
      }

      filtersQuery.organizerId =
        req.query.organizerId;
    }

    if (req.query.venueId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.query.venueId,
        )
      ) {
        throw new AppError(
          "Invalid venue ID.",
          400,
        );
      }

      filtersQuery.venueId =
        req.query.venueId;
    }

    // ==========================================
    // Combine Query
    // ==========================================

    const query = {
      ...filtersQuery,
      ...searchQuery,
    };

    // ==========================================
    // Sort
    // ==========================================

    const sortQuery =
      buildSortQuery(
        req,
        [
          "eventName",
          "eventShortName",
          "startDate",
          "endDate",
          "createdAt",
        ],
        "createdAt",
      );

    // ==========================================
    // Get Events
    // ==========================================

    const [
      events,
      total,
    ] = await Promise.all([
      Event.find(query)
        .populate("organizerId")
        .populate("venueId")
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),

      Event.countDocuments(query),
    ]);

    return successResponse(res, {
      message:
        "Events fetched successfully.",
      data: events,
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
// Get Event By ID
// ==========================================
export const getEventById =
  asyncHandler(
    async (req, res) => {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id,
        )
      ) {
        throw new AppError(
          "Invalid event ID.",
          400,
        );
      }

      const event =
        await Event.findById(id)
          .populate("organizerId")
          .populate("venueId");

      if (!event) {
        throw new AppError(
          "Event not found.",
          404,
        );
      }

      return successResponse(res, {
        message:
          "Event fetched successfully.",
        data: event,
      });
    },
  );

// ==========================================
// Update Event
// ==========================================
export const updateEvent =
  asyncHandler(
    async (req, res) => {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id,
        )
      ) {
        throw new AppError(
          "Invalid event ID.",
          400,
        );
      }

      const event =
        await Event.findById(id);

      if (!event) {
        throw new AppError(
          "Event not found.",
          404,
        );
      }

      // ==========================================
      // Event Short Name
      // ==========================================

      if (
        req.body.eventShortName !==
        undefined
      ) {
        const existing =
          await Event.findOne({
            eventShortName:
              req.body.eventShortName.trim(),

            _id: {
              $ne: id,
            },
          });

        if (existing) {
          throw new AppError(
            "Event short name already exists.",
            409,
          );
        }

        event.eventShortName =
          req.body.eventShortName;
      }

      // ==========================================
      // Operator Login Code
      // ==========================================

      if (
        req.body.operatorLoginCode !==
        undefined
      ) {
        const existing =
          await Event.findOne({
            operatorLoginCode:
              req.body.operatorLoginCode.trim(),

            _id: {
              $ne: id,
            },
          });

        if (existing) {
          throw new AppError(
            "Operator login code already exists.",
            409,
          );
        }

        event.operatorLoginCode =
          req.body.operatorLoginCode;
      }

      // ==========================================
      // Event Name
      // ==========================================

      if (
        req.body.eventName !==
        undefined
      ) {
        event.eventName =
          req.body.eventName;
      }

      // ==========================================
      // Organizer
      // ==========================================

      if (
        req.body.organizerId !==
        undefined
      ) {
        if (
          !mongoose.Types.ObjectId.isValid(
            req.body.organizerId,
          )
        ) {
          throw new AppError(
            "Invalid organizer ID.",
            400,
          );
        }

        const organizer =
          await Organizer.findById(
            req.body.organizerId,
          );

        if (!organizer) {
          throw new AppError(
            "Organizer not found.",
            404,
          );
        }

        event.organizerId =
          req.body.organizerId;
      }

      // ==========================================
      // Venue
      // ==========================================

      if (
        req.body.venueId !==
        undefined
      ) {
        if (
          !mongoose.Types.ObjectId.isValid(
            req.body.venueId,
          )
        ) {
          throw new AppError(
            "Invalid venue ID.",
            400,
          );
        }

        const venue =
          await Venue.findById(
            req.body.venueId,
          );

        if (!venue) {
          throw new AppError(
            "Venue not found.",
            404,
          );
        }

        event.venueId =
          req.body.venueId;
      }

      // ==========================================
      // Dates
      // ==========================================

      if (
        req.body.startDate !==
        undefined
      ) {
        event.startDate =
          new Date(
            req.body.startDate,
          );
      }

      if (
        req.body.endDate !==
        undefined
      ) {
        event.endDate =
          new Date(
            req.body.endDate,
          );
      }

      if (
        event.endDate <
        event.startDate
      ) {
        throw new AppError(
          "End date must be greater than or equal to start date.",
          400,
        );
      }

      // ==========================================
      // Event Logo
      // ==========================================

      if (req.file) {
        const oldLogo =
          event.uploadEventLogo;

        event.uploadEventLogo =
          req.file.location;

        if (oldLogo) {
          await deleteS3Object(
            oldLogo,
          );
        }
      }

      // ==========================================
      // Save
      // ==========================================

      await event.save();

      // ==========================================
      // Populate
      // ==========================================

      await event.populate([
        {
          path: "organizerId",
        },
        {
          path: "venueId",
        },
      ]);

      return successResponse(res, {
        message:
          "Event updated successfully.",
        data: event,
      });
    },
  );

// ==========================================
// Delete Event
// ==========================================
export const deleteEvent =
  asyncHandler(
    async (req, res) => {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id,
        )
      ) {
        throw new AppError(
          "Invalid event ID.",
          400,
        );
      }

      const event =
        await Event.findById(id);

      if (!event) {
        throw new AppError(
          "Event not found.",
          404,
        );
      }

      // ==========================================
      // Delete Event Logo
      // ==========================================

      if (event.uploadEventLogo) {
        await deleteS3Object(
          event.uploadEventLogo,
        );
      }

      // ==========================================
      // Delete Event
      // ==========================================

      await event.deleteOne();

      return successResponse(res, {
        message:
          "Event deleted successfully.",
        data: null,
      });
    },
  );