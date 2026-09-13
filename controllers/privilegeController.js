import mongoose from "mongoose";

import Privilege from "../models/Privilege.js";
import Event from "../models/Event.js";
import RegDataType from "../models/RegDataType.js";
import Category from "../models/Category.js";

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
// Create Privilege
// ==========================================

export const createPrivilege = asyncHandler(
  async (req, res) => {
    const { eventId } = req.params;

    const {
      regDataTypeId,
      categoryId,
      isAllowed,
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
    // Validate RegDataType ID
    // ==========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        regDataTypeId,
      )
    ) {
      throw new AppError(
        "Invalid reg data type ID.",
        400,
      );
    }

    // ==========================================
    // Validate Category ID
    // ==========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        categoryId,
      )
    ) {
      throw new AppError(
        "Invalid category ID.",
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
    // Check RegDataType
    // ==========================================

    const regDataType =
      await RegDataType.findOne({
        _id: regDataTypeId,
        eventId,
      });

    if (!regDataType) {
      throw new AppError(
        "Reg data type not found in this event.",
        404,
      );
    }

    // ==========================================
    // Check Category
    // ==========================================

    const category =
      await Category.findOne({
        _id: categoryId,
        eventId,
      });

    if (!category) {
      throw new AppError(
        "Category not found in this event.",
        404,
      );
    }

    // ==========================================
    // Check Duplicate Privilege
    // ==========================================

    const existingPrivilege =
      await Privilege.findOne({
        eventId,
        regDataTypeId,
        categoryId,
      });

    if (existingPrivilege) {
      throw new AppError(
        "Privilege already exists for this reg data type and category.",
        409,
      );
    }

    // ==========================================
    // Create Privilege
    // ==========================================

    const privilege =
      await Privilege.create({
        eventId,
        regDataTypeId,
        categoryId,
        isAllowed,
      });

    // ==========================================
    // Populate Event
    // ==========================================

    await privilege.populate(
      "eventId",
      "eventName eventShortName",
    );

    // ==========================================
    // Populate RegDataType
    // ==========================================

    await privilege.populate(
      "regDataTypeId",
      "regDataTypeName",
    );

    // ==========================================
    // Populate Category
    // ==========================================

    await privilege.populate(
      "categoryId",
      "categoryCode categoryName status",
    );

    return successResponse(res, {
      statusCode: 201,
      message:
        "Privilege created successfully.",
      data: privilege,
    });
  },
);

// ==========================================
// Get All Privileges
// ==========================================

export const getPrivileges = asyncHandler(
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
        "isAllowed",
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
          "isAllowed",
          "createdAt",
        ],
        "createdAt",
      );

    // ==========================================
    // Get Privileges
    // ==========================================

    const [
      privileges,
      total,
    ] = await Promise.all([
      Privilege.find(query)
        .populate(
          "eventId",
          "eventName eventShortName",
        )
        .populate(
          "regDataTypeId",
          "regDataTypeName",
        )
        .populate(
          "categoryId",
          "categoryCode categoryName status",
        )
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),

      Privilege.countDocuments(query),
    ]);

    return successResponse(res, {
      message:
        "Privileges fetched successfully.",
      data: privileges,
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
// Get Privilege Matrix
// ==========================================

export const getPrivilegeMatrix =
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
      // Get RegDataTypes
      // ==========================================

      const regDataTypes =
        await RegDataType.find({
          eventId,
        })
          .select(
            "_id regDataTypeName",
          )
          .sort({
            regDataTypeName: 1,
          });

      // ==========================================
      // Get Categories
      // ==========================================

      const categories =
        await Category.find({
          eventId,
        })
          .select(
            "_id categoryCode categoryName status",
          )
          .sort({
            categoryName: 1,
          });

      // ==========================================
      // Get Privileges
      // ==========================================

      const privileges =
        await Privilege.find({
          eventId,
        }).select(
          "_id regDataTypeId categoryId isAllowed",
        );

      return successResponse(res, {
        message:
          "Privilege matrix fetched successfully.",

        data: {
          regDataTypes,
          categories,
          privileges,
        },
      });
    },
  );

// ==========================================
// Get Privilege By ID
// ==========================================

export const getPrivilegeById =
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
          "Invalid privilege ID.",
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
      // Get Privilege
      // ==========================================

      const privilege =
        await Privilege.findOne({
          _id: id,
          eventId,
        })
          .populate(
            "eventId",
            "eventName eventShortName",
          )
          .populate(
            "regDataTypeId",
            "regDataTypeName",
          )
          .populate(
            "categoryId",
            "categoryCode categoryName status",
          );

      if (!privilege) {
        throw new AppError(
          "Privilege not found in this event.",
          404,
        );
      }

      return successResponse(res, {
        message:
          "Privilege fetched successfully.",
        data: privilege,
      });
    },
  );

// ==========================================
// Update Privilege
// ==========================================

