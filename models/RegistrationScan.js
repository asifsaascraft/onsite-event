import mongoose from "mongoose";

const RegistrationScanSchema = new mongoose.Schema(
  {
    // ==========================================
    // Event
    // ==========================================

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required."],
      index: true,
    },

    // ==========================================
    // Registration Data
    // ==========================================

    registrationDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegistrationData",
      required: [
        true,
        "Registration data is required.",
      ],
      index: true,
    },

    // ==========================================
    // Category
    // ==========================================

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required."],
      index: true,
    },

    // ==========================================
    // Scan Information
    // ==========================================

    isScanned: {
      type: Boolean,
      default: true,
    },

    scannedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

// One registration can be scanned only once
// for the same category inside an event.
RegistrationScanSchema.index(
  {
    eventId: 1,
    registrationDataId: 1,
    categoryId: 1,
  },
  {
    unique: true,
  },
);

RegistrationScanSchema.index({
  createdAt: -1,
});

// ==========================================
// JSON Transform
// ==========================================

RegistrationScanSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;

    return ret;
  },
});

// ==========================================
// Export
// ==========================================

const RegistrationScan =
  mongoose.models.RegistrationScan ||
  mongoose.model(
    "RegistrationScan",
    RegistrationScanSchema,
  );

export default RegistrationScan;