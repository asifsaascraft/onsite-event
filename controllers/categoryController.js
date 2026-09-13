import mongoose from "mongoose";

import Category from "../models/Category.js";
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
// Create Category
// ==========================================

export const createCategory = asyncHandler(
  async (req, res) => {
    const { eventId } = req.params;

    const {
      categoryCode,
      categoryName,
      groupCategoryId,
      status,
      day,
      hall,
      session,
      time,
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
    // Validate GroupCategory ID
    // ==========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        groupCategoryId,
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

    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(
        "Event not found.",
        404,
      );
    }

    // ==========================================
    // Check GroupCategory
    // ==========================================

    const groupCategory =
      await GroupCategory.findOne({
        _id: groupCategoryId,
        eventId,
      });

    if (!groupCategory) {
      throw new AppError(
        "Group category not found in this event.",
        404,
      );
    }

    // ==========================================
    // Check Duplicate Category Code
    // ==========================================

    const existingCategoryCode =
      await Category.findOne({
        eventId,
        categoryCode:
          categoryCode.trim(),
      });

    if (existingCategoryCode) {
      throw new AppError(
        "Category code already exists in this event.",
        409,
      );
    }

    // ==========================================
    // Check Duplicate Category Name
    // ==========================================

    const existingCategoryName =
      await Category.findOne({
        eventId,
        categoryName:
          categoryName.trim(),
      });

    if (existingCategoryName) {
      throw new AppError(
        "Category name already exists in this event.",
        409,
      );
    }

    // ==========================================
    // Create Category
    // ==========================================

    const category =
      await Category.create({
        eventId,
        categoryCode,
        categoryName,
        groupCategoryId,
        status,
        day,
        hall,
        session,
        time,
      });

    // ==========================================
    // Populate Event
    // ==========================================

    await category.populate(
      "eventId",
      "eventName eventShortName",
    );

    // ==========================================
    // Populate GroupCategory
    // ==========================================

    await category.populate(
      "groupCategoryId",
      "groupCategoryName description",
    );

    return successResponse(res, {
      statusCode: 201,
      message:
        "Category created successfully.",
      data: category,
    });
  },
);

// ==========================================
// Get All Categories
// ==========================================