export const updatePrivilege =
  asyncHandler(
    async (req, res) => {
      const {
        eventId,
        id,
      } = req.params;

      const {
        regDataTypeId,
        categoryId,
        isAllowed,
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
          "Invalid privilege ID.",
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
      // Get Privilege
      // ==========================================

      const privilege =
        await Privilege.findOne({
          _id: id,
          eventId,
        });

      if (!privilege) {
        throw new AppError(
          "Privilege not found in this event.",
          404,
        );
      }

      // ==========================================
      // Validate RegDataType
      // ==========================================

      if (
        regDataTypeId !==
        undefined
      ) {
        if (
          !mongoose.Types.ObjectId.isValid(
            regDataTypeId,
          )
        ) {
          throw new AppError(
            "Invalid reg data type ID.",
            400,
          );
        }

        const regDataType =
          await RegDataType.findOne({
            _id: regDataTypeId,
            eventId,
          });

        if (!regDataType) {
          throw new AppError(
            "Reg data type not found in this event.",
            404,
          );
        }

        privilege.regDataTypeId =
          regDataTypeId;
      }

      // ==========================================
      // Validate Category
      // ==========================================

      if (
        categoryId !==
        undefined
      ) {
        if (
          !mongoose.Types.ObjectId.isValid(
            categoryId,
          )
        ) {
          throw new AppError(
            "Invalid category ID.",
            400,
          );
        }

        const category =
          await Category.findOne({
            _id: categoryId,
            eventId,
          });

        if (!category) {
          throw new AppError(
            "Category not found in this event.",
            404,
          );
        }

        privilege.categoryId =
          categoryId;
      }

      // ==========================================
      // Check Duplicate Combination
      // ==========================================

      if (
        regDataTypeId !==
          undefined ||
        categoryId !==
          undefined
      ) {
        const existing =
          await Privilege.findOne({
            eventId,
            regDataTypeId:
              privilege.regDataTypeId,
            categoryId:
              privilege.categoryId,
            _id: {
              $ne: id,
            },
          });

        if (existing) {
          throw new AppError(
            "Privilege already exists for this reg data type and category.",
            409,
          );
        }
      }

      // ==========================================
      // Permission
      // ==========================================

      if (
        isAllowed !==
        undefined
      ) {
        privilege.isAllowed =
          isAllowed;
      }

      // ==========================================
      // Save
      // ==========================================

      await privilege.save();

      // ==========================================
      // Populate Event
      // ==========================================

      await privilege.populate(
        "eventId",
        "eventName eventShortName",
      );

      // ==========================================
      // Populate RegDataType
      // ==========================================

      await privilege.populate(
        "regDataTypeId",
        "regDataTypeName",
      );

      // ==========================================
      // Populate Category
      // ==========================================

      await privilege.populate(
        "categoryId",
        "categoryCode categoryName status",
      );

      return successResponse(res, {
        message:
          "Privilege updated successfully.",
        data: privilege,
      });
    },
  );

// ==========================================
// Delete Privilege
// ==========================================

export const deletePrivilege =
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
          "Invalid privilege ID.",
          400,
        );
      }

      // ==========================================
      // Get Privilege
      // ==========================================

      const privilege =
        await Privilege.findOne({
          _id: id,
          eventId,
        });

      if (!privilege) {
        throw new AppError(
          "Privilege not found in this event.",
          404,
        );
      }

      // ==========================================
      // Delete Privilege
      // ==========================================

      await privilege.deleteOne();

      return successResponse(res, {
        message:
          "Privilege deleted successfully.",
        data: null,
      });
    },
  );

// ==========================================
// Allow All Categories
// ==========================================

export const allowAllCategories =
  asyncHandler(
    async (req, res) => {
      const {
        eventId,
        regDataTypeId,
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
          regDataTypeId,
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

      const event =
        await Event.findById(eventId);

      if (!event) {
        throw new AppError(
          "Event not found.",
          404,
        );
      }

      // ==========================================
      // Check RegDataType
      // ==========================================

      const regDataType =
        await RegDataType.findOne({
          _id: regDataTypeId,
          eventId,
        });

      if (!regDataType) {
        throw new AppError(
          "Reg data type not found in this event.",
          404,
        );
      }

      // ==========================================
      // Get Event Categories
      // ==========================================

      const categories =
        await Category.find({
          eventId,
        }).select("_id");

      // ==========================================
      // Update Privileges
      // ==========================================

      const operations =
        categories.map(
          (category) => ({
            updateOne: {
              filter: {
                eventId,
                regDataTypeId,
                categoryId:
                  category._id,
              },

              update: {
                $set: {
                  isAllowed: true,
                },
              },

              upsert: true,
            },
          }),
        );

      if (operations.length > 0) {
        await Privilege.bulkWrite(
          operations,
        );
      }

      return successResponse(res, {
        message:
          "All categories allowed successfully.",
        data: null,
      });
    },
  );

// ==========================================
// Block All Categories
// ==========================================

export const blockAllCategories =
  asyncHandler(
    async (req, res) => {
      const {
        eventId,
        regDataTypeId,
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
          regDataTypeId,
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

      const event =
        await Event.findById(eventId);

      if (!event) {
        throw new AppError(
          "Event not found.",
          404,
        );
      }

      // ==========================================
      // Check RegDataType
      // ==========================================

      const regDataType =
        await RegDataType.findOne({
          _id: regDataTypeId,
          eventId,
        });

      if (!regDataType) {
        throw new AppError(
          "Reg data type not found in this event.",
          404,
        );
      }

      // ==========================================
      // Get Event Categories
      // ==========================================

      const categories =
        await Category.find({
          eventId,
        }).select("_id");

      // ==========================================
      // Update Privileges
      // ==========================================

      const operations =
        categories.map(
          (category) => ({
            updateOne: {
              filter: {
                eventId,
                regDataTypeId,
                categoryId:
                  category._id,
              },

              update: {
                $set: {
                  isAllowed: false,
                },
              },

              upsert: true,
            },
          }),
        );

      if (operations.length > 0) {
        await Privilege.bulkWrite(
          operations,
        );
      }

      return successResponse(res, {
        message:
          "All categories blocked successfully.",
        data: null,
      });
    },
  );