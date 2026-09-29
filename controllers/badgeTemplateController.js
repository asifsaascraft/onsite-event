import mongoose from "mongoose";
import BadgeTemplate from "../models/BadgeTemplate.js";
import Event from "../models/Event.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/response.js";

// Default template — used when none exists yet
export const DEFAULT_BADGE_FIELDS = [
  {
    key: "name",
    label: "Full Name",
    enabled: true,
    order: 0,
    fontSize: 26,
    fontWeight: "bold",
    align: "center",
  },
  {
    key: "qr",
    label: "QR Code",
    enabled: true,
    order: 1,
    fontSize: 80,
    fontWeight: "normal",
    align: "center",
  },
  {
    key: "regNum",
    label: "Reg No",
    enabled: true,
    order: 2,
    fontSize: 13,
    fontWeight: "bold",
    align: "center",
  },
  {
    key: "userTypeName",
    label: "Category",
    enabled: false,
    order: 3,
    fontSize: 14,
    fontWeight: "normal",
    align: "center",
  },
  {
    key: "email",
    label: "Email",
    enabled: false,
    order: 4,
    fontSize: 12,
    fontWeight: "normal",
    align: "center",
  },
  {
    key: "mobile",
    label: "Mobile",
    enabled: false,
    order: 5,
    fontSize: 12,
    fontWeight: "normal",
    align: "center",
  },
  {
    key: "mciNumber",
    label: "MCI Number",
    enabled: false,
    order: 6,
    fontSize: 12,
    fontWeight: "normal",
    align: "center",
  },
  {
    key: "city",
    label: "City",
    enabled: false,
    order: 7,
    fontSize: 12,
    fontWeight: "normal",
    align: "center",
  },
  {
    key: "state",
    label: "State",
    enabled: false,
    order: 8,
    fontSize: 12,
    fontWeight: "normal",
    align: "center",
  },
  {
    key: "country",
    label: "Country",
    enabled: false,
    order: 9,
    fontSize: 12,
    fontWeight: "normal",
    align: "center",
  },
  {
    key: "reference",
    label: "Reference",
    enabled: false,
    order: 10,
    fontSize: 12,
    fontWeight: "normal",
    align: "center",
  },
  {
    key: "note",
    label: "Note",
    enabled: false,
    order: 11,
    fontSize: 12,
    fontWeight: "normal",
    align: "center",
  },
];

// ==========================================
// Get Badge Template (creates default on first fetch)
// ==========================================
export const getBadgeTemplate = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID.", 400);
  }

  const event = await Event.findById(eventId);
  if (!event) throw new AppError("Event not found.", 404);

  let template = await BadgeTemplate.findOne({ eventId });

  if (!template) {
    template = await BadgeTemplate.create({
      eventId,
      fields: DEFAULT_BADGE_FIELDS,
      qrSize: 80,
      badgeWidthIn: 4,
      badgeHeightIn: 3,
    });
  }

  return successResponse(res, {
    message: "Badge template fetched successfully.",
    data: template,
  });
});

// ==========================================
// Save Badge Template
// ==========================================
export const saveBadgeTemplate = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { fields, qrSize, badgeWidthIn, badgeHeightIn } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID.", 400);
  }

  const event = await Event.findById(eventId);
  if (!event) throw new AppError("Event not found.", 404);

  if (!Array.isArray(fields)) {
    throw new AppError("fields must be an array.", 400);
  }

  const sanitizedFields = fields.map((f, i) => ({
    key: String(f.key),
    label: String(f.label ?? f.key),
    enabled: Boolean(f.enabled),
    order: Number.isFinite(f.order) ? f.order : i,
    fontSize: Number.isFinite(f.fontSize) ? f.fontSize : 14,
    fontWeight: f.fontWeight === "bold" ? "bold" : "normal",
    align: ["left", "center", "right"].includes(f.align) ? f.align : "center",
  }));

  const template = await BadgeTemplate.findOneAndUpdate(
    { eventId },
    {
      $set: {
        fields: sanitizedFields,
        qrSize: Number.isFinite(qrSize) ? qrSize : 80,
        badgeWidthIn: Number.isFinite(badgeWidthIn) ? badgeWidthIn : 4,
        badgeHeightIn: Number.isFinite(badgeHeightIn) ? badgeHeightIn : 3,
      },
    },
    { new: true, upsert: true },
  );

  return successResponse(res, {
    message: "Badge template saved successfully.",
    data: template,
  });
});
