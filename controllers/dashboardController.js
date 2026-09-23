import mongoose from "mongoose";
import RegistrationData from "../models/RegistrationData.js";
import RegistrationScan from "../models/RegistrationScan.js";
import RegDataType from "../models/RegDataType.js";
import Category from "../models/Category.js";
import Event from "../models/Event.js";
import Privilege from "../models/Privilege.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { successResponse } from "../utils/response.js";

// ==========================================
// Get Dashboard Stats
// ==========================================
export const getDashboardStats = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID.", 400);
  }

  const event = await Event.findById(eventId);
  if (!event) throw new AppError("Event not found.", 404);

  // ── Print summary ─────────────────────────
  const [total, printed] = await Promise.all([
    RegistrationData.countDocuments({ eventId }),
    RegistrationData.countDocuments({ eventId, isPrinted: true }),
  ]);
  const notPrinted = total - printed;
  const printCoverage = total > 0 ? Math.round((printed / total) * 100) : 0;

  // ── Total scans ────────────────────────────
  const scansTotal = await RegistrationScan.countDocuments({ eventId });

  // ── Users by type (total vs printed) ──────
  const usersByTypeAgg = await RegistrationData.aggregate([
    { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: "$regDataTypeId",
        total: { $sum: 1 },
        printed: { $sum: { $cond: ["$isPrinted", 1, 0] } },
      },
    },
  ]);

  const regTypes = await RegDataType.find({ eventId }).select(
    "_id regDataTypeName",
  );
  const regTypeMap = new Map(
    regTypes.map((r) => [String(r._id), r.regDataTypeName]),
  );

  const usersByType = usersByTypeAgg.map((row) => ({
    type: regTypeMap.get(String(row._id)) || "Unknown",
    total: row.total,
    printed: row.printed,
  }));

  // ── Day-wise printed & total by type ──────
  const dayWiseAgg = await RegistrationData.aggregate([
    { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: {
          day: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          regDataTypeId: "$regDataTypeId",
        },
        total: { $sum: 1 },
        printed: { $sum: { $cond: ["$isPrinted", 1, 0] } },
      },
    },
    { $sort: { "_id.day": 1 } },
  ]);

  const daySet = new Set(dayWiseAgg.map((r) => r._id.day));
  const dayWisePrinted = [];
  const dayWiseTotal = [];
  for (const day of Array.from(daySet).sort()) {
    const rowPrinted = { day };
    const rowTotal = { day };
    for (const r of dayWiseAgg) {
      if (r._id.day !== day) continue;
      const name = regTypeMap.get(String(r._id.regDataTypeId)) || "Unknown";
      rowPrinted[name] = r.printed;
      rowTotal[name] = r.total;
    }
    dayWisePrinted.push(rowPrinted);
    dayWiseTotal.push(rowTotal);
  }

  // ── Scan activity by hour (today) ─────────
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const hourAgg = await RegistrationScan.aggregate([
    {
      $match: {
        eventId: new mongoose.Types.ObjectId(eventId),
        scannedAt: { $gte: startOfToday, $lte: endOfToday },
      },
    },
    {
      $group: {
        _id: { $hour: "$scannedAt" },
        scans: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const scanActivity = Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2, "0")}:00`,
    scans: hourAgg.find((r) => r._id === h)?.scans || 0,
  }));

  // ── Category coverage (scans by group) ────
  const categories = await Category.find({ eventId, status: "active" }).populate(
    "groupCategoryId",
    "groupCategoryName",
  );

  const categoryCoverage = [];
  for (const cat of categories) {
    const allowed = await Privilege.find({
      eventId,
      categoryId: cat._id,
      isAllowed: true,
    }).select("regDataTypeId");
    const allowedTypeIds = allowed.map((p) => p.regDataTypeId);

    const [catTotal, catScanned] = await Promise.all([
      RegistrationData.countDocuments({
        eventId,
        regDataTypeId: { $in: allowedTypeIds },
      }),
      RegistrationScan.countDocuments({ eventId, categoryId: cat._id }),
    ]);

    categoryCoverage.push({
      groupName: cat.groupCategoryId?.groupCategoryName || "Uncategorized",
      categoryName: cat.categoryName,
      scanned: catScanned,
      total: catTotal,
    });
  }

  const groupMap = new Map();
  for (const row of categoryCoverage) {
    if (!groupMap.has(row.groupName)) {
      groupMap.set(row.groupName, {
        groupName: row.groupName,
        categories: [],
      });
    }
    groupMap.get(row.groupName).categories.push({
      categoryName: row.categoryName,
      scanned: row.scanned,
      total: row.total,
    });
  }
  const scansByGroup = Array.from(groupMap.values());

  // ── Data quality ──────────────────────────
  const [missingEmail, missingPhone, missingImc] = await Promise.all([
    RegistrationData.countDocuments({
      eventId,
      $or: [{ email: "" }, { email: null }, { email: { $exists: false } }],
    }),
    RegistrationData.countDocuments({
      eventId,
      $or: [{ mobile: "" }, { mobile: null }, { mobile: { $exists: false } }],
    }),
    RegistrationData.countDocuments({
      eventId,
      $or: [
        { mciNumber: "" },
        { mciNumber: null },
        { mciNumber: { $exists: false } },
      ],
    }),
  ]);

  // ── Response ──────────────────────────────
  return successResponse(res, {
    message: "Dashboard stats fetched successfully.",
    data: {
      stats: {
        totalAttendees: total,
        badgesPrinted: printed,
        badgesNotPrinted: notPrinted,
        printCoverage,
        scansTotal,
        scansToday: hourAgg.reduce((s, r) => s + r.scans, 0),
        categories: categories.length,
      },
      usersByType,
      dayWisePrinted,
      dayWiseTotal,
      scanActivity,
      scansByGroup,
      dataQuality: {
        missingEmail,
        missingPhone,
        missingImc,
      },
    },
  });
});

// ==========================================
// Get Recent Scans
// ==========================================
export const getRecentScans = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID.", 400);
  }

  const scans = await RegistrationScan.find({ eventId })
    .populate("registrationDataId", "regNum name")
    .populate("categoryId", "categoryName")
    .sort({ scannedAt: -1 })
    .limit(limit);

  const data = scans.map((s) => ({
    _id: s._id,
    regNum: s.registrationDataId?.regNum || "",
    name: s.registrationDataId?.name || "",
    category: s.categoryId?.categoryName || "",
    scannedAt: s.scannedAt,
  }));

  return successResponse(res, {
    message: "Recent scans fetched successfully.",
    data,
  });
});