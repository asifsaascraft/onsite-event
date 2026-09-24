import mongoose from "mongoose";
import XLSX from "xlsx";
import RegistrationData from "../models/RegistrationData.js";
import RegDataType from "../models/RegDataType.js";
import Event from "../models/Event.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/response.js";
import { getPagination, buildPaginationMeta } from "../utils/pagination.js";
import buildSearchQuery from "../utils/search.js";
import buildSortQuery from "../utils/sort.js";
import Category from "../models/Category.js";
import GroupCategory from "../models/GroupCategory.js";
import Privilege from "../models/Privilege.js";
import RegistrationScan from "../models/RegistrationScan.js";



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
// Get RegistrationData Summary
// ==========================================
export const getRegistrationDataSummary = asyncHandler(async (req, res) => {
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
  // Get Summary
  // ==========================================

  const [total, printed] = await Promise.all([
    RegistrationData.countDocuments({
      eventId,
    }),

    RegistrationData.countDocuments({
      eventId,
      isPrinted: true,
    }),
  ]);

  const notPrinted = total - printed;

  // ==========================================
  // Response
  // ==========================================

  return successResponse(res, {
    message: "Registration data summary fetched successfully.",
    data: {
      total,
      printed,
      notPrinted,
    },
  });
});


// ==========================================
// Get All Printed RegistrationData
// ==========================================
export const getAllPrintedRegistrationData = asyncHandler(
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
      isPrinted: true,
      ...searchQuery,
    };

    // ==========================================
    // Sort
    // ==========================================

    const sortQuery = buildSortQuery(
      req,
      ["regNum", "name", "printedAt", "createdAt"],
      "printedAt",
    );

    // ==========================================
    // Get Printed RegistrationData
    // ==========================================

    const [registrationData, total] = await Promise.all([
      RegistrationData.find(query)
        .populate(
          "eventId",
          "eventName eventShortName",
        )
        .populate(
          "regDataTypeId",
          "regDataTypeName",
        )
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),

      RegistrationData.countDocuments(query),
    ]);

    // ==========================================
    // Response
    // ==========================================

    return successResponse(res, {
      message:
        "Printed registration data fetched successfully.",

      data: registrationData,

      pagination: buildPaginationMeta(
        total,
        page,
        limit,
      ),
    });
  },
);


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
// Get Printed RegistrationData By ID
// ==========================================
export const getPrintedRegistrationDataById = asyncHandler(
  async (req, res) => {
    const { eventId, id } = req.params;

    // ==========================================
    // Validate Event ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new AppError("Invalid event ID.", 400);
    }

    // ==========================================
    // Validate RegistrationData ID
    // ==========================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(
        "Invalid registration data ID.",
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
    // Get Printed RegistrationData
    // ==========================================

    const registrationData = await RegistrationData.findOne({
      _id: id,
      eventId,
      isPrinted: true,
    })
      .populate(
        "eventId",
        "eventName eventShortName",
      )
      .populate(
        "regDataTypeId",
        "regDataTypeName",
      );

    // ==========================================
    // Check RegistrationData
    // ==========================================

    if (!registrationData) {
      throw new AppError(
        "Printed registration data not found in this event.",
        404,
      );
    }

    // ==========================================
    // Response
    // ==========================================

    return successResponse(res, {
      message:
        "Printed registration data fetched successfully.",

      data: registrationData,
    });
  },
);


