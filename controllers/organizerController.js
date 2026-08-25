import mongoose from "mongoose";
import Organizer from "../models/Organizer.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/response.js";
import {
  getPagination,
  buildPaginationMeta,
} from "../utils/pagination.js";
import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";
import buildFiltersQuery from "../utils/filters.js";

// ==========================================
// Create Organizer
// ==========================================
export const createOrganizer = asyncHandler(
  async (req, res) => {
    const {
      organizerName,
      contactPersonName,
      contactPersonEmail,
      contactPersonMobile,
    } = req.body;

    // ==========================================
    // Check Duplicate Organizer Name
    // ==========================================

    const existingOrganizer =
      await Organizer.findOne({
        organizerName: organizerName.trim(),
      });

    if (existingOrganizer) {
      throw new AppError(
        "Organizer with this name already exists.",
        409,
      );
    }

    // ==========================================
    // Check Duplicate Email
    // ==========================================

    const existingEmail =
      await Organizer.findOne({
        contactPersonEmail:
          contactPersonEmail.toLowerCase().trim(),
      });

    if (existingEmail) {
      throw new AppError(
        "Contact person email already exists.",
        409,
      );
    }

    // ==========================================
    // Check Duplicate Mobile
    // ==========================================

    if (contactPersonMobile) {
      const existingMobile =
        await Organizer.findOne({
          contactPersonMobile:
            contactPersonMobile.trim(),
        });

      if (existingMobile) {
        throw new AppError(
          "Contact person mobile already exists.",
          409,
        );
      }
    }

    // ==========================================
    // Create Organizer
    // ==========================================

    const organizer =
      await Organizer.create({
        organizerName,
        contactPersonName,
        contactPersonEmail,
        contactPersonMobile,
      });

    return successResponse(res, {
      statusCode: 201,
      message: "Organizer created successfully.",
      data: organizer,
    });
  },
);

// ==========================================
// Get All Organizers
// ==========================================
export const getOrganizers = asyncHandler(
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
        "organizerName",
        "contactPersonName",
        "contactPersonEmail",
        "contactPersonMobile",
      ]);

    // ==========================================
    // Filters
    // ==========================================

    const filtersQuery =
      buildFiltersQuery(req, []);

    // ==========================================
    // Sort
    // ==========================================

    const sortQuery =
      buildSortQuery(
        req,
        [
          "organizerName",
          "contactPersonName",
          "contactPersonEmail",
          "contactPersonMobile",
          "createdAt",
        ],
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
    // Get Organizers
    // ==========================================

    const [
      organizers,
      total,
    ] = await Promise.all([
      Organizer.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),

      Organizer.countDocuments(query),
    ]);

    return successResponse(res, {
      message:
        "Organizers fetched successfully.",
      data: organizers,
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
// Get Organizer By ID
// ==========================================
export const getOrganizerById =
  asyncHandler(
    async (req, res) => {
      const { id } = req.params;

      // ==========================================
      // Validate ObjectId
      // ==========================================

      if (
        !mongoose.Types.ObjectId.isValid(
          id,
        )
      ) {
        throw new AppError(
          "Invalid organizer ID.",
          400,
        );
      }

      // ==========================================
      // Find Organizer
      // ==========================================

      const organizer =
        await Organizer.findById(id);

      if (!organizer) {
        throw new AppError(
          "Organizer not found.",
          404,
        );
      }

      return successResponse(res, {
        message:
          "Organizer fetched successfully.",
        data: organizer,
      });
    },
  );

// ==========================================
// Update Organizer
// ==========================================
export const updateOrganizer =
  asyncHandler(
    async (req, res) => {
      const { id } = req.params;

      // ==========================================
      // Validate ObjectId
      // ==========================================

      if (
        !mongoose.Types.ObjectId.isValid(
          id,
        )
      ) {
        throw new AppError(
          "Invalid organizer ID.",
          400,
        );
      }

      // ==========================================
      // Find Organizer
      // ==========================================

      const organizer =
        await Organizer.findById(id);

      if (!organizer) {
        throw new AppError(
          "Organizer not found.",
          404,
        );
      }

      // ==========================================
      // Update Organizer Name
      // ==========================================

      if (
        req.body.organizerName !==
        undefined
      ) {
        const existingOrganizer =
          await Organizer.findOne({
            organizerName:
              req.body.organizerName.trim(),

            _id: {
              $ne: id,
            },
          });

        if (existingOrganizer) {
          throw new AppError(
            "Organizer with this name already exists.",
            409,
          );
        }

        organizer.organizerName =
          req.body.organizerName;
      }

      // ==========================================
      // Update Contact Person Name
      // ==========================================

      if (
        req.body.contactPersonName !==
        undefined
      ) {
        organizer.contactPersonName =
          req.body.contactPersonName;
      }

      // ==========================================
      // Update Contact Person Email
      // ==========================================

      if (
        req.body.contactPersonEmail !==
        undefined
      ) {
        const email =
          req.body.contactPersonEmail
            .toLowerCase()
            .trim();

        const existingEmail =
          await Organizer.findOne({
            contactPersonEmail: email,

            _id: {
              $ne: id,
            },
          });

        if (existingEmail) {
          throw new AppError(
            "Contact person email already exists.",
            409,
          );
        }

        organizer.contactPersonEmail =
          email;
      }

      // ==========================================
      // Update Contact Person Mobile
      // ==========================================

      if (
        req.body.contactPersonMobile !==
        undefined
      ) {
        const mobile =
          req.body.contactPersonMobile.trim();

        if (mobile) {
          const existingMobile =
            await Organizer.findOne({
              contactPersonMobile:
                mobile,

              _id: {
                $ne: id,
              },
            });

          if (existingMobile) {
            throw new AppError(
              "Contact person mobile already exists.",
              409,
            );
          }
        }

        organizer.contactPersonMobile =
          mobile || null;
      }

      // ==========================================
      // Save
      // ==========================================

      await organizer.save();

      return successResponse(res, {
        message:
          "Organizer updated successfully.",
        data: organizer,
      });
    },
  );

// ==========================================
// Delete Organizer
// ==========================================
export const deleteOrganizer =
  asyncHandler(
    async (req, res) => {
      const { id } = req.params;

      // ==========================================
      // Validate ObjectId
      // ==========================================

      if (
        !mongoose.Types.ObjectId.isValid(
          id,
        )
      ) {
        throw new AppError(
          "Invalid organizer ID.",
          400,
        );
      }

      // ==========================================
      // Find Organizer
      // ==========================================

      const organizer =
        await Organizer.findById(id);

      if (!organizer) {
        throw new AppError(
          "Organizer not found.",
          404,
        );
      }

      // ==========================================
      // Delete Organizer
      // ==========================================

      await organizer.deleteOne();

      return successResponse(res, {
        message:
          "Organizer deleted successfully.",
        data: null,
      });
    },
  );