export const getCategories = asyncHandler(
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
        "categoryCode",
        "categoryName",
        "day",
        "hall",
        "session",
        "time",
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
          "categoryCode",
          "categoryName",
          "status",
          "createdAt",
        ],
        "createdAt",
      );

    // ==========================================
    // Get Categories
    // ==========================================

    const [
      categories,
      total,
    ] = await Promise.all([
      Category.find(query)
        .populate(
          "eventId",
          "eventName eventShortName",
        )
        .populate(
          "groupCategoryId",
          "groupCategoryName description",
        )
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),

      Category.countDocuments(query),
    ]);

    return successResponse(res, {
      message:
        "Categories fetched successfully.",
      data: categories,
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
// Get Active Categories
// ==========================================

export const getActiveCategories =
  asyncHandler(
    async (req, res) => {
      const { eventId } = req.params;

      // ==========================================
      // Validate Event ID
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

      // ==========================================
      // Check Event
      // ==========================================

      const event =
        await Event.findById(eventId);

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
          "categoryCode",
          "categoryName",
          "day",
          "hall",
          "session",
          "time",
        ]);

      // ==========================================
      // Query
      // ==========================================

      const query = {
        eventId,
        status: "active",
        ...searchQuery,
      };

      // ==========================================
      // Sort
      // ==========================================

      const sortQuery =
        buildSortQuery(
          req,
          [
            "categoryCode",
            "categoryName",
            "createdAt",
          ],
          "createdAt",
        );

      // ==========================================
      // Get Active Categories
      // ==========================================

      const [
        categories,
        total,
      ] = await Promise.all([
        Category.find(query)
          .populate(
            "eventId",
            "eventName eventShortName",
          )
          .populate(
            "groupCategoryId",
            "groupCategoryName description",
          )
          .sort(sortQuery)
          .skip(skip)
          .limit(limit),

        Category.countDocuments(query),
      ]);

      return successResponse(res, {
        message:
          "Active categories fetched successfully.",
        data: categories,
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
// Get Category By ID
// ==========================================

export const getCategoryById =
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
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        throw new AppError(
          "Invalid category ID.",
          400,
        );
      }

      // ==========================================
      // Check Event
      // ==========================================

      const event =
        await Event.findById(eventId);

      if (!event) {
        throw new AppError(
          "Event not found.",
          404,
        );
      }

      // ==========================================
      // Get Category
      // ==========================================

      const category =
        await Category.findOne({
          _id: id,
          eventId,
        })
          .populate(
            "eventId",
            "eventName eventShortName",
          )
          .populate(
            "groupCategoryId",
            "groupCategoryName description",
          );

      if (!category) {
        throw new AppError(
          "Category not found in this event.",
          404,
        );
      }

      return successResponse(res, {
        message:
          "Category fetched successfully.",
        data: category,
      });
    },
  );

// ==========================================
// Update Category
// ==========================================

export const updateCategory =
  asyncHandler(
    async (req, res) => {
      const {
        eventId,
        id,
      } = req.params;

      const {
        categoryCode,
        categoryName,
        groupCategoryId,
        status,
        day,
        hall,
        session,
        time,
      } = req.body;

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
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        throw new AppError(
          "Invalid category ID.",
          400,
        );
      }

      // ==========================================
      // Check Event
      // ==========================================

      const event =
        await Event.findById(eventId);

      if (!event) {
        throw new AppError(
          "Event not found.",
          404,
        );
      }

      // ==========================================
      // Get Category
      // ==========================================

      const category =
        await Category.findOne({
          _id: id,
          eventId,
        });

      if (!category) {
        throw new AppError(
          "Category not found in this event.",
          404,
        );
      }

      // ==========================================
      // Validate GroupCategory
      // ==========================================

      if (
        groupCategoryId !==
        undefined
      ) {
        if (
          !mongoose.Types.ObjectId.isValid(
            groupCategoryId,
          )
        ) {
          throw new AppError(
            "Invalid group category ID.",
            400,
          );
        }

        const groupCategory =
          await GroupCategory.findOne({
            _id: groupCategoryId,
            eventId,
          });

        if (!groupCategory) {
          throw new AppError(
            "Group category not found in this event.",
            404,
          );
        }

        category.groupCategoryId =
          groupCategoryId;
      }

      // ==========================================
      // Category Code
      // ==========================================

      if (
        categoryCode !==
        undefined
      ) {
        const existing =
          await Category.findOne({
            eventId,
            categoryCode:
              categoryCode.trim(),
            _id: {
              $ne: id,
            },
          });

        if (existing) {
          throw new AppError(
            "Category code already exists in this event.",
            409,
          );
        }

        category.categoryCode =
          categoryCode;
      }

      // ==========================================
      // Category Name
      // ==========================================

      if (
        categoryName !==
        undefined
      ) {
        const existing =
          await Category.findOne({
            eventId,
            categoryName:
              categoryName.trim(),
            _id: {
              $ne: id,
            },
          });

        if (existing) {
          throw new AppError(
            "Category name already exists in this event.",
            409,
          );
        }

        category.categoryName =
          categoryName;
      }

      // ==========================================
      // Status
      // ==========================================

      if (
        status !== undefined
      ) {
        category.status = status;
      }

      // ==========================================
      // Day
      // ==========================================

      if (
        day !== undefined
      ) {
        category.day = day;
      }

      // ==========================================
      // Hall
      // ==========================================

      if (
        hall !== undefined
      ) {
        category.hall = hall;
      }

      // ==========================================
      // Session
      // ==========================================

      if (
        session !== undefined
      ) {
        category.session = session;
      }

      // ==========================================
      // Time
      // ==========================================

      if (
        time !== undefined
      ) {
        category.time = time;
      }

      // ==========================================
      // Save
      // ==========================================

      await category.save();

      // ==========================================
      // Populate Event
      // ==========================================

      await category.populate(
        "eventId",
        "eventName eventShortName",
      );

      // ==========================================
      // Populate GroupCategory
      // ==========================================

      await category.populate(
        "groupCategoryId",
        "groupCategoryName description",
      );

      return successResponse(res, {
        message:
          "Category updated successfully.",
        data: category,
      });
    },
  );

// ==========================================
// Delete Category
// ==========================================

export const deleteCategory =
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
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        throw new AppError(
          "Invalid category ID.",
          400,
        );
      }

      // ==========================================
      // Delete Category
      // ==========================================

      const category =
        await Category.findOne({
          _id: id,
          eventId,
        });

      if (!category) {
        throw new AppError(
          "Category not found in this event.",
          404,
        );
      }

      await category.deleteOne();

      return successResponse(res, {
        message:
          "Category deleted successfully.",
        data: null,
      });
    },
  );