// ==========================================
// Print RegistrationData
// ==========================================
export const printRegistrationData = asyncHandler(async (req, res) => {
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
  });

  if (!registrationData) {
    throw new AppError("Registration data not found in this event.", 404);
  }

  // ==========================================
  // Mark As Printed
  // ==========================================

  registrationData.isPrinted = true;
  registrationData.printedAt = new Date();

  await registrationData.save();

  // ==========================================
  // Populate Event
  // ==========================================

  await registrationData.populate("eventId", "eventName eventShortName");

  // ==========================================
  // Populate RegDataType
  // ==========================================

  await registrationData.populate("regDataTypeId", "regDataTypeName");

  // ==========================================
  // Response
  // ==========================================

  return successResponse(res, {
    message: "Registration data marked as printed successfully.",
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

// ==========================================
// Delete All RegistrationData
// ==========================================
export const deleteAllRegistrationData = asyncHandler(async (req, res) => {
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
  // Delete All RegistrationData
  // ==========================================

  const result = await RegistrationData.deleteMany({
    eventId,
  });

  return successResponse(res, {
    message: "All registration data deleted successfully.",
    data: {
      deletedCount: result.deletedCount,
    },
  });
});

// ==========================================
// Import RegistrationData
// ==========================================
export const importRegistrationData = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const { regDataTypeId } = req.body;

  // ==========================================
  // Validate Event ID
  // ==========================================

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID.", 400);
  }

  // ==========================================
  // Validate RegDataType ID
  // ==========================================

  if (!regDataTypeId || !mongoose.Types.ObjectId.isValid(regDataTypeId)) {
    throw new AppError("Valid reg data type ID is required.", 400);
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
  // Check File
  // ==========================================

  if (!req.file) {
    throw new AppError("CSV or Excel file is required.", 400);
  }

  // ==========================================
  // Read File
  // ==========================================

  const workbook = XLSX.read(req.file.buffer, {
    type: "buffer",
  });

  if (!workbook.SheetNames.length) {
    throw new AppError("The uploaded file does not contain any sheet.", 400);
  }

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
  });

  // ==========================================
  // Check Empty File
  // ==========================================

  if (!rows.length) {
    throw new AppError("The uploaded file is empty.", 400);
  }

  // ==========================================
  // Prepare RegistrationData
  // ==========================================

  const registrationDataList = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const name = String(row.name || "").trim();

    const regNum = String(row.regNum || "").trim();

    // ==========================================
    // Required Fields
    // ==========================================

    if (!name) {
      throw new AppError(`Name is required at row ${i + 2}.`, 400);
    }

    if (!regNum) {
      throw new AppError(
        `Registration number is required at row ${i + 2}.`,
        400,
      );
    }

    // ==========================================
    // Prepare Data
    // ==========================================

    registrationDataList.push({
      eventId,
      regDataTypeId,
      name,
      regNum,

      email: String(row.email || "").trim() || undefined,

      mobile: String(row.mobile || "").trim() || undefined,

      mciNumber: String(row.mciNumber || "").trim() || undefined,

      address: String(row.address || "").trim() || undefined,

      city: String(row.city || "").trim() || undefined,

      state: String(row.state || "").trim() || undefined,

      country: String(row.country || "").trim() || undefined,

      reference: String(row.reference || "").trim() || undefined,

      note: String(row.note || "").trim() || undefined,
    });
  }

  // ==========================================
  // Check Duplicate RegNum Inside File
  // ==========================================

  const regNums = registrationDataList.map((item) => item.regNum);

  const uniqueRegNums = new Set(regNums);

  if (uniqueRegNums.size !== regNums.length) {
    throw new AppError(
      "Duplicate registration number found in the uploaded file.",
      409,
    );
  }

  // ==========================================
  // Check Existing RegNum
  // ==========================================

  const existingRegistrationData = await RegistrationData.findOne({
    eventId,
    regNum: {
      $in: regNums,
    },
  }).select("regNum");

  if (existingRegistrationData) {
    throw new AppError(
      `Registration number ${existingRegistrationData.regNum} already exists in this event.`,
      409,
    );
  }

  // ==========================================
  // Import Data
  // ==========================================

  const importedData = await RegistrationData.insertMany(registrationDataList);

  return successResponse(res, {
    statusCode: 201,
    message: "Registration data imported successfully.",
    data: {
      importedCount: importedData.length,
    },
  });
});


