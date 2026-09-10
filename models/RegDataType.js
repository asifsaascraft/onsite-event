import mongoose from "mongoose";

const RegDataTypeSchema = new mongoose.Schema(
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
    // RegDataType Information
    // ==========================================

    regDataTypeName: {
      type: String,
      required: [true, "Reg data type name is required."],
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// Indexes
// ==========================================

// Same RegDataType name can exist in different events,
// but cannot be duplicated inside the same event.
RegDataTypeSchema.index(
  {
    eventId: 1,
    regDataTypeName: 1,
  },
  {
    unique: true,
  },
);

RegDataTypeSchema.index({
  createdAt: -1,
});

// ==========================================
// JSON Transform
// ==========================================

RegDataTypeSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// ==========================================
// Export
// ==========================================

const RegDataType =
  mongoose.models.RegDataType ||
  mongoose.model("RegDataType", RegDataTypeSchema);

export default RegDataType;