// ==========================================
// Export RegistrationData
// ==========================================
export const exportRegistrationData = asyncHandler(
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
    // Get Registration Data
    // ==========================================

    const registrationData =
      await RegistrationData.find({
        eventId,
      })
        .populate(
          "regDataTypeId",
          "regDataTypeName",
        )
        .sort({
          createdAt: 1,
        })
        .lean();

    // ==========================================
    // Get Categories
    // ==========================================

    const categories = await Category.find({
      eventId,
    })
      .populate(
        "groupCategoryId",
        "groupCategoryName description",
      )
      .sort({
        createdAt: 1,
      })
      .lean();

    // ==========================================
    // Get Privileges
    // ==========================================

    const privileges = await Privilege.find({
      eventId,
    })
      .select(
        "regDataTypeId categoryId isAllowed",
      )
      .lean();

    // ==========================================
    // Get Registration Scans
    // ==========================================

    const scans = await RegistrationScan.find({
      eventId,
    })
      .select(
        "registrationDataId categoryId isScanned scannedAt",
      )
      .lean();

    // ==========================================
    // Create Privilege Map
    // ==========================================

    const privilegeMap = new Map();

    for (const privilege of privileges) {
      const key =
        `${privilege.regDataTypeId}_${privilege.categoryId}`;

      privilegeMap.set(
        key,
        privilege.isAllowed,
      );
    }

    // ==========================================
    // Create Scan Map
    // ==========================================

    const scanMap = new Map();

    for (const scan of scans) {
      const key =
        `${scan.registrationDataId}_${scan.categoryId}`;

      scanMap.set(key, {
        isScanned: scan.isScanned,
        scannedAt: scan.scannedAt,
      });
    }

    // ==========================================
    // Prepare Export Data
    // ==========================================

    const data = registrationData.map(
      (registration) => {
        const categoriesData = categories.map(
          (category) => {
            const privilegeKey =
              `${registration.regDataTypeId._id}_${category._id}`;

            const scanKey =
              `${registration._id}_${category._id}`;

            const isAllowed =
              privilegeMap.get(privilegeKey) || false;

            const scan =
              scanMap.get(scanKey);

            return {
              groupCategory: {
                _id:
                  category.groupCategoryId?._id ||
                  null,

                groupCategoryName:
                  category.groupCategoryId
                    ?.groupCategoryName ||
                  null,
              },

              category: {
                _id: category._id,

                categoryCode:
                  category.categoryCode,

                categoryName:
                  category.categoryName,

                status:
                  category.status,

                day:
                  category.day || null,

                hall:
                  category.hall || null,

                session:
                  category.session || null,

                time:
                  category.time || null,
              },

              isAllowed,

              isScanned:
                scan?.isScanned || false,

              scannedAt:
                scan?.scannedAt || null,
            };
          },
        );

        return {
          _id: registration._id,

          regNum:
            registration.regNum,

          name:
            registration.name,

          email:
            registration.email || null,

          mobile:
            registration.mobile || null,

          mciNumber:
            registration.mciNumber || null,

          address:
            registration.address || null,

          city:
            registration.city || null,

          state:
            registration.state || null,

          country:
            registration.country || null,

          reference:
            registration.reference || null,

          note:
            registration.note || null,

          regDataType: {
            _id:
              registration.regDataTypeId?._id ||
              null,

            regDataTypeName:
              registration.regDataTypeId
                ?.regDataTypeName ||
              null,
          },

          printing: {
            isPrinted:
              registration.isPrinted,

            printedAt:
              registration.printedAt || null,
          },

          categories:
            categoriesData,

          createdAt:
            registration.createdAt,

          updatedAt:
            registration.updatedAt,
        };
      },
    );

    // ==========================================
    // Response
    // ==========================================

    return successResponse(res, {
      message:
        "Registration data exported successfully.",

      data,
    });
  },
);